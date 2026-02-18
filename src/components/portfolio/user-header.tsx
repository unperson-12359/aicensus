import { SocialLinks } from "./social-links";
import type { UserProfile } from "@/lib/types/database";

interface UserHeaderProps {
  profile: UserProfile;
  projectCount: number;
}

export function UserHeader({ profile, projectCount }: UserHeaderProps) {
  return (
    <div>
      {/* Header image */}
      {profile.header_image_url && (
        <div className="relative -mx-4 -mt-8 mb-8 h-48 overflow-hidden rounded-b-2xl sm:-mx-6 lg:-mx-8">
          <img
            src={profile.header_image_url}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
      )}

      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end">
        {/* Avatar */}
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.display_name}
            className="h-24 w-24 rounded-2xl border-2 border-border object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-border bg-muted text-3xl font-bold text-muted-foreground">
            {profile.display_name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="flex-1">
          <h1 className="text-3xl font-bold">{profile.display_name}</h1>
          <p className="mt-1 text-muted-foreground">@{profile.username}</p>
          {profile.bio && (
            <p className="mt-2 max-w-2xl text-muted-foreground">{profile.bio}</p>
          )}
          <div className="mt-3 flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {projectCount} {projectCount === 1 ? "project" : "projects"}
            </span>
            <SocialLinks
              githubUrl={profile.github_url}
              twitterUrl={profile.twitter_url}
              linkedinUrl={profile.linkedin_url}
              websiteUrl={profile.website_url}
              contactEmail={profile.contact_email}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
