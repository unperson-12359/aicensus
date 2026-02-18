import { Badge } from "@/components/ui/badge";
import type { ProjectStatus } from "@/lib/types/database";

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  pending_review: { label: "Pending Review", className: "bg-yellow-500/10 text-yellow-500" },
  published: { label: "Published", className: "bg-green-500/10 text-green-500" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive" },
};

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  );
}
