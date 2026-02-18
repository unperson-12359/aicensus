import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLogoUrl(logoUrl: string | null, websiteUrl: string): string | null {
  if (logoUrl) return logoUrl;
  try {
    const domain = new URL(websiteUrl).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return null;
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

const RESERVED_USERNAMES = [
  "admin", "dashboard", "api", "portfolio", "login", "signup",
  "settings", "about", "tools", "categories", "submit", "help",
  "support", "contact", "blog", "docs", "null", "undefined",
];

export function isUsernameReserved(username: string): boolean {
  return RESERVED_USERNAMES.includes(username.toLowerCase());
}
