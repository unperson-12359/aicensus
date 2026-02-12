import { notFound } from "next/navigation";
import { ToolForm } from "@/components/admin/tool-form";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getTool(id: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("tools")
      .select("*")
      .eq("id", id)
      .single();
    return data;
  } catch {
    return null;
  }
}

async function getCategories() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("categories")
      .select("id, name")
      .order("display_order", { ascending: true });
    return data || [];
  } catch {
    return [];
  }
}

export default async function EditToolPage({ params }: PageProps) {
  const { id } = await params;
  const [tool, categories] = await Promise.all([getTool(id), getCategories()]);

  if (!tool) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit Tool</h1>
      <p className="text-muted-foreground">
        Update the details for {tool.name}
      </p>
      <div className="mt-8">
        <ToolForm tool={tool} categories={categories} />
      </div>
    </div>
  );
}
