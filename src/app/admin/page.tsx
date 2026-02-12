import Link from "next/link";
import { Wrench, Inbox, FolderOpen, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

async function getStats() {
  try {
    const supabase = await createClient();

    const [
      { count: totalTools },
      { count: publishedTools },
      { count: draftTools },
      { count: pendingSubmissions },
      { count: totalCategories },
    ] = await Promise.all([
      supabase.from("tools").select("*", { count: "exact", head: true }),
      supabase.from("tools").select("*", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("tools").select("*", { count: "exact", head: true }).eq("status", "draft"),
      supabase.from("submissions").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("categories").select("*", { count: "exact", head: true }),
    ]);

    return {
      totalTools: totalTools || 0,
      publishedTools: publishedTools || 0,
      draftTools: draftTools || 0,
      pendingSubmissions: pendingSubmissions || 0,
      totalCategories: totalCategories || 0,
    };
  } catch {
    return {
      totalTools: 0,
      publishedTools: 0,
      draftTools: 0,
      pendingSubmissions: 0,
      totalCategories: 0,
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    {
      label: "Total Tools",
      value: stats.totalTools,
      icon: Wrench,
      href: "/admin/tools",
    },
    {
      label: "Published",
      value: stats.publishedTools,
      icon: Wrench,
      href: "/admin/tools?status=published",
      color: "text-green-400",
    },
    {
      label: "Drafts",
      value: stats.draftTools,
      icon: Wrench,
      href: "/admin/tools?status=draft",
      color: "text-yellow-400",
    },
    {
      label: "Pending Submissions",
      value: stats.pendingSubmissions,
      icon: Inbox,
      href: "/admin/submissions",
      color: stats.pendingSubmissions > 0 ? "text-primary" : undefined,
    },
    {
      label: "Categories",
      value: stats.totalCategories,
      icon: FolderOpen,
      href: "/admin/categories",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the AiCensus admin panel
          </p>
        </div>
        <Link href="/admin/tools/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Tool
          </Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-colors hover:border-primary/30">
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
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/tools/new">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add New Tool
            </Button>
          </Link>
          <Link href="/admin/submissions">
            <Button variant="outline">
              <Inbox className="mr-2 h-4 w-4" />
              Review Submissions
              {stats.pendingSubmissions > 0 && (
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {stats.pendingSubmissions}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/admin/categories">
            <Button variant="outline">
              <FolderOpen className="mr-2 h-4 w-4" />
              Manage Categories
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
