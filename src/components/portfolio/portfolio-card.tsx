import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { UserProfile } from "@/lib/types/database";

interface PortfolioCardProps {
  user: UserProfile;
}

export function PortfolioCard({ user }: PortfolioCardProps) {
  return (
    <Link
      href={`/portfolio/${user.username}`}
      className="bento-tile group relative flex h-full flex-col overflow-hidden hover:border-white/30"
    >
      {/* Header strip (image or subtle dotted pattern) */}
      <div className="relative h-28 overflow-hidden bg-white/[0.02]">
        {user.header_image_url ? (
          <img
            src={user.header_image_url}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bento-grid-pattern opacity-60" />
        )}
      </div>

      <div className="relative flex-1 px-5 pb-5 pt-0">
        {/* Avatar overlapping header */}
        <div className="-mt-9 mb-4">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.display_name}
              className="h-16 w-16 rounded-xl border-2 border-black object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-black bg-white/10 text-xl font-bold text-white">
              {user.display_name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold tracking-tight text-foreground">
              {user.display_name}
            </h3>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-white/30 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
        </div>

        {user.bio && (
          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
            {user.bio}
          </p>
        )}
      </div>
    </Link>
  );
}
