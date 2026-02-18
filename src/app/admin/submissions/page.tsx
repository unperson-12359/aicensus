"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ExternalLink, Loader2, X } from "lucide-react";
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error: loadError } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (loadError) {
      setError(loadError.message || "Failed to load submissions.");
      setSubmissions([]);
    } else {
      setSubmissions((data as Submission[]) || []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadSubmissions();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadSubmissions]);

  async function approveSubmission(id: string, notes?: string) {
    setProcessingId(id);
    setError("");
    setSuccess("");

    const supabase = createClient();
    const { error: approveError } = await supabase.rpc("approve_submission", {
      p_submission_id: id,
      p_notes: notes?.trim() || null,
    });

    if (approveError) {
      setError(approveError.message || "Failed to approve submission.");
      setProcessingId(null);
      return;
    }

    setSuccess("Submission approved and draft tool created.");
    await loadSubmissions();
    router.refresh();
    setProcessingId(null);
  }

  async function rejectSubmission(id: string, notes?: string) {
    setProcessingId(id);
    setError("");
    setSuccess("");

    const supabase = createClient();
    const { error: rejectError } = await supabase.rpc("reject_submission", {
      p_submission_id: id,
      p_notes: notes?.trim() || null,
    });

    if (rejectError) {
      setError(rejectError.message || "Failed to reject submission.");
      setProcessingId(null);
      return;
    }

    setSuccess("Submission rejected.");
    await loadSubmissions();
    router.refresh();
    setProcessingId(null);
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

      {error && (
        <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      {success && (
        <p className="mt-4 rounded-md border border-green-500/40 bg-green-500/10 px-3 py-2 text-sm text-green-400">
          {success}
        </p>
      )}

      {pending.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold">Pending Review</h2>
          {pending.map((submission) => (
            <SubmissionCard
              key={submission.id}
              submission={submission}
              processing={processingId === submission.id}
              onApprove={(notes) => approveSubmission(submission.id, notes)}
              onReject={(notes) => rejectSubmission(submission.id, notes)}
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
                <Badge
                  variant="outline"
                  className={statusColors[submission.status]}
                >
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
  processing,
  onApprove,
  onReject,
}: {
  submission: Submission;
  processing: boolean;
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
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
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
              disabled={processing}
            />
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={() => onApprove(notes)} disabled={processing}>
              {processing ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-1 h-4 w-4" />
              )}
              Approve & Create Draft
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onReject(notes)}
              disabled={processing}
            >
              {processing ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <X className="mr-1 h-4 w-4" />
              )}
              Reject
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
