import type { PricingModel } from "@/lib/types/database";
import { cn } from "@/lib/utils";

const pricingConfig: Record<PricingModel, { label: string; className: string }> = {
  free: {
    label: "Free",
    className: "bg-white text-black border-white",
  },
  freemium: {
    label: "Freemium",
    className: "bg-white/10 text-white border-white/20",
  },
  paid: {
    label: "Paid",
    className: "bg-transparent text-white/80 border-white/25",
  },
  open_source: {
    label: "Open source",
    className: "bg-white text-black border-white",
  },
  enterprise: {
    label: "Enterprise",
    className: "bg-transparent text-white/80 border-white/25",
  },
  contact: {
    label: "Contact",
    className: "bg-transparent text-white/80 border-white/25",
  },
};

export function PricingBadge({ pricing }: { pricing: PricingModel }) {
  const config = pricingConfig[pricing];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
