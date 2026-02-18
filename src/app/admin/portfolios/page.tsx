"use client";

import { useEffect, useState } from "react";
import { Check, X, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import type { ProjectWithUser } from "@/lib/types/database";

export default function AdminPortfoliosPage() {
  const [projects, setProjects] = useState<ProjectWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("portfolio_projects")
        .select("*, user_profiles(*)")
        .eq("status", "pending_review")
        .order("created_at", { ascending: false });

      if (data) setProjects(data as ProjectWithUser[]);
      setLoading(false);
    }
    load();
  }, [supabase]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Portfolio Reviews</h1>
          <p className="text-muted-foreground">
            {projects.length} project{projects.length !== 1 ? "s" : ""} pending review
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <Card className="mt-8">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Check className="h-12 w-12 text-green-400" />
            <p className="mt-4 text-muted-foreground">All caught up! No pending reviews.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 space-y-4">
          {projects.map((project) => {
            const isExpanded = expanded === project.id;
            const user = project.user_profiles;

            return (
              <Card key={project.id}>
                <CardContent className="p-4">
                  {/* Header row */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{project.name}</h3>
                        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">
                          Pending
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        by {user.display_name} (@{user.username})
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setExpanded(isExpanded ? null : project.id)}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="mt-4 space-y-4 border-t border-border pt-4">
                      <p className="text-sm">{project.description}</p>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Live URL:</span>
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

                      {project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-sm text-muted-foreground">Tech:</span>
                          {project.tech_stack.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {project.ai_tools_used.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-sm text-muted-foreground">AI Tools:</span>
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

                      {/* Admin notes */}
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Admin notes (optional, visible to the user)"
                          value={notes[project.id] || ""}
                          onChange={(e) =>
                            setNotes({ ...notes, [project.id]: e.target.value })
                          }
                          rows={2}
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleApprove(project.id)}
                          disabled={processing === project.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          {processing === project.id ? "Processing..." : "Approve"}
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleReject(project.id)}
                          disabled={processing === project.id}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
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
