# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are the Delírio Tropical restaurant's own staff/owner (non-technical), managing the site's content directly. Not public-facing — the `/admin` surface specifically is an internal tool used by a small number of trusted operators, not customers.

## Product Purpose

The public site (`app/(site)/**`) is the restaurant's marketing/storefront presence: menu discovery, store locations, ordering links, corporate events, contact. The `/admin` surface is a self-service CMS so staff can update the homepage banner images, store locations, and page copy across the whole site without a code deploy.

## Positioning

A small restaurant chain (9 locations, Rio de Janeiro + Niterói) migrating off a scraped WordPress site to Next.js. The admin isn't a general-purpose CMS product — it's a purpose-built internal tool scoped to exactly three content types (banner, lojas, page texts).

## Operating Context

- Public site: Next.js 15 App Router, all routes under `app/(site)/**`, styled by `app/(site)/globals.css`.
- Admin: `app/admin/**`, its own root layout (`app/admin/layout.tsx`) independent from the public site's Header/Footer, styled by `app/admin/admin.css`. Auth-gated via `middleware.ts` + cookie session (Prisma `AdminUser`, bcryptjs + jose).
- Data: MySQL via Prisma (`Store`, `HeroSlide`, `PageContent`, `AdminUser` models).
- The admin currently has: Banner (hero slide upload/reorder/toggle), Lojas (store CRUD), Textos (91 page-content fields as one long grouped list — about to be restructured into a "Páginas" tab-per-page editor).

## Capabilities and Constraints

- Admin is Operate mode: task completion (edit a field, save, confirm) outranks visual expression. Scanability and low friction for a non-technical daily user matter more than novelty.
- Must stay visually distinct from the public storefront (own layout root already enforces this) but should share the Delírio Tropical brand tokens where it reads as intentional, not accidental reuse.
- No multi-tenant, no user roles/permissions beyond a single admin login table — small internal tool, not a SaaS product.

## Brand Commitments

- Site name: Delírio Tropical. Existing brand tokens in `app/(site)/globals.css`: `--green: #00AE81` (primary), `--orange: #F58153` (secondary/accent), font `'Aleo', serif`.
- User provided a reference screenshot (a "Swiftpay" fintech dashboard UI) as binding visual direction for the admin restyle: dark rounded sidebar, light gray page background, white rounded content cards with soft shadow, orange accent, grouped sidebar nav sections, stat/chart cards. This is a visual-world decision for new-work to interpret, not to expand here.

## Evidence on Hand

- Full existing admin implementation (built this session): `app/admin/login/page.tsx`, `app/admin/(dashboard)/**`, `components/admin/**`, `app/admin/admin.css`.
- Public site's existing brand tokens and typography in `app/(site)/globals.css`.
- No logo/icon asset beyond the broken external WordPress image URLs already documented as a separate, deferred issue — do not source new brand imagery as part of this admin restyle.

## Product Principles

1. The admin is a tool for one non-technical operator, not a marketing surface — clarity and low cognitive load beat visual flair.
2. Reuse the storefront's brand tokens (green/orange/Aleo) so the admin reads as "the same company," not a generic dashboard template.
3. Every content type (banner, lojas, páginas) should feel like the same system — consistent card, table, and form patterns.
4. Preserve all existing functionality (auth, CRUD, upload, per-field save) — this is a visual and structural (tabs) pass, not a feature change.

## Accessibility & Inclusion

No specific standard was set by the user. Keep default good practice (contrast, focus states, keyboard-usable tabs and forms) since the operator may not be technical.
