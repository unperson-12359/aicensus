import { Badge } from "@/components/ui/badge";
import type { ProjectStatus } from "@/lib/types/database";

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  draft: {
    label: "Draft",
    className: "bg-white/5 text-white/60 border-white/10",
  },
  pending_review: {
    label: "Pending review",
    className: "bg-white/10 text-white/80 border-white/20",
  },
  published: {
    label: "Published",
    className: "bg-white text-black border-white",
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive border-destructive/25",
  },
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
