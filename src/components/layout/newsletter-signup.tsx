"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function NewsletterSignup() {
  const newsletterUrl = process.env.NEXT_PUBLIC_NEWSLETTER_URL;

  if (!newsletterUrl) return null;

  return (
    <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
        Newsletter
      </p>
      <p className="mt-2 font-serif text-lg italic text-white/85">
        Weekly AI tool picks — no spam.
      </p>
      <Link
        href={newsletterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/70 transition-colors hover:text-white"
      >
        Subscribe
        <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
