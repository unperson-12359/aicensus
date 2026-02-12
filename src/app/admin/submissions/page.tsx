"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";

interface Submission {
  id: string;
  submitter_name: string;
  submitter_email: string;
  tool_name: string;
  tool_website: string;
  tool_tagline: string | null;
  tool_description: string | null;
  tool_pricing_model: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  approved: "bg-green-500/10 text-green-400 border-green-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AdminSubmissionsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, []);

  async function loadSubmissions() {
    const supabase = createClient();
    const { data } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });
    setSubmissions((data as Submission[]) || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string, notes?: string) {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("submissions") as any)
      .update({
        status,
        admin_notes: notes || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (status === "approved") {
      const submission = submissions.find((s) => s.id === id);
      if (submission) {
        // Create a draft tool from the submission
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("tools") as any).insert({
          name: submission.tool_name,
          slug: submission.tool_name
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-"),
          tagline: submission.tool_tagline || "AI Tool",
          description: submission.tool_description || "",
          website_url: submission.tool_website,
          pricing_model: submission.tool_pricing_model || "freemium",
          status: "draft",
        });
      }
    }

    await loadSubmissions();
    router.refresh();
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Submissions</h1>
        <p className="mt-2 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const pending = submissions.filter((s) => s.status === "pending");
  const reviewed = submissions.filter((s) => s.status !== "pending");

  return (
    <div>
      <h1 className="text-2xl font-bold">Submissions</h1>
      <p className="text-muted-foreground">
        Review community tool submissions ({pending.length} pending)
      </p>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold">Pending Review</h2>
          {pending.map((submission) => (
            <SubmissionCard
              key={submission.id}
              submission={submission}
              onApprove={(notes) =>
                updateStatus(submission.id, "approved", notes)
              }
              onReject={(notes) =>
                updateStatus(submission.id, "rejected", notes)
              }
            />
          ))}
        </div>
      )}

      {pending.length === 0 && (
        <div className="mt-8 rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            No pending submissions. All caught up!
          </p>
        </div>
      )}

      {/* Reviewed */}
      {reviewed.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold">Reviewed</h2>
          {reviewed.map((submission) => (
            <Card key={submission.id} className="border-border/50">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{submission.tool_name}</p>
                  <p className="text-sm text-muted-foreground">
                    by {submission.submitter_name} &middot;{" "}
                    {new Date(submission.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="outline" className={statusColors[submission.status]}>
                  {submission.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function SubmissionCard({
  submission,
  onApprove,
  onReject,
}: {
  submission: Submission;
  onApprove: (notes?: string) => void;
  onReject: (notes?: string) => void;
}) {
  const [notes, setNotes] = useState("");
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardHeader className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{submission.tool_name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Submitted by {submission.submitter_name} ({submission.submitter_email})
              &middot; {new Date(submission.created_at).toLocaleDateString()}
            </p>
          </div>
          <Badge variant="outline" className={statusColors[submission.status]}>
            {submission.status}
          </Badge>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4 border-t pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Website</p>
              <a
                href={submission.tool_website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                {submission.tool_website}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            {submission.tool_pricing_model && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">Pricing</p>
                <p className="text-sm">{submission.tool_pricing_model}</p>
              </div>
            )}
          </div>

          {submission.tool_tagline && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Tagline</p>
              <p className="text-sm">{submission.tool_tagline}</p>
            </div>
          )}

          {submission.tool_description && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Description</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {submission.tool_description}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Admin Notes</p>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes..."
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onApprove(notes)}
            >
              <Check className="mr-1 h-4 w-4" />
              Approve & Create Draft
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onReject(notes)}
            >
              <X className="mr-1 h-4 w-4" />
              Reject
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
