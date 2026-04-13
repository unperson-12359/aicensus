"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { Category, PricingModel } from "@/lib/types/database";

const pricingOptions: { value: PricingModel; label: string }[] = [
  { value: "free", label: "Free" },
  { value: "freemium", label: "Freemium" },
  { value: "paid", label: "Paid" },
  { value: "open_source", label: "Open Source" },
  { value: "enterprise", label: "Enterprise" },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Highest Rated" },
  { value: "name", label: "Name (A-Z)" },
];

interface FilterBarProps {
  categories: Category[];
}

export function FilterBar({ categories }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentQ = searchParams.get("q") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentPricing = searchParams.get("pricing") || "";
  const currentSort = searchParams.get("sort") || "newest";

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/tools?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/tools");
  }

  const hasFilters = currentQ || currentCategory || currentPricing;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            defaultValue={currentQ}
            className="pl-9 focus:glow-sm transition-shadow duration-300"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateParams("q", (e.target as HTMLInputElement).value);
              }
            }}
          />
        </div>

        {/* Category */}
        <Select
          value={currentCategory}
          onValueChange={(val) => updateParams("category", val === "all" ? "" : val)}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Pricing */}
        <Select
          value={currentPricing}
          onValueChange={(val) => updateParams("pricing", val === "all" ? "" : val)}
        >
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Pricing" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Pricing</SelectItem>
            {pricingOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={currentSort}
          onValueChange={(val) => updateParams("sort", val)}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {currentQ && (
            <Badge variant="secondary" className="gap-1">
              &quot;{currentQ}&quot;
              <button onClick={() => updateParams("q", "")} aria-label="Clear search filter">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentCategory && (
            <Badge variant="secondary" className="gap-1">
              {categories.find((c) => c.slug === currentCategory)?.name || currentCategory}
              <button onClick={() => updateParams("category", "")} aria-label="Clear category filter">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentPricing && (
            <Badge variant="secondary" className="gap-1">
              {pricingOptions.find((p) => p.value === currentPricing)?.label || currentPricing}
              <button onClick={() => updateParams("pricing", "")} aria-label="Clear pricing filter">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <button
            onClick={clearFilters}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
