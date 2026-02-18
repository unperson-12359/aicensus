"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ProjectForm } from "@/components/dashboard/project-form";

export default function NewProjectPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    }
    load();
  }, []);

  if (!userId) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">New Project</h1>
      <p className="mb-8 text-muted-foreground">Showcase a new AI-built project</p>
      <ProjectForm userId={userId} />
    </div>
  );
}
