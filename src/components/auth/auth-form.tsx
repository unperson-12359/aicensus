"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { isUsernameReserved } from "@/lib/utils";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"credentials" | "profile">("credentials");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const supabase = createClient();

  async function checkUsername(username: string) {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    if (!/^[a-z0-9][a-z0-9_-]*$/.test(username)) {
      setUsernameAvailable(false);
      return;
    }

    if (isUsernameReserved(username)) {
      setUsernameAvailable(false);
      return;
    }

    setCheckingUsername(true);
    const { data } = await supabase
      .from("user_profiles")
      .select("username")
      .eq("username", username)
      .single();

    setUsernameAvailable(!data);
    setCheckingUsername(false);
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  }

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    if (step === "credentials") {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        setLoading(false);
        return;
      }

      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      setStep("profile");
      setLoading(false);
      return;
    }

    // Step 2: Create profile
    const username = formData.get("username") as string;
    const displayName = formData.get("displayName") as string;

    if (!usernameAvailable) {
      setError("Please choose an available username.");
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("Authentication failed. Please try again.");
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("user_profiles")
      .insert({
        id: user.id,
        username: username.toLowerCase(),
        display_name: displayName,
      });

    if (profileError) {
      if (profileError.message.includes("username")) {
        setError("Username is already taken.");
      } else {
        setError("Failed to create profile. Please try again.");
      }
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (mode === "login") {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <svg className="h-6 w-6 text-primary" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.5" />
              <rect x="9.5" y="9.5" width="13" height="13" rx="1" transform="rotate(45 16 16)" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="2.5" fill="currentColor" />
            </svg>
          </div>
          <CardTitle className="mt-4">Welcome back</CardTitle>
          <CardDescription>Sign in to your AiCensus account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required placeholder="Enter your password" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="flex justify-between text-sm">
              <Link href="/forgot-password" className="text-muted-foreground hover:text-foreground">
                Forgot password?
              </Link>
              <Link href="/signup" className="text-primary hover:underline">
                Create account
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Signup mode
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <svg className="h-6 w-6 text-primary" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.5" />
            <rect x="9.5" y="9.5" width="13" height="13" rx="1" transform="rotate(45 16 16)" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="2.5" fill="currentColor" />
          </svg>
        </div>
        <CardTitle className="mt-4">
          {step === "credentials" ? "Create your account" : "Set up your profile"}
        </CardTitle>
        <CardDescription>
          {step === "credentials"
            ? "Join AiCensus and showcase your AI-built projects"
            : "Choose a username for your portfolio URL"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-4">
          {step === "credentials" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required placeholder="At least 6 characters" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required placeholder="Confirm your password" />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  required
                  placeholder="your-username"
                  pattern="^[a-z0-9][a-z0-9_-]{2,29}$"
                  title="3-30 characters, lowercase letters, numbers, hyphens, underscores. Must start with letter or number."
                  onChange={(e) => {
                    const val = e.target.value.toLowerCase();
                    e.target.value = val;
                    checkUsername(val);
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  aicensus.com/portfolio/<span className="text-primary">your-username</span>
                </p>
                {checkingUsername && (
                  <p className="text-xs text-muted-foreground">Checking availability...</p>
                )}
                {usernameAvailable === true && (
                  <p className="text-xs text-green-400">Username is available!</p>
                )}
                {usernameAvailable === false && (
                  <p className="text-xs text-destructive">Username is not available.</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" name="displayName" required placeholder="Your Name" />
              </div>
            </>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? step === "credentials"
                ? "Creating account..."
                : "Setting up profile..."
              : step === "credentials"
                ? "Continue"
                : "Create Profile"}
          </Button>
          {step === "credentials" && (
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
