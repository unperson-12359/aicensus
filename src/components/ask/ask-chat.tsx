"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sparkles, RotateCcw } from "lucide-react";
import { cn, getLogoUrl } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────

export type ChatRole = "user" | "assistant";

interface MentionedTool {
  slug: string;
  name: string;
  tagline: string;
  pricing_model: string;
  category: string | null;
  website_url: string;
  logo_url: string | null;
}

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  mentionedSlugs?: string[];
}

// ─── Suggestions shown before first message ──────────────────────────────

const SUGGESTIONS = [
  "I need to write a blog post — free only",
  "Best tool to generate product images",
  "Help me transcribe YouTube videos",
  "Cheap alternative to ChatGPT for coding",
];

// ─── Parsing helpers ─────────────────────────────────────────────────────

const TOOL_TOKEN = /\[\[tool:([a-z0-9-]+)\]\]/gi;

function extractSlugs(text: string): string[] {
  const slugs: string[] = [];
  const seen = new Set<string>();
  let match: RegExpExecArray | null;
  const re = new RegExp(TOOL_TOKEN.source, "gi");
  while ((match = re.exec(text)) !== null) {
    const s = match[1].toLowerCase();
    if (!seen.has(s)) {
      seen.add(s);
      slugs.push(s);
    }
  }
  return slugs;
}

/**
 * Lightweight markdown: bold (**x**), italic (*x*), and line breaks. Tool
 * tokens [[tool:slug]] are stripped out inline (rendered as cards below).
 */
function renderLite(
  text: string,
  lookup: Map<string, MentionedTool>
): React.ReactNode[] {
  // Remove tokens inline — we render tool names in italics with their actual
  // tool name when we can match the slug.
  const replaced = text.replace(TOOL_TOKEN, (_m, slug: string) => {
    const t = lookup.get(slug.toLowerCase());
    return t ? `*${t.name}*` : "";
  });

  const nodes: React.ReactNode[] = [];
  const lines = replaced.split("\n");

  lines.forEach((line, lineIdx) => {
    const segments: React.ReactNode[] = [];
    // Tokenise by **bold** and *italic* in one pass.
    const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
    let lastIndex = 0;
    let m: RegExpExecArray | null;
    let key = 0;
    while ((m = pattern.exec(line)) !== null) {
      if (m.index > lastIndex) {
        segments.push(line.slice(lastIndex, m.index));
      }
      const token = m[0];
      if (token.startsWith("**")) {
        segments.push(
          <strong key={`${lineIdx}-${key++}`} className="font-semibold">
            {token.slice(2, -2)}
          </strong>
        );
      } else {
        segments.push(
          <em
            key={`${lineIdx}-${key++}`}
            className="font-serif italic text-white"
          >
            {token.slice(1, -1)}
          </em>
        );
      }
      lastIndex = m.index + token.length;
    }
    if (lastIndex < line.length) {
      segments.push(line.slice(lastIndex));
    }
    nodes.push(
      <span key={`line-${lineIdx}`}>
        {segments}
        {lineIdx < lines.length - 1 && <br />}
      </span>
    );
  });

  return nodes;
}

// ─── Streaming: parse the header + body protocol ─────────────────────────

const HEADER_PREFIX = "__AICENSUS__";

interface ParsedHeader {
  candidates: MentionedTool[];
}

/** Consume text from the stream, extracting the header if present. */
function splitHeader(
  buffer: string
): { header: ParsedHeader | null; rest: string; complete: boolean } {
  if (!buffer.startsWith(HEADER_PREFIX)) {
    return { header: null, rest: buffer, complete: true };
  }
  const newlineIdx = buffer.indexOf("\n");
  if (newlineIdx === -1) {
    return { header: null, rest: "", complete: false };
  }
  const jsonStr = buffer.slice(HEADER_PREFIX.length, newlineIdx);
  try {
    const parsed = JSON.parse(jsonStr) as ParsedHeader;
    return {
      header: parsed,
      rest: buffer.slice(newlineIdx + 1),
      complete: true,
    };
  } catch {
    return { header: null, rest: buffer.slice(newlineIdx + 1), complete: true };
  }
}

