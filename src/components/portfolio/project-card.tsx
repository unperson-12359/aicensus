import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { PortfolioProject } from "@/lib/types/database";

interface ProjectCardProps {
  project: PortfolioProject;
  username: string;
}

export function ProjectCard({ project, username }: ProjectCardProps) {
  return (
    <Link href={`/portfolio/${username}/${project.slug}`}>
      <Card className="group overflow-hidden border-white/10 bg-card transition-all hover:border-white/30">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          {project.thumbnail_url ? (
            <img
              src={project.thumbnail_url}
              alt={project.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ExternalLink className="h-8 w-8 text-muted-foreground/30" />
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground">{project.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {project.description}
          </p>

          {/* Tech stack badges */}
          {project.tech_stack.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.tech_stack.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {project.tech_stack.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{project.tech_stack.length - 4}
                </Badge>
              )}
            </div>
          )}

          {/* AI tools badges */}
          {project.ai_tools_used.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {project.ai_tools_used.slice(0, 3).map((tool) => (
                <Badge
                  key={tool}
                  variant="outline"
                  className="border-white/20 bg-white/5 text-xs text-white/80"
                >
                  {tool}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
