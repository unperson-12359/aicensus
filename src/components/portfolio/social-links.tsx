import { Github, Twitter, Linkedin, Globe, Mail } from "lucide-react";

interface SocialLinksProps {
  githubUrl?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
  websiteUrl?: string | null;
  contactEmail?: string | null;
}

const links = [
  { key: "githubUrl", icon: Github, label: "GitHub" },
  { key: "twitterUrl", icon: Twitter, label: "Twitter" },
  { key: "linkedinUrl", icon: Linkedin, label: "LinkedIn" },
  { key: "websiteUrl", icon: Globe, label: "Website" },
  { key: "contactEmail", icon: Mail, label: "Email", isEmail: true },
] as const;

export function SocialLinks(props: SocialLinksProps) {
  const activeLinks = links.filter((link) => {
    const value = props[link.key];
    return value && value.trim().length > 0;
  });

  if (activeLinks.length === 0) return null;

  return (
    <div className="flex items-center gap-3">
      {activeLinks.map((link) => {
        const url = props[link.key]!;
        const href = link.key === "contactEmail" ? `mailto:${url}` : url;

        return (
          <a
            key={link.key}
            href={href}
            target={link.key === "contactEmail" ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            title={link.label}
          >
            <link.icon className="h-4 w-4" />
          </a>
        );
      })}
    </div>
  );
}
