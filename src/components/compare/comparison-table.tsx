import Link from "next/link";
import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/shared/rating-stars";
import { PricingBadge } from "@/components/shared/pricing-badge";
import { VerifiedBadge } from "@/components/shared/verified-badge";
import { ToolLogo } from "@/components/shared/tool-logo";
import { getLogoUrl } from "@/lib/utils";
import type { ToolWithCategory } from "@/lib/types/database";

interface ComparisonTableProps {
  tools: ToolWithCategory[];
}

const ROWS: {
  label: string;
  render: (tool: ToolWithCategory) => ReactNode;
}[] = [
  {
    label: "Rating",
    render: (t) => <RatingStars rating={t.editor_rating} />,
  },
  {
    label: "Pricing",
    render: (t) => <PricingBadge pricing={t.pricing_model} />,
  },
  {
    label: "Category",
    render: (t) => (
      <span className="text-sm">{t.categories?.name || "—"}</span>
    ),
  },
  {
    label: "Features",
    render: (t) =>
      t.key_features && t.key_features.length > 0 ? (
        <ul className="space-y-0.5 text-sm">
          {t.key_features.slice(0, 5).map((f, i) => (
            <li key={i} className="text-muted-foreground">
              • {f}
            </li>
          ))}
        </ul>
      ) : (
        <span className="text-sm text-muted-foreground">—</span>
      ),
  },
  {
    label: "Pros",
    render: (t) =>
      t.pros && t.pros.length > 0 ? (
        <ul className="space-y-0.5 text-sm">
          {t.pros.slice(0, 4).map((p, i) => (
            <li key={i} className="text-accent">
              + {p}
            </li>
          ))}
        </ul>
      ) : (
        <span className="text-sm text-muted-foreground">—</span>
      ),
  },
  {
    label: "Cons",
    render: (t) =>
      t.cons && t.cons.length > 0 ? (
        <ul className="space-y-0.5 text-sm">
          {t.cons.slice(0, 4).map((c, i) => (
            <li key={i} className="text-destructive">
              − {c}
            </li>
          ))}
        </ul>
      ) : (
        <span className="text-sm text-muted-foreground">—</span>
      ),
  },
  {
    label: "Use Cases",
    render: (t) => (
      <div className="flex flex-wrap gap-1">
        {(t.use_cases || []).slice(0, 4).map((uc, i) => (
          <Badge key={i} variant="secondary" className="text-xs">
            {uc}
          </Badge>
        ))}
        {(!t.use_cases || t.use_cases.length === 0) && (
          <span className="text-sm text-muted-foreground">—</span>
        )}
      </div>
    ),
  },
];

function MobileComparisonCards({ tools }: { tools: ToolWithCategory[] }) {
  return (
    <div className="space-y-3 md:hidden">
      {ROWS.map((row) => (
        <div key={row.label} className="rounded-lg border border-border/40 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {row.label}
          </p>
          <div className="mt-3 space-y-3">
            {tools.map((tool) => (
              <div
                key={`${row.label}-${tool.id}`}
                className="border-t border-border/30 pt-3 first:border-t-0 first:pt-0"
              >
                <p className="mb-1 text-sm font-medium">{tool.name}</p>
                {row.render(tool)}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="rounded-lg border border-border/40 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Visit
        </p>
        <div className="mt-3 space-y-3">
          {tools.map((tool) => (
            <div key={`visit-${tool.id}`}>
              <p className="mb-1.5 text-sm font-medium">{tool.name}</p>
              <div className="flex gap-2">
                <Link href={`/tools/${tool.slug}`}>
                  <Button size="sm">Details</Button>
                </Link>
                {tool.website_url && (
                  <a href={tool.website_url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
  alt,
}: {
  label: string;
  children: ReactNode;
  alt?: boolean;
}) {
  return (
    <tr className={alt ? "bg-muted/30" : ""}>
      <td className="py-3 pr-4 text-xs font-medium uppercase tracking-wider text-muted-foreground align-top">
        {label}
      </td>
      {children}
    </tr>
  );
}

export function ComparisonTable({ tools }: ComparisonTableProps) {
  return (
    <>
      <MobileComparisonCards tools={tools} />

      <div className="hidden overflow-x-auto rounded-lg border border-border/40 md:block">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="border-b border-border/40">
              <th className="w-32 py-4 pl-4 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground" />
              {tools.map((tool) => {
                const logoSrc = getLogoUrl(tool.logo_url, tool.website_url);
                return (
                  <th key={tool.id} className="px-4 py-4 text-left">
                    <div className="flex items-center gap-3">
                      <ToolLogo
                        src={logoSrc}
                        name={tool.name}
                        className="h-10 w-10 rounded-md bg-muted text-sm text-primary"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/tools/${tool.slug}`}
                            className="font-semibold text-foreground hover:text-primary transition-colors"
                          >
                            {tool.name}
                          </Link>
                          {tool.is_verified && (
                            <VerifiedBadge showLabel={false} size="sm" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {tool.tagline}
                        </p>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <Row label="Rating">
              {tools.map((t) => (
                <td key={t.id} className="px-4 py-3">
                  <RatingStars rating={t.editor_rating} />
                </td>
              ))}
            </Row>

            <Row label="Pricing" alt>
              {tools.map((t) => (
                <td key={t.id} className="px-4 py-3">
                  <PricingBadge pricing={t.pricing_model} />
                </td>
              ))}
            </Row>

            <Row label="Category">
              {tools.map((t) => (
                <td key={t.id} className="px-4 py-3 text-sm">
                  {t.categories?.name || "—"}
                </td>
              ))}
            </Row>

            <Row label="Features" alt>
              {tools.map((t) => (
                <td key={t.id} className="px-4 py-3">
                  {t.key_features && t.key_features.length > 0 ? (
                    <ul className="space-y-0.5 text-sm">
                      {t.key_features.slice(0, 5).map((f, i) => (
                        <li key={i} className="text-muted-foreground">
                          • {f}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </td>
              ))}
            </Row>

            <Row label="Pros">
              {tools.map((t) => (
                <td key={t.id} className="px-4 py-3">
                  {t.pros && t.pros.length > 0 ? (
                    <ul className="space-y-0.5 text-sm">
                      {t.pros.slice(0, 4).map((p, i) => (
                        <li key={i} className="text-accent">
                          + {p}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </td>
              ))}
            </Row>

            <Row label="Cons" alt>
              {tools.map((t) => (
                <td key={t.id} className="px-4 py-3">
                  {t.cons && t.cons.length > 0 ? (
                    <ul className="space-y-0.5 text-sm">
                      {t.cons.slice(0, 4).map((c, i) => (
                        <li key={i} className="text-destructive">
                          − {c}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </td>
              ))}
            </Row>

            <Row label="Use Cases">
              {tools.map((t) => (
                <td key={t.id} className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(t.use_cases || []).slice(0, 4).map((uc, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {uc}
                      </Badge>
                    ))}
                    {(!t.use_cases || t.use_cases.length === 0) && (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </div>
                </td>
              ))}
            </Row>

            <Row label="Visit" alt>
              {tools.map((t) => (
                <td key={t.id} className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link href={`/tools/${t.slug}`}>
                      <Button size="sm">Details</Button>
                    </Link>
                    {t.website_url && (
                      <a
                        href={t.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </a>
                    )}
                  </div>
                </td>
              ))}
            </Row>
          </tbody>
        </table>
      </div>
    </>
  );
}
