import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const SUBJECTS = ["general", "bug", "partnership", "feedback", "other"] as const;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

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

function getRateLimitStore() {
  const globalForRateLimit = globalThis as typeof globalThis & {
    __aicensusContactRateLimit?: Map<string, RateLimitBucket>;
  };

  if (!globalForRateLimit.__aicensusContactRateLimit) {
    globalForRateLimit.__aicensusContactRateLimit = new Map();
  }

  return globalForRateLimit.__aicensusContactRateLimit;
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

function isRateLimited(request: NextRequest) {
  const now = Date.now();
  const store = getRateLimitStore();
  const key = getClientKey(request);
  const bucket = store.get(key);

  if (!bucket || bucket.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (bucket.count >= RATE_LIMIT_MAX) {
    return true;
  }

  bucket.count += 1;
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

  if (isRateLimited(request)) {
    return jsonResponse({ error: "Too many messages. Please try again later." }, 429);
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return jsonResponse({ error: "Contact form is not configured" }, 503);
  }

  const { error } = await supabase.from("contact_messages").insert({
    name: message.name,
    email: message.email.toLowerCase(),
    subject: message.subject,
    message: message.message,
  });

  if (error) {
    console.error("Failed to save contact message:", error);
    return jsonResponse({ error: "Could not send message" }, 500);
  }

  return jsonResponse({ ok: true });
}
