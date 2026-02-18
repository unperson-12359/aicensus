"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

interface ContactFormProps {
  recipientUserId: string;
  recipientName: string;
}

export function ContactForm({ recipientUserId, recipientName }: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const senderName = formData.get("senderName") as string;
    const senderEmail = formData.get("senderEmail") as string;
    const message = formData.get("message") as string;

    // Honeypot
    const honey = formData.get("website_url") as string;
    if (honey) {
      setSent(true);
      setLoading(false);
      return;
    }

    const supabase = createClient();

    const { error: insertError } = await supabase
      .from("project_messages")
      .insert({
        recipient_user_id: recipientUserId,
        sender_name: senderName,
        sender_email: senderEmail,
        message,
      });

    if (insertError) {
      setError("Failed to send message. Please try again.");
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle className="h-10 w-10 text-green-400" />
          <p className="mt-4 font-medium">Message sent!</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {recipientName} will see your message in their dashboard.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact {recipientName}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot */}
          <input
            type="text"
            name="website_url"
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="senderName">Your Name *</Label>
              <Input id="senderName" name="senderName" required placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderEmail">Your Email *</Label>
              <Input id="senderEmail" name="senderEmail" type="email" required placeholder="john@example.com" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              name="message"
              required
              placeholder="Hey, I love your project! I'd like to..."
              rows={4}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={loading}>
            <Send className="mr-2 h-4 w-4" />
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
