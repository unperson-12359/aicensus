"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ProjectForm } from "@/components/dashboard/project-form";
import type { PortfolioProject } from "@/lib/types/database";

export default function EditProjectPage() {
  const params = useParams();
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data } = await supabase
        .from("portfolio_projects")
        .select("*")
        .eq("id", params.id)
        .eq("user_id", user.id)
        .single();

      if (data) setProject(data as PortfolioProject);
      setLoading(false);
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!project || !userId) {
    return <p className="text-muted-foreground">Project not found.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit Project</h1>
      <p className="mb-8 text-muted-foreground">Update your project details</p>
      <ProjectForm project={project} userId={userId} />
    </div>
  );
}
