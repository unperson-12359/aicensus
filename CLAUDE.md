# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Next.js dev server
- `npm run build` — Production build (use to verify changes compile)
- `npm run lint` — ESLint
- `npm run check:slugs` — Report missing tool slugs in static catalogs
- `npm run check:predeploy` — lint + check:links + build (run before deploy)
- No test framework is configured

## Architecture

AiCensus is a **public-only** AI tools directory built with **Next.js 16 (App Router) + Supabase + Tailwind CSS 4 + shadcn/ui**.

There is no auth, admin panel, dashboard, middleware, or Stripe integration in the active codebase. Content is managed via Supabase dashboard + SQL migrations.

### Routes

- `src/app/(public)/` — All public pages (homepage, tools, categories, compare, best, stacks, mcps, prompt-builder, blog, saved, contact, about, faq, legal)
- `src/app/api/` — Server routes:
  - `contact/` — Validated contact form (writes to `contact_messages`)
  - `revalidate/` — ISR cache invalidation (secret header)
  - `tools/by-slugs/` — Tool lookup for compare/stacks client flows

Public layout includes Navbar/Footer (`src/app/(public)/layout.tsx`).

### Supabase

- **Server client**: `src/lib/supabase/server.ts` — `createServerClient` with cookie handling (read-only public queries)
- **Admin client**: `src/lib/supabase/admin.ts` — service role for contact form writes (server-only)
- Clients are **untyped** (generic `<Database>` caused `never` type issues with `@supabase/ssr`). Types live in `src/lib/types/database.ts` and are cast manually in queries.
- Active query helpers: `src/lib/queries/tools.ts`, `src/lib/queries/categories.ts`

### Hybrid content model

Not all content lives in the database. Static TypeScript catalogs drive SEO pages:

| File | Purpose |
|------|---------|
| `src/lib/stacks.ts` | Curated stack recipes |
| `src/lib/stack-explorer.ts` | Capability catalog for `/stacks/build` |
| `src/lib/best-for.ts` | Programmatic "Best AI tools for X" pages |
| `src/lib/popular-comparisons.ts` | Pre-rendered comparison pairs |
| `src/lib/mcp-servers.ts` | MCP server directory |
| `src/lib/comparison-content.ts` | Editorial verdicts/FAQs for compare pages |
| `src/content/blog/*.mdx` | Blog posts |

Tool slugs in static files must match published rows in the `tools` table. Run `npm run check:links` to validate.

### Saved items

Browser-local only — `localStorage` key `aicensus.saved.v1` via `src/lib/saved-items.ts`. No backend.

### Styling

- **Dark-only theme** — forced via `className="dark"` on `<html>`, no light mode
- **OKLCH color space** — CSS variables in `src/app/globals.css` mapped through Tailwind `@theme`
- **Fonts**: Geist (sans), Geist Mono, Instrument Serif (display/headlines)
- **`cn()` utility** in `src/lib/utils.ts` — clsx + tailwind-merge for class composition
- Custom glow effects, geometric decorations, and animations defined in globals.css

### Forms

Zod validation on API routes. Contact form is the only server-side write path from the public app.

### Motion

Framer Motion components in `src/components/motion/` (FadeIn, StaggerChildren, etc.). Respects `prefers-reduced-motion`.

### Key Integrations

- **Google Analytics** — optional via `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- **Sentry** — optional via `NEXT_PUBLIC_SENTRY_DSN` / `SENTRY_DSN`
- **Resend** — optional contact form email alerts via `RESEND_API_KEY`
- **ISR** — Revalidation via `/api/revalidate` endpoint with `REVALIDATION_SECRET`

## Conventions

- Slug-based routing for tools, categories, stacks, best-of, MCPs, and blog posts (not IDs)
- Path alias: `@/*` maps to `src/*`
- shadcn/ui uses new-york style — add components via `npx shadcn@latest add <component>`
- SEO: metadata exports in page files + JSON-LD structured data in `src/components/shared/json-ld.tsx`
- SQL migrations in `supabase/migrations/`

## Active vs Legacy Database Tables

**Active** (used by the public app):

| Table | Purpose |
|-------|---------|
| `categories` | AI tool categories |
| `tools` | Main tool listings |
| `tool_alternatives` | Alternative tool relationships |
| `contact_messages` | Contact form submissions |
| `contact_rate_limits` | Persistent rate limiting for contact API |

**Legacy** (may exist in Supabase/types but not wired to UI): `submissions`, `admin_profiles`, `user_profiles`, `portfolio_projects`, `project_messages`, `featured_subscriptions`, `tags`, `tool_tags`, `chat_rate_limits`.

## Environment Variables

Required (see `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — contact form writes
- `REVALIDATION_SECRET` — cache invalidation webhook
- `NEXT_PUBLIC_SITE_URL`

Optional:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — Google Analytics
- `NEXT_PUBLIC_SENTRY_DSN` / `SENTRY_DSN` — error monitoring
- `RESEND_API_KEY` — contact form email notifications
- `CONTACT_NOTIFY_EMAIL` — recipient for contact alerts
- `NEXT_PUBLIC_NEWSLETTER_URL` — external newsletter signup link (footer)

## Content Operations

| Cadence | Action |
|---------|--------|
| Weekly | Review contact messages; add 2–5 tools via SQL migration |
| Bi-weekly | Run `npm run check:links`; fix broken slugs in static catalogs |
| Monthly | Update `src/app/(public)/changelog/page.tsx`; refresh best-of pages |
| After migrations | Hit `/api/revalidate` with secret; verify CI passes |

## Platform Direction (Solo Founder)

Current strategy: **stay lean**. Public directory + SQL migrations + contact form. Defer auth/admin/Stripe until traffic justifies operational complexity. See README for details.
