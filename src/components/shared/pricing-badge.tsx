import { Badge } from "@/components/ui/badge";
import type { PricingModel } from "@/lib/types/database";

const pricingConfig: Record<PricingModel, { label: string; variant: "default" | "secondary" | "outline" }> = {
  free: { label: "Free", variant: "default" },
  freemium: { label: "Freemium", variant: "secondary" },
  paid: { label: "Paid", variant: "outline" },
  open_source: { label: "Open Source", variant: "default" },
  enterprise: { label: "Enterprise", variant: "outline" },
  contact: { label: "Contact", variant: "outline" },
};

export function PricingBadge({ pricing }: { pricing: PricingModel }) {
  const config = pricingConfig[pricing];

  return (
    <Badge variant={config.variant} className="text-xs font-medium">
      {config.label}
    </Badge>
  );
}
