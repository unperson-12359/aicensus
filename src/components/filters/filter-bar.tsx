"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FilterBarSelects } from "@/components/filters/filter-bar-selects";
import { ToolsFilterPanel } from "@/components/filters/tools-filter-panel";
import type { Category } from "@/lib/types/database";

interface FilterBarProps {
  categories: Category[];
}

export function FilterBar({ categories }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentQ = searchParams.get("q") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentPricing = searchParams.get("pricing") || "";

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

  const hasActiveFilters = Boolean(currentQ || currentCategory || currentPricing);
  const activeCount = [currentCategory, currentPricing].filter(Boolean).length;

  return (
    <div className="space-y-3">
      <div className="relative">
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

      <div className="md:hidden">
        <ToolsFilterPanel
          categories={categories}
          hasActiveFilters={hasActiveFilters}
          activeCount={activeCount}
        />
      </div>

      <div className="hidden md:block">
        <FilterBarSelects categories={categories} />
      </div>
    </div>
  );
}
