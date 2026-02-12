"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import type { Database, PricingModel } from "@/lib/types/database";

const pricingOptions = [
  { value: "free", label: "Free" },
  { value: "freemium", label: "Freemium" },
  { value: "paid", label: "Paid" },
  { value: "open_source", label: "Open Source" },
  { value: "enterprise", label: "Enterprise" },
  { value: "contact", label: "Contact for pricing" },
];

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    // Honeypot check
    if (formData.get("website_url_confirm")) {
      setLoading(false);
      setSubmitted(true);
      return;
    }

    const submission: Database["public"]["Tables"]["submissions"]["Insert"] = {
      submitter_name: formData.get("name") as string,
      submitter_email: formData.get("email") as string,
      tool_name: formData.get("tool_name") as string,
      tool_website: formData.get("tool_website") as string,
      tool_tagline: (formData.get("tool_tagline") as string) || null,
      tool_description: (formData.get("tool_description") as string) || null,
      tool_pricing_model: (formData.get("pricing") as PricingModel) || null,
    };

    try {
      const supabase = createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: dbError } = await (supabase.from("submissions") as any).insert(submission);

      if (dbError) throw new Error(dbError.message || JSON.stringify(dbError));
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Thanks for your submission!</h1>
        <p className="mt-3 text-muted-foreground">
          We&apos;ll review your tool and add it to the directory if it meets our
          criteria. You&apos;ll hear from us soon.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Submit an AI Tool</h1>
        <p className="mt-3 text-muted-foreground">
          Know a great AI tool that should be in our directory? Submit it and
          our team will review it.
        </p>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Tool Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="website_url_confirm"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
                <Input id="name" name="name" required placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Your Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tool_name">Tool Name *</Label>
              <Input
                id="tool_name"
                name="tool_name"
                required
                placeholder="e.g., ChatGPT, Midjourney"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tool_website">Tool Website *</Label>
              <Input
                id="tool_website"
                name="tool_website"
                type="url"
                required
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tool_tagline">Tagline</Label>
              <Input
                id="tool_tagline"
                name="tool_tagline"
                placeholder="One-liner description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricing">Pricing Model</Label>
              <Select name="pricing">
                <SelectTrigger>
                  <SelectValue placeholder="Select pricing model" />
                </SelectTrigger>
                <SelectContent>
                  {pricingOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tool_description">Description</Label>
              <Textarea
                id="tool_description"
                name="tool_description"
                placeholder="What does this tool do? What makes it special?"
                rows={4}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full glow-sm" disabled={loading}>
              {loading ? (
                "Submitting..."
              ) : (
                <>
                  Submit Tool <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
