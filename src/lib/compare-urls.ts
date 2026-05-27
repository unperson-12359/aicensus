import { POPULAR_COMPARISONS } from "@/lib/popular-comparisons";

/** Stable alphabetical order for comparison URL slugs. */
export function normalizeComparisonSlugs(slugs: string[]): string[] {
  return [...slugs].sort((a, b) => a.localeCompare(b));
}

export function getComparisonPath(slugs: string[]): string {
  return `/compare/${normalizeComparisonSlugs(slugs).join("/")}`;
}

export function comparisonKey(slugs: string[]): string {
  return normalizeComparisonSlugs(slugs).join("|");
}

export function isCuratedComparison(slugs: string[]): boolean {
  if (slugs.length !== 2) return false;
  const key = comparisonKey(slugs);
  return POPULAR_COMPARISONS.some(
    (pair) => pair.slugs.length === 2 && comparisonKey(pair.slugs) === key
  );
}

/** Index only curated 2-tool pairs; noindex ad-hoc and 3–4 tool comparisons. */
export function shouldIndexComparison(slugs: string[]): boolean {
  return slugs.length === 2 && isCuratedComparison(slugs);
}

export function slugsNeedRedirect(slugs: string[]): boolean {
  const normalized = normalizeComparisonSlugs(slugs);
  return slugs.some((slug, index) => slug !== normalized[index]);
}
