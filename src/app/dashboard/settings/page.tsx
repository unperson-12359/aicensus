"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ProfileForm } from "@/components/dashboard/profile-form";
import type { UserProfile } from "@/lib/types/database";

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return <p className="text-muted-foreground">Profile not found.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mb-8 text-muted-foreground">Manage your profile and portfolio settings</p>
      <ProfileForm profile={profile} />
    </div>
  );
}
