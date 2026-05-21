type ErrorContext = Record<string, unknown>;

function getSentryDsn(): string | undefined {
  return process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
}

function normalizeError(error: unknown): Error {
  if (error instanceof Error) return error;
  return new Error(typeof error === "string" ? error : "Unknown error");
}

/**
 * Report errors to console and optionally to Sentry when DSN is configured.
 * Works on server and client without requiring the full Sentry SDK at build time.
 */
export function captureException(error: unknown, context?: ErrorContext): void {
  const normalized = normalizeError(error);
  console.error("[AiCensus]", normalized.message, context ?? "", normalized.stack);

  const dsn = getSentryDsn();
  if (!dsn || typeof fetch === "undefined") return;

  try {
    const url = new URL(dsn);
    const projectId = url.pathname.replace(/^\//, "");
    const host = url.host;
    const publicKey = url.username;
    const sentryUrl = `https://${host}/api/${projectId}/store/`;

    void fetch(sentryUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Sentry-Auth": `Sentry sentry_version=7, sentry_key=${publicKey}, sentry_client=aicensus/1.0`,
      },
      body: JSON.stringify({
        event_id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        platform: typeof window === "undefined" ? "node" : "javascript",
        level: "error",
        message: normalized.message,
        exception: {
          values: [{ type: normalized.name, value: normalized.message, stacktrace: { frames: [] } }],
        },
        extra: context,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {
      // Ignore telemetry failures
    });
  } catch {
    // Ignore malformed DSN
  }
}

export function captureMessage(message: string, context?: ErrorContext): void {
  captureException(new Error(message), context);
}
