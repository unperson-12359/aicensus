import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AiCensus — Discover & Compare the Best AI Tools",
    short_name: "AiCensus",
    description:
      "The curated directory of verified AI tools. Find, compare, and choose the right AI tools for your workflow.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#818cf8",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
