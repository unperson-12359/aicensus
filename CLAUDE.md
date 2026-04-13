# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Next.js dev server
- `npm run build` — Production build (use to verify changes compile)
- `npm run lint` — ESLint
- No test framework is configured

## Architecture

AiCensus is an AI tools directory built with **Next.js 16 (App Router) + Supabase + Tailwind CSS 4 + shadcn/ui**.

### Route Groups

- `src/app/(public)/` — Public pages (homepage, tools, categories, portfolio, submit, about, blog)
- `src/app/(auth)/` — Auth pages (login, signup, forgot-password)
- `src/app/admin/` — Admin panel (requires `admin_profiles` DB entry)
- `src/app/dashboard/` — User dashboard (requires authenticated user with `user_profiles` entry)
- `src/app/api/` — API routes (revalidate, stripe checkout/webhooks)

Each group has its own layout. Public layout includes Navbar/Footer; admin and dashboard have sidebars.

### Middleware

`src/middleware.ts` delegates to `src/lib/supabase/middleware.ts` which handles auth session refresh and route protection. Matcher: `/admin/*`, `/dashboard/*`, `/login`, `/signup`, `/forgot-password`.

### Supabase

- **Browser client**: `src/lib/supabase/client.ts` — `createBrowserClient`
- **Server client**: `src/lib/supabase/server.ts` — `createServerClient` with cookie handling
- **Middleware client**: `src/lib/supabase/middleware.ts`
- Clients are **untyped** (generic `<Database>` caused `never` type issues with `@supabase/ssr`). Types live in `src/lib/types/database.ts` and are cast manually in queries.
- Query functions: `src/lib/queries/{tools,categories,submissions,portfolio}.ts`

### Styling

- **Dark-only theme** — forced via next-themes, no light mode
- **OKLCH color space** — CSS variables in `src/app/globals.css` mapped through Tailwind `@theme`
- **Fonts**: Geist (sans), Geist Mono, Space Grotesk (display)
- **`cn()` utility** in `src/lib/utils.ts` — clsx + tailwind-merge for class composition
- Custom glow effects, geometric decorations, and animations defined in globals.css

### Forms

react-hook-form + Zod validation + shadcn/ui Form components. Key forms: `src/components/admin/tool-form.tsx`, `src/components/auth/auth-form.tsx`, `src/components/dashboard/profile-form.tsx`.

### Motion

Framer Motion components in `src/components/motion/` (FadeIn, StaggerChildren, etc.). Respects `prefers-reduced-motion`.

### Key Integrations

- **Stripe** — Featured tool subscriptions (`src/lib/stripe.ts`, `/api/checkout/`, `/api/webhooks/stripe`)
- **Cloudflare Turnstile** — Bot protection on auth forms
- **ISR** — Revalidation via `/api/revalidate` endpoint with secret token

## Conventions

- Slug-based routing for tools, categories, and portfolios (not IDs)
- Path alias: `@/*` maps to `src/*`
- shadcn/ui uses new-york style — add components via `npx shadcn@latest add <component>`
- SEO: metadata exports in page files + JSON-LD structured data in `src/components/shared/json-ld.tsx`
- SQL migrations in `supabase/migrations/`

## Environment Variables

Required (see `.env.example`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `REVALIDATION_SECRET`.
