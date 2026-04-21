import Link from "next/link";
import {
  Brain,
  Code,
  Image,
  MessageSquare,
  Music,
  Video,
  FileText,
  BarChart3,
  Search,
  Bot,
  Paintbrush,
  Globe,
  ArrowUpRight,
} from "lucide-react";
import type { Category } from "@/lib/types/database";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  brain: Brain,
  code: Code,
  image: Image,
  "message-square": MessageSquare,
  music: Music,
  video: Video,
  "file-text": FileText,
  "bar-chart-3": BarChart3,
  search: Search,
  bot: Bot,
  paintbrush: Paintbrush,
  globe: Globe,
};

interface CategoryCardProps {
  category: Category & { tool_count?: number };
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = iconMap[category.icon || "brain"] || Brain;

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="bento-tile group flex h-full items-center justify-between gap-4 p-5 hover:border-white/30"
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors group-hover:border-white/30 group-hover:bg-white group-hover:text-black">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold tracking-tight text-foreground">
            {category.name}
          </h3>
          {category.tool_count !== undefined && (
            <p className="text-xs text-muted-foreground">
              {category.tool_count} {category.tool_count === 1 ? "tool" : "tools"}
            </p>
          )}
        </div>
      </div>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-white/30 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
    </Link>
  );
}
