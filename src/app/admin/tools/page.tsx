import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteToolButton } from "@/components/admin/delete-tool-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";

const statusColors: Record<string, string> = {
  published: "bg-green-500/10 text-green-400 border-green-500/20",
  draft: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  archived: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

async function getAdminTools() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("tools")
      .select("*, categories(name)")
      .order("updated_at", { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export default async function AdminToolsPage() {
  const tools = await getAdminTools();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tools</h1>
          <p className="text-muted-foreground">
            Manage all AI tools in the directory
          </p>
        </div>
        <Link href="/admin/tools/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Tool
          </Button>
        </Link>
      </div>

      <div className="mt-8 rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                  No tools yet. Add your first tool to get started.
                </TableCell>
              </TableRow>
            ) : (
              tools.map((tool: Record<string, unknown>) => (
                <TableRow key={tool.id as string}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{tool.name as string}</p>
                      <p className="text-xs text-muted-foreground">{tool.tagline as string}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {(tool.categories as Record<string, string>)?.name || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusColors[tool.status as string] || ""}
                    >
                      {tool.status as string}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {tool.editor_rating !== null ? `${tool.editor_rating}/5` : "—"}
                  </TableCell>
                  <TableCell>
                    {tool.is_verified ? (
                      <Badge variant="outline" className="border-accent/30 text-accent">
                        Verified
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">No</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(tool.updated_at as string).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/tools/${tool.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <DeleteToolButton
                        toolId={tool.id as string}
                        toolName={tool.name as string}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
