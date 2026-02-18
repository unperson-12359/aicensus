import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account - AiCensus",
  description: "Create your AiCensus account and start showcasing your AI-built projects.",
};

export default function SignupPage() {
  return (
    <Suspense>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
