import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { page, type PageVariant } from "@/lib/layout";

interface PageContainerProps {
  variant?: PageVariant;
  className?: string;
  children: ReactNode;
}

export function PageContainer({
  variant = "editorial",
  className,
  children,
}: PageContainerProps) {
  return <div className={cn(page[variant], className)}>{children}</div>;
}
