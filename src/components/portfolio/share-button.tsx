"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareModal } from "./share-modal";
import type { UserProfile, PortfolioProject } from "@/lib/types/database";

interface ShareProfileButtonProps {
  type: "profile";
  profile: UserProfile;
  projects: PortfolioProject[];
  username: string;
}

interface ShareProjectButtonProps {
  type: "project";
  profile: UserProfile;
  project: PortfolioProject;
  username: string;
}

type ShareButtonProps = ShareProfileButtonProps | ShareProjectButtonProps;

export function ShareButton(props: ShareButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Share2 className="mr-2 h-3.5 w-3.5" />
        Share
      </Button>
      <ShareModal
        open={open}
        onOpenChange={setOpen}
        type={props.type}
        profile={props.profile}
        username={props.username}
        projects={props.type === "profile" ? props.projects : undefined}
        project={props.type === "project" ? props.project : undefined}
      />
    </>
  );
}
