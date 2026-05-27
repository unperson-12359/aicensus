import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "www.google.com", pathname: "/s2/favicons/**" },
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
    ],
  },
  async redirects() {
    const archivedToolRedirects = [
      { slug: "sora", destination: "/best/ai-video-generators" },
      { slug: "tome", destination: "/tools/gamma" },
      { slug: "playht", destination: "/tools/elevenlabs" },
      { slug: "perplexity-pages", destination: "/tools/perplexity" },
      { slug: "babyagi", destination: "/tools/crewai" },
      { slug: "phind", destination: "/tools/perplexity" },
      { slug: "socratic", destination: "/tools/brilliant" },
      { slug: "sweep", destination: "/tools/windsurf" },
      { slug: "agentgpt", destination: "/tools/crewai" },
      { slug: "haiper", destination: "/best/ai-video-generators" },
    ].flatMap(({ slug, destination }) => [
      {
        source: `/tools/${slug}`,
        destination,
        permanent: true,
      },
      {
        source: `/tools/${slug}/alternatives`,
        destination,
        permanent: true,
      },
    ]);

    return [
      {
        source: "/blog/why-every-vibe-coder-needs-a-portfolio",
        destination: "/blog/welcome-to-aicensus",
        permanent: true,
      },
      ...archivedToolRedirects,
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.aicensus.co" }],
        destination: "https://aicensus.co/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.aicensus.xyz" }],
        destination: "https://aicensus.co/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "aicensus.xyz" }],
        destination: "https://aicensus.co/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
