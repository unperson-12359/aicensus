"use client";

import type { ReactNode } from "react";
import { trackOutboundClick } from "@/lib/analytics";

interface ToolOutboundLinkProps {
  href: string;
  toolSlug: string;
  toolName: string;
  className?: string;
  children: ReactNode;
}

export function ToolOutboundLink({
  href,
  toolSlug,
  toolName,
  className,
  children,
}: ToolOutboundLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackOutboundClick(toolSlug, toolName, href)}
    >
      {children}
    </a>
  );
}