// ─── Mini tool card ──────────────────────────────────────────────────────

function MiniToolCard({ tool }: { tool: MentionedTool }) {
  const logoSrc = getLogoUrl(tool.logo_url, tool.website_url);
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="bento-tile group flex items-center gap-3 p-3 transition-colors hover:border-white/30"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/5 text-sm font-bold text-white">
        {logoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoSrc}
            alt={tool.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{tool.name.charAt(0)}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate font-serif text-sm italic text-white sm:text-base">
            {tool.name}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-1 text-xs leading-snug text-white/55">
          {tool.tagline}
        </p>
      </div>
      <div className="hidden shrink-0 items-center gap-2 sm:flex">
        {tool.category && (
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
            {tool.category}
          </span>
        )}
        <ArrowUpRight className="h-3.5 w-3.5 text-white/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
      </div>
    </Link>
  );
}

// ─── Main chat component ─────────────────────────────────────────────────

export function AskChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Accumulate every candidate tool seen across any response. Used to render
  // [[tool:slug]] references inline with proper names/cards.
  const [toolIndex, setToolIndex] = useState<Record<string, MentionedTool>>({});

  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Scroll to bottom on new content.
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const lookup = useMemo(() => {
    const m = new Map<string, MentionedTool>();
    for (const [slug, tool] of Object.entries(toolIndex)) {
      m.set(slug.toLowerCase(), tool);
    }
    return m;
  }, [toolIndex]);

  const send = useCallback(
    async (userText: string) => {
      const trimmed = userText.trim();
      if (!trimmed || isLoading) return;

      setError(null);

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        content: trimmed,
      };
      const assistantId = `a-${Date.now() + 1}`;
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
      };

      // Build history *before* adding the placeholders so we send the real
      // conversation so far (user's previous messages).
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInput("");
      setIsLoading(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
          signal: controller.signal,
        });

        if (!res.ok) {
          let msg = `Error ${res.status}`;
          try {
            const body = (await res.json()) as { error?: string };
            if (body?.error) msg = body.error;
          } catch {
            /* ignore */
          }
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: `_${msg}_` } : m
            )
          );
          setError(msg);
          return;
        }

        if (!res.body) {
          throw new Error("No response body");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let headerParsed = false;
        let assistantText = "";

        // Stream loop.
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          if (!headerParsed) {
            const { header, rest, complete } = splitHeader(buffer);
            if (!complete) continue;
            headerParsed = true;
            if (header?.candidates?.length) {
              setToolIndex((prev) => {
                const next = { ...prev };
                for (const c of header.candidates) {
                  next[c.slug.toLowerCase()] = c;
                }
                return next;
              });
            }
            buffer = rest;
          }

          if (buffer.length > 0) {
            assistantText += buffer;
            buffer = "";
            const slugs = extractSlugs(assistantText);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? {
                      ...m,
                      content: assistantText,
                      mentionedSlugs: slugs,
                    }
                  : m
              )
            );
          }
        }

        // Flush any remaining decoded bytes.
        buffer += decoder.decode();
        if (!headerParsed) {
          const { header, rest } = splitHeader(buffer);
          headerParsed = true;
          if (header?.candidates?.length) {
            setToolIndex((prev) => {
              const next = { ...prev };
              for (const c of header.candidates) {
                next[c.slug.toLowerCase()] = c;
              }
              return next;
            });
          }
          buffer = rest;
        }
        if (buffer.length > 0) {
          assistantText += buffer;
          const slugs = extractSlugs(assistantText);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: assistantText, mentionedSlugs: slugs }
                : m
            )
          );
        }
      } catch (err) {
        if ((err as { name?: string })?.name === "AbortError") return;
        const msg = err instanceof Error ? err.message : "Network error";
        setError(msg);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: `_Something went wrong: ${msg}_` }
              : m
          )
        );
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [messages, isLoading]
  );

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void send(input);
  };

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setInput("");
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-full min-h-[52vh] flex-col">
      {/* Messages pane */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pb-4"
        aria-live="polite"
        aria-relevant="additions text"
      >
        {!hasMessages ? (
          <EmptyState onPick={(s) => void send(s)} disabled={isLoading} />
        ) : (
          <div className="flex flex-col gap-4 py-2">
            {messages.map((m) => (
              <MessageRow key={m.id} message={m} lookup={lookup} />
            ))}
            {isLoading && <TypingIndicator />}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="sticky bottom-0 mt-2 bg-gradient-to-t from-background via-background to-transparent pb-2 pt-4">
        <form onSubmit={onSubmit} className="relative">
          <label htmlFor="ask-input" className="sr-only">
            Ask a question
          </label>
          <input
            id="ask-input"
            name="ask"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Describe your task…"
            className={cn(
              "h-12 w-full rounded-full border border-white/15 bg-black/70 pl-5 pr-28 text-sm text-white placeholder:text-white/40 outline-none transition-colors",
              "focus:border-white/40 disabled:opacity-60"
            )}
            autoComplete="off"
          />
          <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
            {hasMessages && !isLoading && (
              <button
                type="button"
                onClick={reset}
                aria-label="New conversation"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/55 transition-colors hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send"
              className={cn(
                "flex h-9 items-center justify-center gap-1.5 rounded-full bg-white px-4 text-xs font-medium text-black transition-opacity",
                "disabled:cursor-not-allowed disabled:opacity-40",
                "hover:bg-white/90"
              )}
            >
              <span>Ask</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>

        <div className="mt-3 flex flex-col items-center gap-1">
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            AI responses can be wrong · recommendations drawn from our directory
          </p>
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
            Powered by Llama 3.3 via Groq · Free tier
          </p>
          {error && (
            <p className="mt-1 text-center font-serif text-xs italic text-white/60">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Subcomponents ───────────────────────────────────────────────────────

function EmptyState({
  onPick,
  disabled,
}: {
  onPick: (s: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-col items-start gap-4 py-6">
      <div className="flex items-center gap-2 text-white/60">
        <Sparkles className="h-3.5 w-3.5" />
        <span className="font-mono text-[10px] uppercase tracking-[0.22em]">
          Try one of these
        </span>
      </div>
      <div className="grid w-full gap-2 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            disabled={disabled}
            className={cn(
              "bento-tile text-left p-4 font-serif italic text-sm leading-relaxed text-white/75 transition-colors",
              "hover:text-white hover:border-white/30 disabled:opacity-40"
            )}
          >
            &ldquo;{s}&rdquo;
          </button>
        ))}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-1">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/40" />
      <span
        className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/40"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/40"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
}

function MessageRow({
  message,
  lookup,
}: {
  message: ChatMessage;
  lookup: Map<string, MentionedTool>;
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl bg-white px-4 py-3 text-sm text-black sm:text-[15px]">
          {message.content}
        </div>
      </div>
    );
  }

  const slugs = message.mentionedSlugs ?? extractSlugs(message.content);
  const mentionedTools = slugs
    .map((s) => lookup.get(s))
    .filter((t): t is MentionedTool => t != null);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-start">
        <div className="bento-tile max-w-[85%] p-4 text-sm leading-relaxed text-white/85 sm:text-[15px]">
          {message.content ? (
            renderLite(message.content, lookup)
          ) : (
            <TypingIndicator />
          )}
        </div>
      </div>
      {mentionedTools.length > 0 && (
        <div className="grid gap-2 sm:max-w-[85%] sm:grid-cols-1">
          {mentionedTools.map((t) => (
            <MiniToolCard key={t.slug} tool={t} />
          ))}
        </div>
      )}
    </div>
  );
}
