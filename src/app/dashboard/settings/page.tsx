"use client";

import { useEffect, useState } from "react";
import { Mail, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { isUsernameReserved } from "@/lib/utils";
import { ProfileForm } from "@/components/dashboard/profile-form";
import type { UserProfile } from "@/lib/types/database";

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authEmail, setAuthEmail] = useState("");
  const [authUserId, setAuthUserId] = useState("");

  // Profile creation state
  const [creating, setCreating] = useState(false);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [createError, setCreateError] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setAuthEmail(user.email || "");
      setAuthUserId(user.id);

      const { data } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) setProfile(data as UserProfile);
      setLoading(false);
    }
    load();
  }, []);

  async function checkUsername(value: string) {
    if (value.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    if (!/^[a-z0-9][a-z0-9_-]*$/.test(value)) {
      setUsernameAvailable(false);
      return;
    }
    if (isUsernameReserved(value)) {
      setUsernameAvailable(false);
      return;
    }
    setCheckingUsername(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("user_profiles")
      .select("username")
      .eq("username", value)
      .single();
    setUsernameAvailable(!data);
    setCheckingUsername(false);
  }

  async function handleCreateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!usernameAvailable || !authUserId) return;

    setCreating(true);
    setCreateError("");

    const supabase = createClient();
    const { data, error } = await supabase
      .from("user_profiles")
      .insert({
        id: authUserId,
        username: username.toLowerCase(),
        display_name: displayName.trim(),
      })
      .select()
      .single();

    if (error) {
      setCreateError(
        error.message.includes("username")
          ? "Username is already taken."
          : "Failed to create profile. Please try again."
      );
      setCreating(false);
      return;
    }

    setProfile(data as UserProfile);
    setCreating(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mb-8 text-muted-foreground">
          Manage your profile and portfolio settings
        </p>

        {/* Account email */}
        <Card className="mb-6">
          <CardContent className="flex items-center gap-3 p-6">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Account Email
              </p>
              <p className="text-sm">{authEmail}</p>
            </div>
          </CardContent>
        </Card>

        {/* Profile creation */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <UserPlus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Complete Your Profile Setup</CardTitle>
                <CardDescription>
                  Your account is ready. Set up your portfolio profile to start showcasing projects.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  required
                  placeholder="your-username"
                  pattern="^[a-z0-9][a-z0-9_-]{2,29}$"
                  title="3-30 characters, lowercase letters, numbers, hyphens, underscores"
                  value={username}
                  onChange={(e) => {
                    const val = e.target.value.toLowerCase();
                    setUsername(val);
                    checkUsername(val);
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  aicensus.xyz/portfolio/
                  <span className="text-primary">{username || "your-username"}</span>
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
                <Input
                  id="displayName"
                  required
                  placeholder="Your Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              {createError && (
                <p className="text-sm text-destructive">{createError}</p>
              )}
              <Button type="submit" disabled={creating || !usernameAvailable}>
                {creating ? "Creating Profile..." : "Create Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mb-8 text-muted-foreground">Manage your profile and portfolio settings</p>

      {/* Account info */}
      <Card className="mb-6">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Account Email
              </p>
              <p className="text-sm">{authEmail}</p>
            </div>
          </div>
          <Badge variant="secondary">
            {profile.is_public ? "Public Profile" : "Private Profile"}
          </Badge>
        </CardContent>
      </Card>

      <ProfileForm profile={profile} />
    </div>
  );
}
