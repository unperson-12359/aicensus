"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

export const SAVED_STORAGE_KEY = "aicensus.saved.v1";
const SAVED_EVENT = "aicensus:saved-change";

export interface SavedTool {
  slug: string;
  savedAt: string;
}

export interface SavedComparison {
  slugs: string[];
  label?: string;
  savedAt: string;
}

export interface SavedStack {
  url: string;
  title?: string;
  savedAt: string;
}

export interface SavedStateV1 {
  tools: SavedTool[];
  comparisons: SavedComparison[];
  stacks: SavedStack[];
}

function emptySavedState(): SavedStateV1 {
  return { tools: [], comparisons: [], stacks: [] };
}

let memoryState: SavedStateV1 = emptySavedState();
let lastStorageRaw: string | null | undefined;
const serverSavedState = emptySavedState();

function nowIso(): string {
  return new Date().toISOString();
}

function cleanSlug(slug: unknown): string | null {
  if (typeof slug !== "string") return null;
  const cleaned = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  return cleaned ? cleaned.slice(0, 80) : null;
}

function cleanUrl(url: unknown): string | null {
  if (typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("/stacks/build")) return trimmed.slice(0, 1200);

  try {
    const parsed = new URL(trimmed);
    if (parsed.pathname !== "/stacks/build") return null;
    return `${parsed.pathname}${parsed.search}`.slice(0, 1200);
  } catch {
    return null;
  }
}

function cleanSavedAt(savedAt: unknown): string {
  if (typeof savedAt !== "string") return nowIso();
  const date = new Date(savedAt);
  return Number.isNaN(date.getTime()) ? nowIso() : date.toISOString();
}

function sortBySavedAtDesc<T extends { savedAt: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  );
}

export function comparisonKey(slugs: string[]): string {
  return slugs.map((slug) => cleanSlug(slug)).filter(Boolean).join("/");
}

export function stackKey(url: string): string {
  return cleanUrl(url) ?? "";
}

export function normalizeSavedState(value: unknown): SavedStateV1 {
  if (!value || typeof value !== "object") return emptySavedState();

  const raw = value as Partial<SavedStateV1>;
  const seenTools = new Set<string>();
  const tools = Array.isArray(raw.tools)
    ? raw.tools.flatMap((item) => {
        const slug = cleanSlug((item as SavedTool).slug);
        if (!slug || seenTools.has(slug)) return [];
        seenTools.add(slug);
        return [{ slug, savedAt: cleanSavedAt((item as SavedTool).savedAt) }];
      })
    : [];

  const seenComparisons = new Set<string>();
  const comparisons = Array.isArray(raw.comparisons)
    ? raw.comparisons.flatMap((item) => {
        const slugs = Array.isArray((item as SavedComparison).slugs)
          ? (item as SavedComparison).slugs
              .map((slug) => cleanSlug(slug))
              .filter((slug): slug is string => Boolean(slug))
              .slice(0, 4)
          : [];
        const key = comparisonKey(slugs);
        if (slugs.length < 2 || seenComparisons.has(key)) return [];
        seenComparisons.add(key);
        const label =
          typeof (item as SavedComparison).label === "string"
            ? (item as SavedComparison).label?.slice(0, 160)
            : undefined;
        return [{ slugs, label, savedAt: cleanSavedAt((item as SavedComparison).savedAt) }];
      })
    : [];

  const seenStacks = new Set<string>();
  const stacks = Array.isArray(raw.stacks)
    ? raw.stacks.flatMap((item) => {
        const url = cleanUrl((item as SavedStack).url);
        if (!url || seenStacks.has(url)) return [];
        seenStacks.add(url);
        const title =
          typeof (item as SavedStack).title === "string"
            ? (item as SavedStack).title?.slice(0, 160)
            : undefined;
        return [{ url, title, savedAt: cleanSavedAt((item as SavedStack).savedAt) }];
      })
    : [];

  return {
    tools: sortBySavedAtDesc(tools),
    comparisons: sortBySavedAtDesc(comparisons),
    stacks: sortBySavedAtDesc(stacks),
  };
}

export function readSavedState(): SavedStateV1 {
  if (typeof window === "undefined") return emptySavedState();

  try {
    const raw = window.localStorage.getItem(SAVED_STORAGE_KEY);
    if (raw === lastStorageRaw) return memoryState;
    lastStorageRaw = raw;
    if (!raw) return memoryState;
    memoryState = normalizeSavedState(JSON.parse(raw));
    return memoryState;
  } catch {
    return memoryState;
  }
}

function writeSavedState(next: SavedStateV1): void {
  memoryState = normalizeSavedState(next);
  if (typeof window === "undefined") return;

  try {
    lastStorageRaw = JSON.stringify(memoryState);
    window.localStorage.setItem(SAVED_STORAGE_KEY, lastStorageRaw);
  } catch {
    // Keep the in-memory state so the current tab still works.
  }
}

function notifySavedStateChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SAVED_EVENT));
}

export function subscribeToSavedState(listener: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const onSavedChange = () => listener();
  const onStorage = (event: StorageEvent) => {
    if (!event.key || event.key === SAVED_STORAGE_KEY) listener();
  };

  window.addEventListener(SAVED_EVENT, onSavedChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(SAVED_EVENT, onSavedChange);
    window.removeEventListener("storage", onStorage);
  };
}

function updateSavedState(updater: (state: SavedStateV1) => SavedStateV1): SavedStateV1 {
  const next = normalizeSavedState(updater(readSavedState()));
  writeSavedState(next);
  notifySavedStateChanged();
  return next;
}

export function getSavedTotal(state: SavedStateV1): number {
  return state.tools.length + state.comparisons.length + state.stacks.length;
}

export function isToolSaved(state: SavedStateV1, slug: string): boolean {
  const cleaned = cleanSlug(slug);
  return Boolean(cleaned && state.tools.some((tool) => tool.slug === cleaned));
}

export function isComparisonSaved(state: SavedStateV1, slugs: string[]): boolean {
  const key = comparisonKey(slugs);
  return Boolean(key && state.comparisons.some((item) => comparisonKey(item.slugs) === key));
}

export function isStackSaved(state: SavedStateV1, url: string): boolean {
  const key = stackKey(url);
  return Boolean(key && state.stacks.some((item) => stackKey(item.url) === key));
}

export function useSavedItems() {
  const state = useSyncExternalStore(
    subscribeToSavedState,
    readSavedState,
    () => serverSavedState
  );

  const update = useCallback((updater: (state: SavedStateV1) => SavedStateV1) => {
    const next = updateSavedState(updater);
    return next;
  }, []);

  const saveTool = useCallback(
    (slug: string) => {
      const cleaned = cleanSlug(slug);
      if (!cleaned) return;
      update((current) => ({
        ...current,
        tools: [{ slug: cleaned, savedAt: nowIso() }, ...current.tools.filter((t) => t.slug !== cleaned)],
      }));
    },
    [update]
  );

  const removeTool = useCallback(
    (slug: string) => {
      const cleaned = cleanSlug(slug);
      if (!cleaned) return;
      update((current) => ({
        ...current,
        tools: current.tools.filter((tool) => tool.slug !== cleaned),
      }));
    },
    [update]
  );

  const toggleTool = useCallback(
    (slug: string) => {
      const current = readSavedState();
      if (isToolSaved(current, slug)) removeTool(slug);
      else saveTool(slug);
    },
    [removeTool, saveTool]
  );

  const saveComparison = useCallback(
    (slugs: string[], label?: string) => {
      const cleaned = slugs
        .map((slug) => cleanSlug(slug))
        .filter((slug): slug is string => Boolean(slug))
        .slice(0, 4);
      const key = comparisonKey(cleaned);
      if (cleaned.length < 2 || !key) return;
      update((current) => ({
        ...current,
        comparisons: [
          { slugs: cleaned, label, savedAt: nowIso() },
          ...current.comparisons.filter((item) => comparisonKey(item.slugs) !== key),
        ],
      }));
    },
    [update]
  );

  const removeComparison = useCallback(
    (slugs: string[]) => {
      const key = comparisonKey(slugs);
      if (!key) return;
      update((current) => ({
        ...current,
        comparisons: current.comparisons.filter((item) => comparisonKey(item.slugs) !== key),
      }));
    },
    [update]
  );

  const toggleComparison = useCallback(
    (slugs: string[], label?: string) => {
      const current = readSavedState();
      if (isComparisonSaved(current, slugs)) removeComparison(slugs);
      else saveComparison(slugs, label);
    },
    [removeComparison, saveComparison]
  );

  const saveStack = useCallback(
    (url: string, title?: string) => {
      const cleaned = cleanUrl(url);
      if (!cleaned) return;
      update((current) => ({
        ...current,
        stacks: [
          { url: cleaned, title, savedAt: nowIso() },
          ...current.stacks.filter((item) => stackKey(item.url) !== cleaned),
        ],
      }));
    },
    [update]
  );

  const removeStack = useCallback(
    (url: string) => {
      const key = stackKey(url);
      if (!key) return;
      update((current) => ({
        ...current,
        stacks: current.stacks.filter((item) => stackKey(item.url) !== key),
      }));
    },
    [update]
  );

  const toggleStack = useCallback(
    (url: string, title?: string) => {
      const current = readSavedState();
      if (isStackSaved(current, url)) removeStack(url);
      else saveStack(url, title);
    },
    [removeStack, saveStack]
  );

  const total = useMemo(() => getSavedTotal(state), [state]);

  return {
    hydrated: true,
    state,
    total,
    saveTool,
    removeTool,
    toggleTool,
    saveComparison,
    removeComparison,
    toggleComparison,
    saveStack,
    removeStack,
    toggleStack,
  };
}
