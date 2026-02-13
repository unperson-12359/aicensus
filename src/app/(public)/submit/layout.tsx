import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit an AI Tool — Add to AiCensus Directory",
  description:
    "Submit your AI tool to be reviewed and featured in the AiCensus directory. Help us build the most comprehensive AI tools database.",
  openGraph: {
    title: "Submit an AI Tool — Add to AiCensus Directory",
    description:
      "Submit your AI tool to be reviewed and featured in the AiCensus directory.",
    url: "/submit",
  },
  twitter: {
    card: "summary_large_image",
    title: "Submit an AI Tool | AiCensus",
    description:
      "Submit your AI tool to be reviewed and featured in the AiCensus directory.",
  },
  alternates: {
    canonical: "/submit",
  },
};

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
