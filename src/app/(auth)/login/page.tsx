import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - AiCensus",
  description: "Sign in to your AiCensus account to manage your portfolio.",
};

export default function LoginPage() {
  return (
    <Suspense>
      <AuthForm mode="login" />
    </Suspense>
  );
}
