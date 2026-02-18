import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AiCensus — Discover & Compare the Best AI Tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0f 0%, #0d1117 40%, #111827 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background geometric shapes */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 80,
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: "2px solid rgba(99, 102, 241, 0.15)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 100,
            width: 160,
            height: 160,
            borderRadius: "50%",
            border: "2px solid rgba(99, 102, 241, 0.1)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 200,
            right: 150,
            width: 80,
            height: 80,
            border: "2px solid rgba(139, 92, 246, 0.12)",
            transform: "rotate(45deg)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 150,
            left: 120,
            width: 60,
            height: 60,
            border: "2px solid rgba(139, 92, 246, 0.1)",
            transform: "rotate(45deg)",
            display: "flex",
          }}
        />

        {/* Site name */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 0,
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          <span style={{ color: "#818cf8" }}>Ai</span>
          <span style={{ color: "#f1f5f9" }}>Census</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: 16,
            fontSize: 24,
            color: "#94a3b8",
            letterSpacing: "0.05em",
            display: "flex",
          }}
        >
          Discover & Compare the Best AI Tools
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, transparent, #818cf8, #a78bfa, #818cf8, transparent)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
