"use client";

import { useEffect, useState, useCallback } from "react";
import { Check, X, ExternalLink, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import type { ProjectWithUser } from "@/lib/types/database";

type StatusFilter = "all" | "pending_review" | "published" | "rejected";

const statusColors: Record<string, string> = {
  pending_review: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  published: "bg-green-500/10 text-green-400 border-green-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  draft: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

const statusLabels: Record<string, string> = {
  pending_review: "Pending",
  published: "Published",
  rejected: "Rejected",
  draft: "Draft",
};

const tabs: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending_review" },
  { label: "Published", value: "published" },
  { label: "Rejected", value: "rejected" },
];

export default function AdminPortfoliosPage() {
  const [projects, setProjects] = useState<ProjectWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<string | null>(null);
  const supabase = createClient();

  const loadProjects = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("portfolio_projects")
      .select("*, user_profiles(*)")
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data } = await query;
    if (data) setProjects(data as ProjectWithUser[]);
    setLoading(false);
  }, [supabase, filter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProjects();
  }, [loadProjects]);

  async function handleApprove(projectId: string) {
    setProcessing(projectId);
    const { error } = await supabase.rpc("approve_project", {
      p_project_id: projectId,
      p_notes: notes[projectId] || null,
    });

    if (error) {
      alert("Failed to approve: " + error.message);
      setProcessing(null);
      return;
    }

    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setProcessing(null);
  }

  async function handleReject(projectId: string) {
    setProcessing(projectId);
    const { error } = await supabase.rpc("reject_project", {
      p_project_id: projectId,
      p_notes: notes[projectId] || null,
    });

    if (error) {
      alert("Failed to reject: " + error.message);
      setProcessing(null);
      return;
    }

    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setProcessing(null);
  }

  async function handleDeleteProject(projectId: string, projectName: string) {
    if (!confirm(`Delete project "${projectName}"? This cannot be undone.`)) return;

    setProcessing(projectId);
    const { error } = await supabase
      .from("portfolio_projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      alert("Failed to delete: " + error.message);
      setProcessing(null);
      return;
    }

    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setProcessing(null);
  }

  async function handleDeleteUser(userId: string, username: string) {
    if (
      !confirm(
        `Delete user "@${username}" and ALL their projects? This cannot be undone.`
      )
    )
      return;

    setProcessing(userId);

    // Delete all projects first, then the profile
    const { error: projectsError } = await supabase
      .from("portfolio_projects")
      .delete()
      .eq("user_id", userId);

    if (projectsError) {
      alert("Failed to delete user projects: " + projectsError.message);
      setProcessing(null);
      return;
    }

    const { error: profileError } = await supabase
      .from("user_profiles")
      .delete()
      .eq("id", userId);

    if (profileError) {
      alert("Failed to delete user profile: " + profileError.message);
      setProcessing(null);
      return;
    }

    setProjects((prev) => prev.filter((p) => p.user_id !== userId));
    setProcessing(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Portfolio Management</h1>
          <p className="text-muted-foreground">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
            {filter !== "all" ? ` (${statusLabels[filter] || filter})` : ""}
          </p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="mt-6 flex gap-1 rounded-lg border border-border bg-muted/30 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === tab.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : projects.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Check className="h-12 w-12 text-green-400" />
            <p className="mt-4 text-muted-foreground">
              {filter === "all"
                ? "No portfolio projects yet."
                : `No ${statusLabels[filter]?.toLowerCase() || filter} projects.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 space-y-4">
          {projects.map((project) => {
            const isExpanded = expanded === project.id;
            const user = project.user_profiles;
            const status = (project.status as string) || "draft";
            const isPending = status === "pending_review";

            return (
              <Card key={project.id}>
                <CardContent className="p-4">
                  {/* Header row */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{project.name}</h3>
                        <Badge
                          variant="outline"
                          className={statusColors[status] || ""}
                        >
                          {statusLabels[status] || status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        by {user?.display_name || "Unknown"} (@{user?.username || "?"})
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        disabled={processing === project.id}
                        onClick={() => handleDeleteProject(project.id, project.name)}
                        title="Delete project"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setExpanded(isExpanded ? null : project.id)
                        }
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="mt-4 space-y-4 border-t border-border pt-4">
                      <p className="text-sm">{project.description}</p>

                      {project.live_url && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Live URL:
                          </span>
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            {project.live_url}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}

                      {project.tech_stack?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-sm text-muted-foreground">
                            Tech:
                          </span>
                          {project.tech_stack.map((tech) => (
                            <Badge
                              key={tech}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {project.ai_tools_used?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-sm text-muted-foreground">
                            AI Tools:
                          </span>
                          {project.ai_tools_used.map((tool) => (
                            <Badge
                              key={tool}
                              variant="outline"
                              className="border-primary/30 text-xs text-primary"
                            >
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Admin notes (for pending only) */}
                      {isPending && (
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Admin notes (optional, visible to the user)"
                            value={notes[project.id] || ""}
                            onChange={(e) =>
                              setNotes({
                                ...notes,
                                [project.id]: e.target.value,
                              })
                            }
                            rows={2}
                          />
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3">
                        {isPending && (
                          <>
                            <Button
                              onClick={() => handleApprove(project.id)}
                              disabled={processing === project.id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="mr-2 h-4 w-4" />
                              {processing === project.id
                                ? "Processing..."
                                : "Approve"}
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleReject(project.id)}
                              disabled={processing === project.id}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </>
                        )}
                        {user && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            disabled={processing === user.id}
                            onClick={() =>
                              handleDeleteUser(user.id, user.username)
                            }
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User & Projects
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
