/** Shared page and section spacing tokens — mobile-first, scales up at sm/lg. */
export const page = {
  listing: "mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12",
  editorial: "mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14",
  narrow: "mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8",
  wide: "mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14",
} as const;

export const section = {
  y: "py-8 sm:py-12 lg:py-14",
  gap: "mt-8 sm:mt-12 lg:mt-16",
  gapLoose: "mt-10 sm:mt-16 lg:mt-24",
  divider: "mt-12 border-t border-white/10 pt-8 sm:mt-20 sm:pt-10 lg:mt-28",
  inner: "mt-4 sm:mt-6 lg:mt-8",
} as const;

export type PageVariant = keyof typeof page;
