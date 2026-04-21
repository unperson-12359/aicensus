"use client";

import { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { Download, Link2, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfileShareCard, ProjectShareCard } from "./share-card";
import type { UserProfile, PortfolioProject } from "@/lib/types/database";

// X (Twitter) logo SVG
function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "profile" | "project";
  profile: UserProfile;
  projects?: PortfolioProject[];
  project?: PortfolioProject;
  username: string;
}

export function ShareModal({
  open,
  onOpenChange,
  type,
  profile,
  projects = [],
  project,
  username,
}: ShareModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const defaultTagline =
    type === "project"
      ? (project?.description || "").slice(0, 80)
      : (profile.bio || "").slice(0, 80);

  const [tagline, setTagline] = useState(defaultTagline);

  // Reset tagline when modal opens with new data
  const handleOpenChange = useCallback(
    (value: boolean) => {
      if (value) {
        const newDefault =
          type === "project"
            ? (project?.description || "").slice(0, 80)
            : (profile.bio || "").slice(0, 80);
        setTagline(newDefault);
        setCopied(false);
      }
      onOpenChange(value);
    },
    [type, project, profile, onOpenChange]
  );

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.xyz";
  const shareUrl =
    type === "project" && project
      ? `${siteUrl}/portfolio/${username}/${project.slug}`
      : `${siteUrl}/portfolio/${username}`;

  const fileName =
    type === "project" && project
      ? `aicensus-${project.slug}.png`
      : `aicensus-${username}.png`;

  async function handleSaveImage() {
    if (!cardRef.current || saving) return;
    setSaving(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        width: 1200,
        height: 630,
        pixelRatio: 1,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } catch {
      // Silently fail — image generation can fail if external images block CORS
    } finally {
      setSaving(false);
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may fail in some contexts
    }
  }

  function handleShareOnX() {
    const text = tagline
      ? `${tagline} — Check out my ${type === "project" ? "project" : "portfolio"} on AiCensus`
      : `Check out my ${type === "project" ? "project" : "portfolio"} on AiCensus`;
    const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(intentUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Share {type === "project" ? "Project" : "Profile"}
          </DialogTitle>
        </DialogHeader>

        {/* Card preview — scaled to fit modal */}
        <div className="overflow-hidden rounded-lg border border-border">
          <div
            style={{
              transform: "scale(0.47)",
              transformOrigin: "top left",
              width: 1200,
              height: 630,
            }}
          >
            <div ref={cardRef}>
              {type === "project" && project ? (
                <ProjectShareCard
                  profile={profile}
                  project={project}
                  tagline={tagline}
                />
              ) : (
                <ProfileShareCard
                  profile={profile}
                  projects={projects}
                  tagline={tagline}
                />
              )}
            </div>
          </div>
        </div>

        {/* Tagline input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Custom tagline
          </label>
          <Input
            value={tagline}
            onChange={(e) => setTagline(e.target.value.slice(0, 80))}
            placeholder="Add a custom tagline..."
            maxLength={80}
          />
          <p className="text-xs text-muted-foreground text-right">
            {tagline.length}/80
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleSaveImage}
            disabled={saving}
            className="flex-1"
          >
            <Download className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Image"}
          </Button>
          <Button
            variant="outline"
            onClick={handleCopyLink}
            className="flex-1"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-foreground" />
                Copied!
              </>
            ) : (
              <>
                <Link2 className="mr-2 h-4 w-4" />
                Copy Link
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleShareOnX}
            className="flex-1"
          >
            <XLogo className="mr-2 h-4 w-4" />
            Share on X
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
