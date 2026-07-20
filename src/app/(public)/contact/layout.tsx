import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Have a question, found a bug, or want to partner up? Get in touch with the AiCensus team.",
  openGraph: {
    title: "Contact Us | AiCensus",
    description:
      "Have a question, found a bug, or want to partner up? Get in touch with the AiCensus team.",
    url: "/contact",
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
