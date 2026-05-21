import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
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

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://aicensus.co"
  ),
  title: {
    default: "AiCensus — Discover & Compare the Best AI Tools",
    template: "%s",
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
  verification: {
    google: "MszvIS-O5ocRwBWfod4-g_Z7jxUew84_Yz6rTMqQcS0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-0QBWVXJJQ0";

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} font-sans antialiased`}
      >
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `}
            </Script>
          </>
        ) : null}
        <ThemeProvider>
          <TooltipProvider>
            <div className="flex min-h-screen flex-col">{children}</div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
