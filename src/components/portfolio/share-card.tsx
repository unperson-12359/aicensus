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

const BG = "#000000";
const TEXT = "#ffffff";
const MUTED = "rgba(255,255,255,0.6)";
const SUBTLE = "rgba(255,255,255,0.4)";
const BORDER = "rgba(255,255,255,0.12)";
const FAINT = "rgba(255,255,255,0.04)";

function AiCensusLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <rect x="3" y="3" width="26" height="26" rx="6" stroke={TEXT} strokeWidth="2" />
        <rect x="11" y="11" width="10" height="10" rx="1.5" fill={TEXT} />
      </svg>
      <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.025em", color: TEXT }}>
        AiCensus<span style={{ color: SUBTLE }}>.</span>
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
          border: `2px solid ${BORDER}`,
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
        background: FAINT,
        border: `2px solid ${BORDER}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.4,
        fontWeight: 700,
        color: TEXT,
      }}
    >
      {profile.display_name.charAt(0).toUpperCase()}
    </div>
  );
}

function BadgePill({ label, variant }: { label: string; variant: "tech" | "ai" }) {
  const isAi = variant === "ai";
  const bg = isAi ? TEXT : FAINT;
  const color = isAi ? BG : TEXT;
  const border = isAi ? TEXT : BORDER;

  return (
    <span
      style={{
        display: "inline-flex",
        padding: "4px 12px",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 600,
        background: bg,
        color,
        border: `1px solid ${border}`,
        whiteSpace: "nowrap",
        letterSpacing: "-0.005em",
      }}
    >
      {label}
    </span>
  );
}

function GridBackdrop() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        display: "flex",
      }}
    />
  );
}

export function ProfileShareCard({ profile, projects, tagline }: ProfileShareCardProps) {
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
        background: BG,
        position: "relative",
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <GridBackdrop />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "36px 56px 0",
        }}
      >
        <AiCensusLogo />
        <span style={{ fontSize: 15, color: MUTED, letterSpacing: "0.02em" }}>
          aicensus.xyz
        </span>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 56px",
          gap: 18,
        }}
      >
        <AvatarDisplay profile={profile} size={110} />

        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontSize: 44,
              fontWeight: 700,
              color: TEXT,
              letterSpacing: "-0.035em",
              margin: 0,
            }}
          >
            {profile.display_name}
          </h2>
          <p style={{ fontSize: 20, color: MUTED, margin: "6px 0 0" }}>
            @{profile.username}
          </p>
        </div>

        {tagline && (
          <p
            style={{
              fontSize: 20,
              color: MUTED,
              maxWidth: 780,
              textAlign: "center",
              lineHeight: 1.45,
              margin: 0,
              fontStyle: "italic",
            }}
          >
            &ldquo;{tagline}&rdquo;
          </p>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 10,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              padding: "6px 14px",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 600,
              background: TEXT,
              color: BG,
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

      {/* Bottom hairline */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 56,
          right: 56,
          height: 1,
          background: BORDER,
        }}
      />
    </div>
  );
}

export function ProjectShareCard({ profile, project, tagline }: ProjectShareCardProps) {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        background: BG,
        position: "relative",
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <GridBackdrop />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "36px 56px 0",
        }}
      >
        <AiCensusLogo />
        <span style={{ fontSize: 15, color: MUTED, letterSpacing: "0.02em" }}>
          aicensus.xyz
        </span>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          padding: "0 56px",
          gap: 52,
        }}
      >
        <div
          style={{
            width: 440,
            height: 280,
            borderRadius: 20,
            overflow: "hidden",
            border: `1px solid ${BORDER}`,
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
                background: FAINT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 56,
                fontWeight: 700,
                color: SUBTLE,
              }}
            >
              {project.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
          <h2
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: TEXT,
              letterSpacing: "-0.035em",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {project.name}
          </h2>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <AvatarDisplay profile={profile} size={32} />
            <span style={{ fontSize: 17, color: MUTED }}>
              by <span style={{ color: TEXT }}>@{profile.username}</span>
            </span>
          </div>

          {tagline && (
            <p
              style={{
                fontSize: 17,
                color: MUTED,
                lineHeight: 1.45,
                margin: 0,
                fontStyle: "italic",
              }}
            >
              &ldquo;{tagline}&rdquo;
            </p>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
            {project.tech_stack.slice(0, 4).map((t) => (
              <BadgePill key={t} label={t} variant="tech" />
            ))}
            {project.ai_tools_used.slice(0, 3).map((t) => (
              <BadgePill key={t} label={t} variant="ai" />
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 56,
          right: 56,
          height: 1,
          background: BORDER,
        }}
      />
    </div>
  );
}
