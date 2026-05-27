"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToolLogo } from "@/components/shared/tool-logo";
import { getLogoUrl } from "@/lib/utils";
import { getComparisonPath } from "@/lib/compare-urls";

interface ToolOption {
  slug: string;
  name: string;
  logo_url: string | null;
  website_url: string;
  pricing_model: string | null;
  categories: { name: string } | null;
}

interface ToolPickerProps {
  tools: ToolOption[];
}

export function ToolPicker({ tools }: ToolPickerProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<ToolOption[]>([]);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return tools;
    const q = search.toLowerCase();
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.categories?.name.toLowerCase().includes(q)
    );
  }, [tools, search]);

  function toggle(tool: ToolOption) {
    setSelected((prev) => {
      const exists = prev.find((t) => t.slug === tool.slug);
      if (exists) return prev.filter((t) => t.slug !== tool.slug);
      if (prev.length >= 4) return prev;
      return [...prev, tool];
    });
  }

  function compare() {
    if (selected.length >= 2) {
      router.push(getComparisonPath(selected.map((t) => t.slug)));
    }
  }

  return (
    <div>
      {/* Selected tools */}
      {selected.length > 0 && (
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Selected ({selected.length}/4)
          </p>
          <div className="flex flex-wrap gap-2">
            {selected.map((tool) => (
              <button
                key={tool.slug}
                onClick={() => toggle(tool)}
                className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-primary/10"
              >
                {tool.name}
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            ))}
          </div>
          {selected.length >= 2 && (
            <Button onClick={compare} className="mt-4">
              Compare {selected.length} tools <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tools to compare..."
          className="h-9 pl-9 text-sm"
        />
      </div>

      {/* Tool list */}
      <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tool) => {
          const isSelected = selected.some((t) => t.slug === tool.slug);
          const logoSrc = getLogoUrl(tool.logo_url, tool.website_url);
          return (
            <button
              key={tool.slug}
              onClick={() => toggle(tool)}
              disabled={!isSelected && selected.length >= 4}
              className={`flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors duration-150 ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border/40 bg-card hover:border-border disabled:opacity-40 disabled:cursor-not-allowed"
              }`}
            >
              <ToolLogo
                src={logoSrc}
                name={tool.name}
                className="h-8 w-8 rounded-md bg-muted text-xs text-primary"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{tool.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {tool.categories?.name || tool.pricing_model || "AI Tool"}
                </p>
              </div>
              {isSelected && (
                <div className="h-5 w-5 shrink-0 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-[10px] font-bold text-primary-foreground">✓</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No tools match &quot;{search}&quot;
        </p>
      )}
    </div>
  );
}
