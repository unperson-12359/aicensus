import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendContactNotification } from "@/lib/contact-notify";
import { captureException } from "@/lib/monitoring";

export const runtime = "nodejs";

const SUBJECTS = ["general", "bug", "partnership", "feedback", "other"] as const;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

interface PersistentRateLimitRow {
  request_count: number;
  window_start: string;
}

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  subject: z.enum(SUBJECTS),
  message: z.string().trim().min(10).max(4000),
  website: z.string().trim().max(250).optional(),
});

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function getClientKey(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    forwardedFor ||
    "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  return `${ip}:${userAgent.slice(0, 80)}`;
}

function hashClientKey(clientKey: string) {
  return createHash("sha256").update(clientKey).digest("hex");
}

async function isPersistentlyRateLimited(
  supabase: ReturnType<typeof createAdminClient>,
  request: NextRequest
) {
  if (!supabase) return false;

  const now = Date.now();
  const keyHash = hashClientKey(getClientKey(request));

  const { data, error } = await supabase
    .from("contact_rate_limits")
    .select("request_count, window_start")
    .eq("key_hash", keyHash)
    .maybeSingle();

  if (error) {
    if (error.code !== "42P01" && error.code !== "PGRST205") {
      captureException(error, { route: "contact", stage: "rate-limit-lookup" });
    }
    return false;
  }

  const row = data as PersistentRateLimitRow | null;
  const windowStart =
    row?.window_start ? new Date(row.window_start).getTime() : 0;
  const isFreshWindow = row && now - windowStart < RATE_LIMIT_WINDOW_MS;

  if (isFreshWindow && row.request_count >= RATE_LIMIT_MAX) {
    return true;
  }

  const nextCount = isFreshWindow ? row.request_count + 1 : 1;
  const nextWindowStart = isFreshWindow
    ? row.window_start
    : new Date(now).toISOString();

  const { error: upsertError } = await supabase
    .from("contact_rate_limits")
    .upsert(
      {
        key_hash: keyHash,
        request_count: nextCount,
        window_start: nextWindowStart,
        updated_at: new Date(now).toISOString(),
      },
      { onConflict: "key_hash" }
    );

  if (upsertError && upsertError.code !== "42P01" && upsertError.code !== "PGRST205") {
    captureException(upsertError, { route: "contact", stage: "rate-limit-update" });
  }

  return false;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(rawBody);

  if (!parsed.success) {
    return jsonResponse({ error: "Invalid contact message" }, 400);
  }

  const message = parsed.data;

  if (message.website) {
    return jsonResponse({ ok: true }, 202);
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return jsonResponse({ error: "Contact form is not configured" }, 503);
  }

  if (await isPersistentlyRateLimited(supabase, request)) {
    return jsonResponse({ error: "Too many messages. Please try again later." }, 429);
  }

  const { error } = await supabase.from("contact_messages").insert({
    name: message.name,
    email: message.email.toLowerCase(),
    subject: message.subject,
    message: message.message,
  });

  if (error) {
    captureException(error, { route: "contact", stage: "insert" });
    return jsonResponse({ error: "Could not send message" }, 500);
  }

  try {
    await sendContactNotification(message);
  } catch (notifyError) {
    captureException(notifyError, { route: "contact", stage: "notify" });
  }

  return jsonResponse({ ok: true });
}
