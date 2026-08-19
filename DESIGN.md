# Design — Admin (`app/admin/**`)

<!-- impeccable:design-schema 1 -->

Scope: the `/admin` surface only. The public storefront (`app/(site)/**`) keeps its
own identity (`app/(site)/globals.css`, brand green/orange, 'Aleo' serif) — the two
surfaces intentionally do not share a stylesheet or visual system, only the same two
brand hues, reused deliberately (see below).

## World

An instrument-panel dashboard: light graphite page holding a floating dark sidebar
and elevated white cards. Pinned by a user-supplied reference screenshot (a fintech
dashboard); adapted to Delírio Tropical's own palette rather than copied verbatim.

## Color

Restrained strategy — neutrals plus one accent, chosen because this is an Operate
surface (task completion, not persuasion).

| Role | Value | Token |
|---|---|---|
| Page background | `#EEF0F3` | `--admin-bg` |
| Sidebar | `#1B1F27` | `--admin-sidebar` |
| Card / surface | `#FFFFFF` | `--admin-card` |
| Border | `#E7E9EE` | `--admin-border` |
| Text | `#1B1F27` | `--admin-text` |
| Muted text | `#868C9A` | `--admin-text-muted` |
| **Accent** (primary actions, active states) | `#F58153` | `--admin-accent` |
| Accent soft (icon chips, badges) | `#FDECE3` | `--admin-accent-soft` |
| Success / active badge | `#00AE81` | `--admin-green` |
| Destructive | `#E5484D` | `--admin-red` |

The accent and green are the storefront's own `--orange` and `--green` — reused so
the admin reads as "the same company," not a generic dashboard template, per
PRODUCT.md's brand commitment. Values are duplicated as literals (not shared CSS
custom properties) since the admin has its own root layout/stylesheet, isolated from
`app/(site)/globals.css` by design.

## Type

System UI stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Inter, ...`)
— Operate surfaces are well served by workhorse system faces; no custom font load for
an internal tool. Scale: 11–13.5px UI text, 19–21px headings, 28px stat numbers.

## Shape & elevation

- Radius scale: `--admin-radius-lg: 20px` (sidebar, cards), `--admin-radius-md: 14px`,
  `--admin-radius-sm: 9px` (buttons, inputs, pills).
- Shadow: two-layer soft shadow (`--admin-shadow`), never a flat/zero-offset halo.
- Active states use a filled pill (sidebar link, page tab) or a white pill on the
  dark sidebar — never a colored left-border accent.

## Components

- **Sidebar** (`.admin-sidebar`): dark, rounded, sticky, floats inside the page
  padding (does not touch the viewport edge). Icon + label nav rows; active row is a
  white pill. Icons are hand-authored inline SVG (`components/admin/icons.tsx`),
  single stroke weight (1.8px), never emoji/unicode glyphs.
- **Topbar** (`.admin-topbar`): time-of-day greeting (`Bom dia` / `Boa tarde` /
  `Boa noite`) + derived display name, user chip on the right. Persistent across
  every admin page; page-specific `<h1>` lives inside the content area.
- **Card** (`.admin-card`, `.admin-panel`): white, 20px radius, soft shadow.
  `.admin-card` is the clickable dashboard shortcut (icon chip + live count, real
  data only — no fabricated stats); `.admin-panel` is the generic content
  container used by every list/form.
- **Table** (`.admin-table`): uppercase muted headers, thumbnail images, pill status
  badges (`.admin-badge--green` / `--gray`), icon-labeled row actions.
- **Tabs** (`.admin-tabs` / `.admin-tab`): pill tabs, one per site page, each showing
  a live field count. Used by the Páginas editor (`components/admin/ContentManager.tsx`)
  to scope 91 fields down to one page at a time instead of one long scrolling list.
- **Forms**: consistent `.admin-form` label/input pattern shared by login, store
  editor, and the per-field content editor. Focus state is a 2px accent outline
  (`:focus-visible`), not a browser default.

## Responsive

Single breakpoint at 900px: sidebar collapses from a tall vertical rail to a short
horizontal bar (icon-only, labels hidden via CSS but kept as `aria-label` for
screen readers), main content stacks full-width.

## What this is not

Not a literal fintech-dashboard clone — no charts, currency widgets, or "quick
transaction" avatar rows, since none of that maps to this product's actual content
(banner images, store locations, page text). The reference's *structure* (floating
dark sidebar, greeting header, white elevated cards, single accent) was adopted; its
*content* was replaced with what this admin actually manages.
