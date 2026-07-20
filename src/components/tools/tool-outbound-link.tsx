"use client";

import type { ReactNode } from "react";
import { trackOutboundClick } from "@/lib/analytics";

interface ToolOutboundLinkProps {
  href: string;
  toolSlug: string;
  toolName: string;
  isAffiliate?: boolean;
  className?: string;
  children: ReactNode;
}

export function ToolOutboundLink({
  href,
  toolSlug,
  toolName,
  isAffiliate = false,
  className,
  children,
}: ToolOutboundLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel={isAffiliate ? "noopener noreferrer sponsored nofollow" : "noopener noreferrer"}
      className={className}
      onClick={() => trackOutboundClick(toolSlug, toolName, href)}
    >
      {children}
    </a>
  );
}
