import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
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

const dmSans = DM_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdf6ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0c0f" },
  ],
};

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
    "AI tool reviews",
    "AI pricing comparison",
    "ChatGPT alternatives",
    "AI productivity tools",
    "AI writing tools",
    "AI image generators",
    "AI code assistants",
  ],
  authors: [{ name: "AiCensus" }],
  creator: "AiCensus",
  publisher: "AiCensus",
  category: "Technology",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "AiCensus",
    title: "AiCensus — Discover & Compare the Best AI Tools",
    description:
      "The curated directory of verified AI tools. Find, compare, and choose the right AI tools for your workflow. Expert reviews, pricing breakdowns, pros & cons.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AiCensus — Discover & Compare the Best AI Tools",
    description:
      "The curated directory of verified AI tools. Find, compare, and choose the right AI tools for your workflow.",
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable} font-sans antialiased`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0QBWVXJJQ0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0QBWVXJJQ0');
          `}
        </Script>
        <ThemeProvider>
          <TooltipProvider>
            <div className="flex min-h-screen flex-col">{children}</div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
