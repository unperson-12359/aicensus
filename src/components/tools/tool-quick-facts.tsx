import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PricingBadge } from "@/components/shared/pricing-badge";
import type { ToolWithCategory } from "@/lib/types/database";

interface ToolQuickFactsProps {
  tool: ToolWithCategory;
}

export function ToolQuickFacts({ tool }: ToolQuickFactsProps) {
  return (
    <div className="lg:hidden">
      <div className="grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-3 sm:grid-cols-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">
            Pricing
          </p>
          <div className="mt-1">
            <PricingBadge pricing={tool.pricing_model} />
          </div>
        </div>
        {tool.categories && (
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">
              Category
            </p>
            <Link href={`/categories/${tool.categories.slug}`} className="mt-1 inline-block">
              <Badge variant="outline" className="text-xs">
                {tool.categories.name}
              </Badge>
            </Link>
          </div>
        )}
        {tool.company_name && (
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">
              Company
            </p>
            <p className="mt-1 text-sm text-white/85">{tool.company_name}</p>
          </div>
        )}
        {tool.founded_year && (
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">
              Founded
            </p>
            <p className="mt-1 text-sm text-white/85">{tool.founded_year}</p>
          </div>
        )}
      </div>
      {tool.pricing_details && (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2 sm:text-sm">
          {tool.pricing_details}
        </p>
      )}
      {tool.pricing_as_of && (
        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">
          Pricing verified{" "}
          {new Date(`${tool.pricing_as_of}T00:00:00`).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </p>
      )}
    </div>
  );
}
