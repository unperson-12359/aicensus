"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, FolderOpen, Eye, Clock, Mail, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import type { PortfolioProject, UserProfile } from "@/lib/types/database";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  pending_review: "bg-yellow-500/10 text-yellow-500",
  published: "bg-green-500/10 text-green-500",
  rejected: "bg-destructive/10 text-destructive",
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  pending_review: "Pending Review",
  published: "Published",
  rejected: "Rejected",
};

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, projectsRes, messagesRes] = await Promise.all([
        supabase.from("user_profiles").select("*").eq("id", user.id).single(),
        supabase.from("portfolio_projects").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("project_messages").select("*", { count: "exact", head: true }).eq("recipient_user_id", user.id).eq("is_read", false),
      ]);

      if (profileRes.data) setProfile(profileRes.data as UserProfile);
      if (projectsRes.data) setProjects(projectsRes.data as PortfolioProject[]);
      setUnreadMessages(messagesRes.count || 0);
      setLoading(false);
    }

    loadData();
  }, [supabase]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    const { error } = await supabase.from("portfolio_projects").delete().eq("id", id);
    if (error) {
      alert("Failed to delete project.");
      return;
    }

    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleSubmitForReview(id: string) {
    const { error } = await supabase
      .from("portfolio_projects")
      .update({ status: "pending_review" as const })
      .eq("id", id);

    if (error) {
      alert("Failed to submit for review.");
      return;
    }

    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "pending_review" as const } : p))
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const publishedCount = projects.filter((p) => p.status === "published").length;
  const draftCount = projects.filter((p) => p.status === "draft").length;
  const pendingCount = projects.filter((p) => p.status === "pending_review").length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.display_name || "there"}
          </p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Published", value: publishedCount, icon: Eye, color: "text-green-400" },
          { label: "Drafts", value: draftCount, icon: FolderOpen, color: "text-yellow-400" },
          { label: "Pending Review", value: pendingCount, icon: Clock, color: "text-primary" },
          { label: "Unread Messages", value: unreadMessages, icon: Mail, color: unreadMessages > 0 ? "text-primary" : undefined },
        ].map((stat) => (
          <Card key={stat.label} className="transition-colors hover:border-primary/30">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <stat.icon className={`h-5 w-5 ${stat.color || "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Portfolio link */}
      {profile && (
        <div className="mt-6">
          <Link
            href={`/portfolio/${profile.username}`}
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View your public portfolio: aicensus.com/portfolio/{profile.username}
          </Link>
        </div>
      )}

      {/* Projects List */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Your Projects</h2>
        {projects.length === 0 ? (
          <Card className="mt-4">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No projects yet</p>
              <Link href="/dashboard/projects/new" className="mt-4">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Project
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-4 space-y-3">
            {projects.map((project) => (
              <Card key={project.id} className="transition-colors hover:border-border">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{project.name}</h3>
                      <Badge variant="secondary" className={statusColors[project.status]}>
                        {statusLabels[project.status]}
                      </Badge>
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                      {project.description}
                    </p>
                    {project.admin_notes && project.status === "rejected" && (
                      <p className="mt-1 text-xs text-destructive">
                        Feedback: {project.admin_notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {project.status === "draft" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSubmitForReview(project.id)}
                      >
                        Submit for Review
                      </Button>
                    )}
                    {project.status === "rejected" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSubmitForReview(project.id)}
                      >
                        Resubmit
                      </Button>
                    )}
                    <Link href={`/dashboard/projects/${project.id}/edit`}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(project.id, project.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
