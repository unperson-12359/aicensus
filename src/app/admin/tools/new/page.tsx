import { ToolForm } from "@/components/admin/tool-form";
import { createClient } from "@/lib/supabase/server";

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

export default async function NewToolPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-2xl font-bold">Add New Tool</h1>
      <p className="text-muted-foreground">
        Create a new AI tool listing for the directory
      </p>
      <div className="mt-8">
        <ToolForm categories={categories} />
      </div>
    </div>
  );
}
