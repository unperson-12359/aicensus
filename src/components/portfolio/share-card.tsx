"use client";

import type { UserProfile, PortfolioProject } from "@/lib/types/database";

interface ProfileShareCardProps {
  profile: UserProfile;
  projects: PortfolioProject[];
  tagline: string;
}

interface ProjectShareCardProps {
  profile: UserProfile;
  project: PortfolioProject;
  tagline: string;
}

function AiCensusLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {/* Bauhaus geometric mark */}
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" stroke="#818cf8" strokeWidth="2.5" />
        <rect x="11" y="11" width="10" height="10" rx="2" fill="#818cf8" />
      </svg>
      <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>
        <span style={{ color: "#818cf8" }}>Ai</span>
        <span style={{ color: "#f1f5f9" }}>Census</span>
      </span>
    </div>
  );
}

function AvatarDisplay({ profile, size = 100 }: { profile: UserProfile; size?: number }) {
  if (profile.avatar_url) {
    return (
      <img
        src={profile.avatar_url}
        alt={profile.display_name}
        width={size}
        height={size}
        style={{
          width: size,
          height: size,
          borderRadius: 16,
          objectFit: "cover",
          border: "2px solid rgba(129, 140, 248, 0.3)",
        }}
        crossOrigin="anonymous"
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 16,
        background: "linear-gradient(135deg, #1e1b4b, #312e81)",
        border: "2px solid rgba(129, 140, 248, 0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.4,
        fontWeight: 700,
        color: "#818cf8",
      }}
    >
      {profile.display_name.charAt(0).toUpperCase()}
    </div>
  );
}

function BadgePill({ label, variant }: { label: string; variant: "tech" | "ai" }) {
  const bg = variant === "ai" ? "rgba(129, 140, 248, 0.15)" : "rgba(255, 255, 255, 0.08)";
  const color = variant === "ai" ? "#818cf8" : "#94a3b8";
  const border = variant === "ai" ? "1px solid rgba(129, 140, 248, 0.3)" : "1px solid rgba(255, 255, 255, 0.1)";

  return (
    <span
      style={{
        display: "inline-flex",
        padding: "4px 12px",
        borderRadius: 6,
        fontSize: 13,
        fontWeight: 500,
        background: bg,
        color,
        border,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function GradientAccentLine() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        background: "linear-gradient(90deg, transparent, #818cf8, #a78bfa, #818cf8, transparent)",
      }}
    />
  );
}

function BackgroundShapes() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 60,
          width: 140,
          height: 140,
          borderRadius: "50%",
          border: "1.5px solid rgba(99, 102, 241, 0.08)",
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
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 180,
          left: 80,
          width: 50,
          height: 50,
          border: "1.5px solid rgba(139, 92, 246, 0.06)",
          transform: "rotate(45deg)",
        }}
      />
    </>
  );
}

export function ProfileShareCard({ profile, projects, tagline }: ProfileShareCardProps) {
  // Aggregate tech stack and AI tools from published projects
  const allTech = new Set<string>();
  const allAiTools = new Set<string>();
  for (const p of projects) {
    p.tech_stack.forEach((t) => allTech.add(t));
    p.ai_tools_used.forEach((t) => allAiTools.add(t));
  }
  const topTech = Array.from(allTech).slice(0, 3);
  const topAi = Array.from(allAiTools).slice(0, 3);

  return (
    <div
      style={{
        width: 1200,
        height: 630,
        background: "linear-gradient(135deg, #0a0a0f 0%, #0d1117 40%, #111827 100%)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <BackgroundShapes />

      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "32px 48px 0",
        }}
      >
        <AiCensusLogo />
        <span style={{ fontSize: 15, color: "#64748b", letterSpacing: "0.02em" }}>
          aicensus.xyz
        </span>
      </div>

      {/* Main content — centered */}
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
        <AvatarDisplay profile={profile} size={100} />

        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h2
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: "#f1f5f9",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            {profile.display_name}
          </h2>
          <p style={{ fontSize: 18, color: "#64748b", margin: "4px 0 0" }}>
            @{profile.username}
          </p>
        </div>

        {/* Tagline */}
        {tagline && (
          <p
            style={{
              fontSize: 18,
              color: "#94a3b8",
              maxWidth: 700,
              textAlign: "center",
              lineHeight: 1.5,
              margin: 0,
              fontStyle: "italic",
            }}
          >
            &ldquo;{tagline}&rdquo;
          </p>
        )}

        {/* Stats + badges row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 8,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              padding: "6px 16px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              background: "rgba(129, 140, 248, 0.1)",
              color: "#818cf8",
              border: "1px solid rgba(129, 140, 248, 0.2)",
            }}
          >
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </span>
          {topTech.map((t) => (
            <BadgePill key={t} label={t} variant="tech" />
          ))}
          {topAi.map((t) => (
            <BadgePill key={t} label={t} variant="ai" />
          ))}
        </div>
      </div>

      <GradientAccentLine />
    </div>
  );
}

export function ProjectShareCard({ profile, project, tagline }: ProjectShareCardProps) {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        background: "linear-gradient(135deg, #0a0a0f 0%, #0d1117 40%, #111827 100%)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <BackgroundShapes />

      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "32px 48px 0",
        }}
      >
        <AiCensusLogo />
        <span style={{ fontSize: 15, color: "#64748b", letterSpacing: "0.02em" }}>
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
            width: 440,
            height: 280,
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            flexShrink: 0,
          }}
        >
          {project.thumbnail_url ? (
            <img
              src={project.thumbnail_url}
              alt={project.name}
              width={440}
              height={280}
              style={{ width: 440, height: 280, objectFit: "cover" }}
              crossOrigin="anonymous"
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
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#f1f5f9",
              letterSpacing: "-0.02em",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {project.name}
          </h2>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <AvatarDisplay profile={profile} size={32} />
            <span style={{ fontSize: 16, color: "#94a3b8" }}>
              by <span style={{ color: "#c4b5fd" }}>@{profile.username}</span>
            </span>
          </div>

          {/* Tagline */}
          {tagline && (
            <p
              style={{
                fontSize: 16,
                color: "#94a3b8",
                lineHeight: 1.5,
                margin: 0,
                fontStyle: "italic",
              }}
            >
              &ldquo;{tagline}&rdquo;
            </p>
          )}

          {/* Badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
            {project.tech_stack.slice(0, 4).map((t) => (
              <BadgePill key={t} label={t} variant="tech" />
            ))}
            {project.ai_tools_used.slice(0, 3).map((t) => (
              <BadgePill key={t} label={t} variant="ai" />
            ))}
          </div>
        </div>
      </div>

      <GradientAccentLine />
    </div>
  );
}
