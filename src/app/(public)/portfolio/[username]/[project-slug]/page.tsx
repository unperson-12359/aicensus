import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProjectIframe } from "@/components/portfolio/project-iframe";
import { ShareButton } from "@/components/portfolio/share-button";
import {
  getUserProfileByUsername,
  getProjectBySlug,
} from "@/lib/queries/portfolios";

export const revalidate = 1800;

interface Props {
  params: Promise<{ username: string; "project-slug": string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, "project-slug": projectSlug } = await params;
  const profile = await getUserProfileByUsername(username);
  if (!profile) return { title: "Not Found - AiCensus" };

  const project = await getProjectBySlug(profile.id, projectSlug);
  if (!project) return { title: "Not Found - AiCensus" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.xyz";
  const projectUrl = `${siteUrl}/portfolio/${username}/${projectSlug}`;

  return {
    title: `${project.name} by ${profile.display_name} | AiCensus`,
    description: project.description,
    openGraph: {
      title: `${project.name} by ${profile.display_name} | AiCensus`,
      description: project.description,
      url: projectUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} by ${profile.display_name} | AiCensus`,
      description: project.description,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { username, "project-slug": projectSlug } = await params;
  const profile = await getUserProfileByUsername(username);
  if (!profile) notFound();

  const project = await getProjectBySlug(profile.id, projectSlug);
  if (!project) notFound();

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/portfolio" className="hover:text-foreground">
            Portfolio
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={`/portfolio/${username}`} className="hover:text-foreground">
            {profile.display_name}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">{project.name}</span>
        </nav>

        {/* Title */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              {project.description}
            </p>
          </div>
          <ShareButton
            type="project"
            profile={profile}
            project={project}
            username={username}
          />
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech_stack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
          {project.ai_tools_used.map((tool) => (
            <Badge
              key={tool}
              variant="outline"
              className="border-primary/30 text-primary"
            >
              {tool}
            </Badge>
          ))}
        </div>

        {/* Live Preview */}
        <div className="mt-8">
          <ProjectIframe url={project.live_url} title={project.name} />
        </div>

        {/* Screenshots */}
        {project.screenshots.length > 0 && (
          <section className="mt-8">
            <h3 className="mb-4 font-semibold">Screenshots</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {project.screenshots.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`${project.name} screenshot ${i + 1}`}
                  className="rounded-lg border border-border object-cover"
                />
              ))}
            </div>
          </section>
        )}

        {/* Author */}
        <div className="mt-12 border-t border-border pt-6">
          <Link
            href={`/portfolio/${username}`}
            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"
          >
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="h-10 w-10 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-sm font-bold">
                {profile.display_name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-medium text-foreground">{profile.display_name}</p>
              <p>@{username}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
