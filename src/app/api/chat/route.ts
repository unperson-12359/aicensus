import { NextRequest } from "next/server";
import { streamText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { createClient } from "@/lib/supabase/server";
import {
  getToolsForRAG,
  getToolsForChatMeta,
  type RagTool,
  type MentionedTool,
} from "@/lib/queries/tools";

// Run on the Node.js runtime so @supabase/ssr (which reads cookies) works.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL_PRIMARY = "llama-3.3-70b-versatile";
const DAILY_LIMIT = 10;

type IncomingMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

/**
 * Attempt to increment and check the per-IP daily counter. Fails open on any
 * error (missing table, permission issue, etc.) so the chatbot works even
 * before the migration is applied.
 *
 * Returns `{ allowed: true }` if the request should proceed, or
 * `{ allowed: false, remaining: 0 }` if the IP has exceeded the limit.
 */
async function checkRateLimit(
  ip: string
): Promise<{ allowed: boolean; limit: number; remaining: number }> {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD, UTC
  try {
    const supabase = await createClient();

    // Read the current count.
    const { data: existing, error: readErr } = await supabase
      .from("chat_rate_limits")
      .select("count")
      .eq("ip", ip)
      .eq("day", today)
      .maybeSingle();

    if (readErr) {
      // Table doesn't exist or auth issue — fail open.
      console.warn("[ask] rate-limit read skipped:", readErr.message);
      return { allowed: true, limit: DAILY_LIMIT, remaining: DAILY_LIMIT };
    }

    const currentCount = (existing as { count?: number } | null)?.count ?? 0;

    if (currentCount >= DAILY_LIMIT) {
      return { allowed: false, limit: DAILY_LIMIT, remaining: 0 };
    }

    // Increment.
    const { error: writeErr } = await supabase
      .from("chat_rate_limits")
      .upsert(
        {
          ip,
          day: today,
          count: currentCount + 1,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "ip,day" }
      );

    if (writeErr) {
      console.warn("[ask] rate-limit write skipped:", writeErr.message);
      // Fail open if the write fails.
      return { allowed: true, limit: DAILY_LIMIT, remaining: DAILY_LIMIT };
    }

    return {
      allowed: true,
      limit: DAILY_LIMIT,
      remaining: Math.max(0, DAILY_LIMIT - (currentCount + 1)),
    };
  } catch (err) {
    console.warn("[ask] rate-limit errored, failing open:", err);
    return { allowed: true, limit: DAILY_LIMIT, remaining: DAILY_LIMIT };
  }
}

function formatToolsForPrompt(tools: RagTool[]): string {
  if (tools.length === 0) {
    return "No tools are currently available in the directory for this query.";
  }
  return tools
    .map((t, i) => {
      const rating = t.editor_rating ? `${t.editor_rating}/5` : "unrated";
      const features =
        t.key_features.length > 0
          ? ` Features: ${t.key_features.slice(0, 4).join(", ")}.`
          : "";
      const useCases =
        t.use_cases.length > 0
          ? ` Use cases: ${t.use_cases.slice(0, 3).join(", ")}.`
          : "";
      const category = t.category ? ` [${t.category}]` : "";
      return `${i + 1}. ${t.name} (slug: ${t.slug})${category} · pricing: ${t.pricing_model} · rating: ${rating}. Tagline: ${t.tagline}.${features}${useCases}`;
    })
    .join("\n");
}

function buildSystemPrompt(tools: RagTool[]): string {
  return `You are AiCensus, a sharp, opinionated AI-tools consultant for the AiCensus directory.

Rules (non-negotiable):
- Only recommend tools from the <TOOLS> block below. If nothing fits, say so plainly.
- Maximum 3 tools per response. Prefer 2 when that's enough.
- Reference every recommended tool inline using the EXACT format: [[tool:<slug>]]
- Never hedge. Pick a winner when you can.
- For each recommendation, give one sentence explaining *why* it fits the user's task.
- Be concise. No filler. No "Here are some options" preambles.
- Do not invent tools or slugs. If the user's need is outside the directory, say so and suggest a close-adjacent category.

Response shape:
1. One short opening sentence (what you'd pick, in plain language).
2. 2-3 short bullet-style lines, each of the form: <italicized tool name>: <one-sentence why>. [[tool:<slug>]]
3. Optional one-line closer with a tradeoff or caveat.

<TOOLS>
${formatToolsForPrompt(tools)}
</TOOLS>

Only the slugs listed above are valid. Do not fabricate slugs. If no tool fits, respond briefly and do not include any [[tool:...]] markers.`;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return jsonError(
      "Chat is not configured. Set GROQ_API_KEY in the environment.",
      503
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const messages = (body as { messages?: IncomingMessage[] })?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return jsonError("`messages` must be a non-empty array.", 400);
  }

  // Coerce to the minimal shape we trust. Cap history so we don't blow context.
  const normalized: IncomingMessage[] = messages
    .filter(
      (m): m is IncomingMessage =>
        m != null &&
        typeof m === "object" &&
        typeof (m as IncomingMessage).content === "string" &&
        (m as IncomingMessage).role != null &&
        ["user", "assistant", "system"].includes(
          (m as IncomingMessage).role as string
        )
    )
    .slice(-12)
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, 4000),
    }));

  if (normalized.length === 0) {
    return jsonError("No valid messages.", 400);
  }

  const lastUser = [...normalized].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    return jsonError("No user message found.", 400);
  }

  // Rate-limit (graceful: fails open on errors).
  const ip = getClientIp(request);
  const rate = await checkRateLimit(ip);
  if (!rate.allowed) {
    return new Response(
      JSON.stringify({
        error: "Daily limit reached. Try again tomorrow.",
        limit: rate.limit,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          "X-RateLimit-Limit": String(rate.limit),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // RAG: fetch candidate tools from the directory.
  let ragTools: RagTool[] = [];
  try {
    ragTools = await getToolsForRAG(lastUser.content, 20);
  } catch (err) {
    console.warn("[ask] RAG retrieval failed:", err);
    ragTools = [];
  }

  // Hydrate metadata for the candidate tools so the client can render rich
  // tool cards for any [[tool:slug]] the model ends up referencing.
  let candidateMeta: MentionedTool[] = [];
  try {
    candidateMeta = await getToolsForChatMeta(ragTools.map((t) => t.slug));
  } catch (err) {
    console.warn("[ask] tool metadata hydration failed:", err);
  }

  // Build the streamed response: a JSON header line with candidate tool
  // metadata, then newline, then pure LLM text. The client parses the header
  // first and streams the rest into the message body.
  const header =
    "__AICENSUS__" + JSON.stringify({ candidates: candidateMeta }) + "\n";

  const groq = createGroq({ apiKey });
  const systemPrompt = buildSystemPrompt(ragTools);

  try {
    const result = streamText({
      model: groq(MODEL_PRIMARY),
      system: systemPrompt,
      messages: normalized.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      temperature: 0.3,
      maxOutputTokens: 500,
    });

    // Prepend our JSON header to the streamed text response.
    const textStream = result.textStream;
    const encoder = new TextEncoder();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        controller.enqueue(encoder.encode(header));
        try {
          for await (const chunk of textStream) {
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (err) {
          console.error("[ask] stream error:", err);
          controller.enqueue(
            encoder.encode(
              "\n\n_The model errored mid-response. Please retry._"
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Accel-Buffering": "no",
        "X-RateLimit-Limit": String(rate.limit),
        "X-RateLimit-Remaining": String(rate.remaining),
      },
    });
  } catch (err) {
    console.error("[ask] model invocation failed:", err);
    return jsonError(
      "The model is unavailable right now. Please try again.",
      502
    );
  }
}
