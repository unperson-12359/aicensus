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
          background: "#000000",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 72,
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
          color: "#ffffff",
        }}
      >
        {/* Subtle grid backdrop */}
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

        {/* Top row: eyebrow + url */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 16,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          <span>AI tools directory · est. 2026</span>
          <span>aicensus.co</span>
        </div>

        {/* Huge headline */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            fontSize: 112,
            fontWeight: 700,
            letterSpacing: "-0.055em",
            lineHeight: 0.92,
          }}
        >
          <span>Find AI tools.</span>
          <span>Build with them.</span>
          <span style={{ color: "rgba(255,255,255,0.4)" }}>Get noticed.</span>
        </div>

        {/* Footer: brand */}
        <div
          style={{
            marginTop: 48,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ fontSize: 22, color: "rgba(255,255,255,0.7)", maxWidth: 620 }}>
            The curated directory of 200+ AI tools — plus a free portfolio to showcase
            what you build.
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              display: "flex",
            }}
          >
            AiCensus<span style={{ color: "rgba(255,255,255,0.4)" }}>.</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
