# AiCensus Platform Direction

Decision date: May 2026  
Status: **Option A — Stay lean** (active)

## Context

AiCensus is a solo-founder public AI tools directory. The codebase previously included auth, admin, dashboard, portfolio, and Stripe integrations. Those routes were removed to focus on catalog quality and SEO.

Legacy database tables may still exist in Supabase but are not wired to the active UI.

## Decision: Stay lean (months 1–3)

### What we ship

- Public directory (tools, categories, compare, best-of, stacks, MCPs, blog)
- Content managed via **Supabase dashboard + SQL migrations**
- Tool suggestions via **contact form** (with optional Resend email alerts)
- **Browser-local saved items** (no user accounts)
- Honest affiliate links where applicable; featured placement remains **manual/editorial** (no Stripe yet)

### What we defer

| Feature | Revisit when |
|---------|----------------|
| Admin panel (`/admin` tool CRUD) | Publishing 10+ tools/week and Supabase dashboard becomes painful |
| User accounts + saved sync | Newsletter + traffic prove retention need |
| Stripe featured subscriptions | ~10K+ monthly organic visits and inbound monetization demand |
| Portfolio / user profiles | No current product fit |

### Success signals to revisit

- **Admin panel:** Content ops takes >2 hours/week in Supabase SQL editor
- **Monetization:** Consistent inbound “feature my tool” requests + measurable outbound clicks
- **Accounts:** Users repeatedly ask to sync saved items across devices

### Guardrails

- Do not compromise “no pay-to-rank” — featured = visibility slot, not rating boost
- Do not rebuild auth until content ops pain is real
- Keep static TS catalogs (stacks, best-for, comparisons) — version control is a feature

## Review cadence

Re-evaluate this document when:

1. Organic sessions 2× from baseline
2. Contact form volume exceeds 20 messages/week
3. A specific deferred feature has a clear ROI case
