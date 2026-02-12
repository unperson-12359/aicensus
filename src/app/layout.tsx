import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "AiCensus — Discover & Compare the Best AI Tools",
    template: "%s | AiCensus",
  },
  description:
    "The curated directory of verified AI tools. Find, compare, and choose the right AI tools for your workflow. Expert reviews, pricing breakdowns, pros & cons.",
  keywords: [
    "AI tools",
    "AI directory",
    "AI tools comparison",
    "artificial intelligence",
    "AI software",
    "AI agents",
    "AI apps",
    "best AI tools",
  ],
  authors: [{ name: "AiCensus" }],
  creator: "AiCensus",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "AiCensus",
    title: "AiCensus — Discover & Compare the Best AI Tools",
    description: "The curated directory of verified AI tools.",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AiCensus — Discover & Compare the Best AI Tools",
    description: "The curated directory of verified AI tools.",
    images: ["/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <TooltipProvider>
            <div className="flex min-h-screen flex-col">{children}</div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
