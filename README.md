# AiCensus

The trusted directory of AI tools. Discover, compare, and choose the right AI tools for your workflow.

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env.local` from `.env.example` and fill in the production or local values:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
REVALIDATION_SECRET=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Set up Supabase

Apply the SQL files in `supabase/migrations/` in timestamp order. For local experiments, paste the migrations into the Supabase SQL editor or use a linked Supabase CLI project.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What AiCensus Is Now

AiCensus is focused on:

- Curated AI tool listings
- Tool categories and search/filtering
- Side-by-side comparisons
- Best-of guides
- Stack recipes and stack builder flows
- Prompt builder
- Blog and educational guides
- Browser-local saved tools/comparisons/stacks
- Contact form for corrections, bug reports, and suggestions

Some legacy database tables and migrations remain for historical compatibility,
but they are not part of the active public product.

## Project Structure

```text
src/
  app/
    (public)/             Public pages
      page.tsx            Homepage
      tools/              Browse, detail, and alternatives pages
      categories/         Category listing and detail pages
      compare/            Comparison index and dynamic compare pages
      best/               Best-of editorial guides
      stacks/             Stack pages and builder
      prompt-builder/     Prompt builder
      blog/               Blog index and posts
      contact/            Contact page
      faq/                FAQ
      privacy/            Privacy policy
      terms/              Terms of service
    api/
      contact/            Validated server-side contact endpoint
      revalidate/         Cache revalidation endpoint
      tools/by-slugs/     Tool lookup API for compare/stacks
    sitemap.ts            Dynamic sitemap generation
    robots.ts             Robots.txt configuration

  components/
    ui/                   shadcn/ui components
    layout/               Navbar and footer
    tools/                Tool cards and grids
    compare/              Comparison UI
    stacks/               Stack explorer/browser UI
    filters/              Search and filter components
    saved/                Browser-local saved items UI
    shared/               Badges, JSON-LD, logos, pagination

  lib/
    supabase/             Supabase clients
    queries/              Active database query helpers
    types/                Database types
    utils.ts              Shared utilities
```

## Active Database Tables

The active public app primarily uses:

| Table | Purpose |
|-------|---------|
| `categories` | AI tool categories |
| `tools` | Main tool listings |
| `tags` | Flexible tags for tools |
| `tool_tags` | Links tools to tags |
| `tool_alternatives` | Links tools to alternatives |
| `contact_messages` | Contact form messages |

Legacy tables may still exist in Supabase and generated types, but they are not part of the current public product.

## Deployment

Push to `main`; production deploys from GitHub/Vercel.

Required production environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `REVALIDATION_SECRET`
- `NEXT_PUBLIC_SITE_URL`

## Useful Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run linter
```
