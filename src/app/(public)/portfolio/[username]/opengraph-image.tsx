import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";
export const alt = "AiCensus Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("id, display_name, username, bio, avatar_url")
    .eq("username", username)
    .eq("is_public", true)
    .single();

  if (!profile) {
    return new ImageResponse(
      (
        <div
          style={{
            background: "linear-gradient(135deg, #0a0a0f 0%, #0d1117 40%, #111827 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui, sans-serif",
            color: "#64748b",
            fontSize: 24,
          }}
        >
          Portfolio Not Found
        </div>
      ),
      { ...size }
    );
  }

  const { count } = await supabase
    .from("portfolio_projects")
    .select("*", { count: "exact", head: true })
    .eq("user_id", profile.id)
    .eq("status", "published");

  const projectCount = count || 0;
  const displayName = profile.display_name || username;
  const bio = profile.bio
    ? profile.bio.length > 100
      ? profile.bio.slice(0, 100) + "..."
      : profile.bio
    : "AI-built projects showcase";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0f 0%, #0d1117 40%, #111827 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background shapes */}
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 60,
            width: 140,
            height: 140,
            borderRadius: "50%",
            border: "1.5px solid rgba(99, 102, 241, 0.08)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 40,
            width: 100,
            height: 100,
            borderRadius: "50%",
            border: "1.5px solid rgba(139, 92, 246, 0.06)",
            display: "flex",
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "32px 48px 0",
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              display: "flex",
            }}
          >
            <span style={{ color: "#818cf8" }}>Ai</span>
            <span style={{ color: "#f1f5f9" }}>Census</span>
          </div>
          <span style={{ fontSize: 15, color: "#64748b", display: "flex" }}>
            aicensus.xyz
          </span>
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 48px",
            gap: 16,
          }}
        >
          {/* Avatar */}
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              width={100}
              height={100}
              style={{
                width: 100,
                height: 100,
                borderRadius: 16,
                objectFit: "cover",
                border: "2px solid rgba(129, 140, 248, 0.3)",
              }}
            />
          ) : (
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: 16,
                background: "linear-gradient(135deg, #1e1b4b, #312e81)",
                border: "2px solid rgba(129, 140, 248, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
                fontWeight: 700,
                color: "#818cf8",
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Name */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: "#f1f5f9",
                letterSpacing: "-0.02em",
              }}
            >
              {displayName}
            </div>
            <div style={{ fontSize: 18, color: "#64748b", display: "flex" }}>
              @{username}
            </div>
          </div>

          {/* Bio */}
          <div
            style={{
              fontSize: 18,
              color: "#94a3b8",
              maxWidth: 700,
              textAlign: "center",
              display: "flex",
            }}
          >
            {bio}
          </div>

          {/* Project count */}
          <div
            style={{
              display: "flex",
              padding: "6px 16px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              background: "rgba(129, 140, 248, 0.1)",
              color: "#818cf8",
              border: "1px solid rgba(129, 140, 248, 0.2)",
            }}
          >
            {projectCount} {projectCount === 1 ? "project" : "projects"}
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background:
              "linear-gradient(90deg, transparent, #818cf8, #a78bfa, #818cf8, transparent)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
