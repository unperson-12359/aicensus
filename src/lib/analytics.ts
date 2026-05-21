declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

export function trackOutboundClick(toolSlug: string, toolName: string, href: string): void {
  trackEvent("tool_outbound_click", {
    tool_slug: toolSlug,
    tool_name: toolName,
    link_url: href,
  });
}

export function trackToolSaved(toolSlug: string, saved: boolean): void {
  trackEvent("tool_saved", { tool_slug: toolSlug, action: saved ? "save" : "unsave" });
}

export function trackComparisonSaved(slugs: string[], saved: boolean): void {
  trackEvent("comparison_saved", {
    comparison_key: slugs.join("/"),
    action: saved ? "save" : "unsave",
  });
}

export function trackComparisonViewed(slugs: string[]): void {
  trackEvent("comparison_viewed", { comparison_key: slugs.join("/") });
}

export function trackSearchQuery(query: string): void {
  trackEvent("search_query", { search_term: query.slice(0, 80) });
}

export function trackStackBuilt(url: string): void {
  trackEvent("stack_built", { stack_url: url.slice(0, 200) });
}
