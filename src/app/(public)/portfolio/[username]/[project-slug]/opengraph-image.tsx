import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";
export const alt = "AiCensus Project";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ username: string; "project-slug": string }>;
}) {
  const { username, "project-slug": projectSlug } = await params;

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("id, display_name, username, avatar_url")
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
          Project Not Found
        </div>
      ),
      { ...size }
    );
  }

  const { data: project } = await supabase
    .from("portfolio_projects")
    .select("name, description, thumbnail_url, tech_stack, ai_tools_used")
    .eq("user_id", profile.id)
    .eq("slug", projectSlug)
    .eq("status", "published")
    .single();

  if (!project) {
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
          Project Not Found
        </div>
      ),
      { ...size }
    );
  }

  const description = project.description
    ? project.description.length > 120
      ? project.description.slice(0, 120) + "..."
      : project.description
    : "";

  const techStack = (project.tech_stack as string[]) || [];
  const aiTools = (project.ai_tools_used as string[]) || [];
  const allBadges = [...techStack.slice(0, 4), ...aiTools.slice(0, 2)];

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

        {/* Main content — side by side */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            padding: "0 48px",
            gap: 48,
          }}
        >
          {/* Thumbnail */}
          <div
            style={{
              width: 420,
              height: 260,
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              flexShrink: 0,
            }}
          >
            {project.thumbnail_url ? (
              <img
                src={project.thumbnail_url}
                width={420}
                height={260}
                style={{ width: 420, height: 260, objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(135deg, #1e1b4b, #312e81, #1e1b4b)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 48,
                  color: "rgba(129, 140, 248, 0.3)",
                }}
              >
                {project.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Project info */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "#f1f5f9",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              {project.name}
            </div>

            {/* Author */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  width={32}
                  height={32}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #1e1b4b, #312e81)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#818cf8",
                  }}
                >
                  {profile.display_name.charAt(0).toUpperCase()}
                </div>
              )}
              <span style={{ fontSize: 16, color: "#94a3b8", display: "flex" }}>
                by{" "}
                <span style={{ color: "#c4b5fd", marginLeft: 4 }}>
                  @{username}
                </span>
              </span>
            </div>

            {/* Description */}
            {description && (
              <div
                style={{
                  fontSize: 16,
                  color: "#94a3b8",
                  lineHeight: 1.5,
                  display: "flex",
                }}
              >
                {description}
              </div>
            )}

            {/* Badges */}
            {allBadges.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                {allBadges.map((badge) => (
                  <span
                    key={badge}
                    style={{
                      display: "flex",
                      padding: "4px 12px",
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 500,
                      background: "rgba(255, 255, 255, 0.08)",
                      color: "#94a3b8",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
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
