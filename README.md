# AiCensus

The trusted directory of AI tools. Discover, compare, and choose the right AI tools for your workflow.

## Quick Start

### 1. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click "New Project" and give it the name `aicensus`
3. Choose a strong database password (save it somewhere safe)
4. Select the region closest to you
5. Wait for the project to finish setting up (~2 minutes)

**Get your keys:**
- In your Supabase dashboard, go to **Settings > API**
- Copy `Project URL` and `anon public` key

### 2. Configure environment variables

Open the file `.env.local` in this project and replace the placeholder values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Set up the database

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Open the file `supabase/migrations/20260212000000_initial_schema.sql` from this project
4. Copy the ENTIRE content and paste it into the SQL editor
5. Click "Run" - you should see "Success. No rows returned"

### 4. Create your admin account

1. In Supabase dashboard, go to **Authentication > Users**
2. Click "Add user" > "Create new user"
3. Enter your email and a strong password
4. Copy the User UID that appears
5. Go to **SQL Editor** and run:

```sql
INSERT INTO admin_profiles (id, display_name, role)
VALUES ('PASTE-YOUR-USER-UID-HERE', 'Your Name', 'admin');
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - you'll see the AiCensus homepage.

Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login) and log in with the email/password you created in step 4.

---

## How to Use the Admin Panel

### Adding a Tool

1. Go to `/admin` and click "Add Tool"
2. Fill in the tabs:
   - **Basic Info**: Name, tagline, website, category, pricing, rating
   - **Content**: Description, features, use cases, pros/cons, target audience
   - **Media & Links**: Logo URL, screenshot URL, affiliate URL, company info
   - **SEO**: Custom meta title and description (optional - auto-generated if blank)
3. Click "Save as Draft" to save without publishing, or "Publish" to make it live

### Managing Categories

1. Go to `/admin/categories`
2. Type a category name, choose an icon, add a description
3. Click "Add"

**Available icons:** brain, code, image, message-square, music, video, file-text, bar-chart-3, search, bot, paintbrush, globe

**Recommended starting categories:**
- Writing & Content (icon: file-text)
- Coding & Development (icon: code)
- Image Generation (icon: image)
- Chatbots & Assistants (icon: message-square)
- Data & Analytics (icon: bar-chart-3)
- Video & Audio (icon: video)
- Design & Creative (icon: paintbrush)
- Research & Search (icon: search)
- AI Agents (icon: bot)
- Productivity (icon: brain)

### Reviewing Submissions

1. Go to `/admin/submissions`
2. Click on a pending submission to expand details
3. Add optional admin notes
4. Click "Approve & Create Draft" or "Reject"
5. Approved submissions create a draft tool - go to `/admin/tools` to edit and publish it

---

## Deploying to Production

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial AiCensus build"
git remote add origin https://github.com/YOUR_USERNAME/aicensus.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click "Import Project" and select your `aicensus` repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
   - `NEXT_PUBLIC_SITE_URL` = your production domain (e.g., `https://aicensus.xyz`)
4. Click "Deploy"

### 3. Connect your domain

1. In Vercel, go to your project > Settings > Domains
2. Add your domain (e.g., `aicensus.xyz`)
3. Follow Vercel's instructions to update your DNS settings at your domain registrar
4. SSL is automatic

### 4. Set up Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add your domain
3. Verify ownership (Vercel makes this easy with a DNS record)
4. Submit your sitemap: `https://yourdomain.com/sitemap.xml`

---

## Project Structure

```
src/
  app/
    (public)/           Public-facing pages
      page.tsx           Homepage
      tools/             Browse & tool detail pages
      categories/        Category listing & detail pages
      submit/            Community submission form
      about/             About page
    admin/              Admin panel (password-protected)
      page.tsx           Dashboard
      tools/             Tool management (CRUD)
      submissions/       Review community submissions
      categories/        Category management
      login/             Admin login
    api/                API routes
      revalidate/        Cache revalidation endpoint
    sitemap.ts          Dynamic sitemap generation
    robots.ts           Robots.txt configuration

  components/
    ui/                 shadcn/ui components (Button, Card, Table, etc.)
    layout/             Navbar, Footer
    tools/              Tool cards, grids
    filters/            Search & filter components
    categories/         Category cards
    shared/             Rating stars, badges, empty states
    admin/              Admin sidebar, tool form

  lib/
    supabase/           Supabase client setup
    queries/            Database query functions
    types/              TypeScript type definitions
    utils.ts            Utility functions
```

---

## Database Schema

The database has these tables:

| Table | Purpose |
|-------|---------|
| `categories` | AI tool categories (Writing, Coding, etc.) |
| `tools` | Main tool listings with all details |
| `tags` | Flexible tags for tools |
| `tool_tags` | Links tools to tags |
| `tool_alternatives` | Links tools to their alternatives |
| `submissions` | Community tool submissions |
| `admin_profiles` | Admin user access control |

---

## Future Roadmap

### Phase 2: AI Product Verification Lab
- Add `benchmark_suites` and `benchmark_results` tables
- Create `/benchmarks` page with comparison charts
- Add benchmark data to tool detail pages

### Phase 3: AI Ecosystem Map
- Add `integrations` table tracking tool connections
- Create `/ecosystem` interactive graph visualization
- Add "Integrates with" sections to tool pages

### Phase 4: AI Stack Builder
- Add `stacks` and `stack_tools` tables
- Create `/stacks` for browsing recommended AI stacks
- Add stack builder tool for comparing cost and capabilities

The current database schema is designed to support all future phases without requiring changes to existing tables.

---

## Tech Stack

- **Next.js 16** - React framework with server-side rendering
- **Supabase** - PostgreSQL database, authentication, API
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - Component library
- **Vercel** - Hosting and deployment
- **TypeScript** - Type safety

## Useful Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run linter
```
