import { ProjectCard } from "./project-card";
import type { PortfolioProject } from "@/lib/types/database";

interface ProjectGalleryProps {
  projects: PortfolioProject[];
  username: string;
}

export function ProjectGallery({ projects, username }: ProjectGalleryProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground">No published projects yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} username={username} />
      ))}
    </div>
  );
}
