"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/client";
import type { FeaturedSubscription } from "@/lib/types/database";

const statusColors: Record<string, string> = {
  active: "bg-green-500/10 text-green-400 border-green-500/20",
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  past_due: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  cancelled: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  expired: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<FeaturedSubscription[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("featured_subscriptions")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setSubscriptions(data as FeaturedSubscription[]);
      setLoading(false);
    }
    load();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Featured Subscriptions</h1>
        <p className="text-muted-foreground">
          {subscriptions.filter((s) => s.status === "active").length} active
          subscription
          {subscriptions.filter((s) => s.status === "active").length !== 1
            ? "s"
            : ""}
        </p>
      </div>

      <div className="mt-8 rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tool</TableHead>
              <TableHead>Submitter</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Period End</TableHead>
              <TableHead>Linked Tool</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-muted-foreground"
                >
                  No subscriptions yet.
                </TableCell>
              </TableRow>
            ) : (
              subscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{sub.tool_name}</p>
                      <a
                        href={sub.tool_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                      >
                        {sub.tool_website}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{sub.submitter_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {sub.submitter_email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusColors[sub.status] || ""}
                    >
                      {sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {sub.current_period_end
                      ? new Date(sub.current_period_end).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {sub.tool_id ? (
                      <Badge
                        variant="outline"
                        className="border-green-500/20 text-green-400"
                      >
                        Linked
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">Not linked</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(sub.created_at).toLocaleDateString()}
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
