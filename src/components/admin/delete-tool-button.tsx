"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface DeleteToolButtonProps {
  toolId: string;
  toolName: string;
}

export function DeleteToolButton({ toolId, toolName }: DeleteToolButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete "${toolName}"? This cannot be undone.`)) return;

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("tools").delete().eq("id", toolId);
      if (error) {
        throw error;
      }
      router.refresh();
    } catch {
      alert("Failed to delete tool.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={loading}
      onClick={handleDelete}
      className="text-muted-foreground hover:text-destructive"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
