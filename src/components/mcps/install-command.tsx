"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function InstallCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(command);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = command;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="relative mt-3">
      <pre className="overflow-x-auto rounded-lg border border-white/10 bg-black p-4 pr-24 text-xs leading-relaxed text-white/85 sm:text-sm">
        <code>{command}</code>
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Install command copied" : "Copy install command"}
        className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/[0.03] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 transition-colors hover:border-white/30 hover:text-white"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3" /> Copied
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" /> Copy
          </>
        )}
      </button>
    </div>
  );
}
