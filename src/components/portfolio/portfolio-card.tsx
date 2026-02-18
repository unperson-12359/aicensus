import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { UserProfile } from "@/lib/types/database";

interface PortfolioCardProps {
  user: UserProfile;
}

export function PortfolioCard({ user }: PortfolioCardProps) {
  return (
    <Link href={`/portfolio/${user.username}`}>
      <Card className="group overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        {/* Header image or gradient */}
        <div className="relative h-24 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
          {user.header_image_url && (
            <img
              src={user.header_image_url}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>

        <CardContent className="relative px-4 pb-4 pt-0">
          {/* Avatar */}
          <div className="-mt-8 mb-3">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.display_name}
                className="h-16 w-16 rounded-xl border-2 border-background object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-background bg-muted text-xl font-bold text-muted-foreground">
                {user.display_name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <h3 className="font-semibold group-hover:text-primary">
            {user.display_name}
          </h3>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
          {user.bio && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {user.bio}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
