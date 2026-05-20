import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/blog/why-every-vibe-coder-needs-a-portfolio",
        destination: "/blog/welcome-to-aicensus",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "aicensus.xyz" }],
        destination: "https://aicensus.co/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.aicensus.xyz" }],
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
