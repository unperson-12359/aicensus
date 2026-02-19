"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, CheckCircle2, Mail, MessageSquare, Clock } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { PageTransition, FadeIn, StaggerChildren, StaggerItem } from "@/components/motion";
import { createClient } from "@/lib/supabase/client";

const subjects = [
  { value: "general", label: "General Inquiry" },
  { value: "bug", label: "Bug Report" },
  { value: "submission", label: "Tool Submission Question" },
  { value: "portfolio", label: "Portfolio Help" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
];

const infoCards = [
  {
    icon: Mail,
    title: "Email",
    description: "hello@aicensus.xyz",
  },
  {
    icon: MessageSquare,
    title: "Use the form",
    description: "Fill out the form and we'll reply to your email.",
  },
  {
    icon: Clock,
    title: "Response time",
    description: "We typically reply within 24-48 hours.",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot check
    if (formData.get("website")) {
      setSubmitting(false);
      setSubmitted(true);
      return;
    }

    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    const supabase = createClient();
    const { error: insertError } = await supabase
      .from("contact_messages")
      .insert(data);

    if (insertError) {
      setError("Something went wrong. Please try again or email us directly.");
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <FadeIn>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h1 className="mt-6 font-display text-3xl font-bold">
                Message Sent
              </h1>
              <p className="mt-3 max-w-md text-muted-foreground">
                Thanks for reaching out. We&apos;ll get back to you as soon as we
                can — usually within 24-48 hours.
              </p>
              <Link
                href="/"
                className="mt-8 text-sm text-primary hover:underline"
              >
                Back to homepage
              </Link>
            </div>
          </FadeIn>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <FadeIn>
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Get in Touch
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-display sm:text-5xl">
              Contact Us
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Have a question, found a bug, or want to partner up? We&apos;d love to
              hear from you.
            </p>
          </div>
        </FadeIn>

        {/* Info cards */}
        <StaggerChildren className="mt-12 grid gap-4 sm:grid-cols-3">
          {infoCards.map((card) => (
            <StaggerItem key={card.title}>
              <Card className="border-border/50">
                <CardContent className="flex items-start gap-3 p-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <card.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{card.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerChildren>

        {/* Form */}
        <FadeIn delay={0.2}>
          <Card className="mx-auto mt-10 max-w-2xl border-border/50">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Honeypot */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select name="subject" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  You can also check our{" "}
                  <Link href="/faq" className="text-primary hover:underline">
                    FAQ
                  </Link>{" "}
                  for quick answers.
                </p>
              </form>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </PageTransition>
  );
}
