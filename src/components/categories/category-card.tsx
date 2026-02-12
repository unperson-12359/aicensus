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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
    <Link href={`/categories/${category.slug}`}>
      <Card className="group h-full border-border/50 bg-card py-0 gap-0 transition-all duration-300 hover:border-primary/30 hover:glow-sm hover:-translate-y-1">
        <CardContent className="flex items-center gap-2 p-3 sm:gap-4 sm:p-4 md:p-5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20 sm:h-10 sm:w-10">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground sm:text-base">{category.name}</h3>
            {category.tool_count !== undefined && (
              <p className="text-xs text-muted-foreground sm:text-sm">
                {category.tool_count} {category.tool_count === 1 ? "tool" : "tools"}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
