"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { ImageUpload } from "./image-upload";
import type { UserProfile } from "@/lib/types/database";

interface ProfileFormProps {
  profile: UserProfile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [displayName, setDisplayName] = useState(profile.display_name);
  const [bio, setBio] = useState(profile.bio || "");
  const [aboutMd, setAboutMd] = useState(profile.about_md || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [headerImageUrl, setHeaderImageUrl] = useState(profile.header_image_url || "");
  const [githubUrl, setGithubUrl] = useState(profile.github_url || "");
  const [twitterUrl, setTwitterUrl] = useState(profile.twitter_url || "");
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedin_url || "");
  const [websiteUrl, setWebsiteUrl] = useState(profile.website_url || "");
  const [contactEmail, setContactEmail] = useState(profile.contact_email || "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const supabase = createClient();

    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({
        display_name: displayName.trim(),
        bio: bio.trim() || null,
        about_md: aboutMd.trim() || null,
        avatar_url: avatarUrl || null,
        header_image_url: headerImageUrl || null,
        github_url: githubUrl.trim() || null,
        twitter_url: twitterUrl.trim() || null,
        linkedin_url: linkedinUrl.trim() || null,
        website_url: websiteUrl.trim() || null,
        contact_email: contactEmail.trim() || null,
      })
      .eq("id", profile.id);

    if (updateError) {
      setError("Failed to update profile. Please try again.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-6">
            <div className="space-y-2">
              <Label>Avatar</Label>
              <ImageUpload
                bucket="avatars"
                userId={profile.id}
                currentUrl={avatarUrl}
                onUpload={setAvatarUrl}
                onRemove={() => setAvatarUrl("")}
              />
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={profile.username} disabled />
                <p className="text-xs text-muted-foreground">Username cannot be changed.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name *</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A short bio about yourself"
            />
          </div>

          <div className="space-y-2">
            <Label>Header Image</Label>
            <ImageUpload
              bucket="portfolio-images"
              userId={profile.id}
              currentUrl={headerImageUrl}
              onUpload={setHeaderImageUrl}
              onRemove={() => setHeaderImageUrl("")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aboutMd">About (Markdown)</Label>
            <Textarea
              id="aboutMd"
              value={aboutMd}
              onChange={(e) => setAboutMd(e.target.value)}
              placeholder="Tell your story. Supports Markdown formatting."
              rows={8}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter / X</Label>
              <Input
                id="twitter"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                placeholder="https://x.com/username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yoursite.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email (public)</Label>
            <Input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="hello@example.com"
            />
            <p className="text-xs text-muted-foreground">
              Visitors can also contact you via the contact form on your portfolio.
            </p>
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-green-400">Profile updated successfully!</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
