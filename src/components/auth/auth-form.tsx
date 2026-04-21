"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
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
  const rawRedirect = searchParams.get("redirect") || "/dashboard";
  const ALLOWED_PREFIXES = ["/dashboard", "/admin", "/portfolio", "/tools", "/categories"];
  const decoded = (() => { try { return decodeURIComponent(rawRedirect); } catch { return ""; } })();
  const redirect =
    decoded.startsWith("/") &&
    !decoded.startsWith("//") &&
    !decoded.includes("\\") &&
    ALLOWED_PREFIXES.some((p) => decoded.startsWith(p))
      ? decoded
      : "/dashboard";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"credentials" | "profile">("credentials");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const [authUser, setAuthUser] = useState<{ id: string } | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const supabase = createClient();

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  function checkUsername(username: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);

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
    debounceRef.current = setTimeout(async () => {
      const { data } = await supabase
        .from("user_profiles")
        .select("username")
        .eq("username", username)
        .single();

      setUsernameAvailable(!data);
      setCheckingUsername(false);
    }, 300);
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !captchaToken) {
      setError("Please complete the verification.");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
      ...(captchaToken ? { options: { captchaToken } } : {}),
    });

    if (authError) {
      setError("Invalid credentials. Please try again.");
      setCaptchaToken(null);
      turnstileRef.current?.reset();
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

      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        setLoading(false);
        return;
      }

      if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !captchaToken) {
        setError("Please complete the verification.");
        setLoading(false);
        return;
      }

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        ...(captchaToken ? { options: { captchaToken } } : {}),
      });

      if (authError) {
        setError(authError.message);
        setCaptchaToken(null);
        turnstileRef.current?.reset();
        setLoading(false);
        return;
      }

      if (data.user) {
        setAuthUser({ id: data.user.id });
      }

      // If email confirmation is required and no session, inform the user
      if (!data.session) {
        setError("Please check your email to confirm your account, then come back and log in.");
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

    // Use stored user from signup, or fallback to getUser
    let userId = authUser?.id;
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    }

    if (!userId) {
      setError("Authentication failed. Please try again.");
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("user_profiles")
      .insert({
        id: userId,
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
          <div className="mx-auto">
            <span className="font-display text-2xl font-bold tracking-tight">
              <span className="text-primary">Ai</span>Census
            </span>
          </div>
          <CardTitle className="mt-2">Welcome back</CardTitle>
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
            {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
              <Turnstile
                ref={turnstileRef}
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                onSuccess={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken(null)}
                options={{ theme: "dark", size: "flexible" }}
              />
            )}
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
        <div className="mx-auto">
          <span className="font-display text-2xl font-bold tracking-tight">
            <span className="text-primary">Ai</span>Census
          </span>
        </div>
        <CardTitle className="mt-2">
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
                <Input id="password" name="password" type="password" required placeholder="At least 8 characters" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required placeholder="Confirm your password" />
              </div>
              {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                <Turnstile
                  ref={turnstileRef}
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                  onSuccess={(token) => setCaptchaToken(token)}
                  onExpire={() => setCaptchaToken(null)}
                  options={{ theme: "dark", size: "flexible" }}
                />
              )}
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
                  aicensus.xyz/portfolio/<span className="text-primary">your-username</span>
                </p>
                {checkingUsername && (
                  <p className="text-xs text-muted-foreground">Checking availability...</p>
                )}
                {usernameAvailable === true && (
                  <p className="text-xs text-foreground">Username is available.</p>
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
