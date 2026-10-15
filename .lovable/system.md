# Gym Sportfit — Design System

Brand design system for **Gym Sportfit**: an aggressive-but-premium gym identity —
near-black surfaces, a single acid-yellow neon accent, condensed uppercase display
type. Every project that attaches this library builds in that voice.

## Philosophy

- **Dark first, always.** Backgrounds are near-black; light text on dark. There is no
  light theme.
- **One accent, used sparingly.** Acid yellow (`--primary`) marks the thing the user
  should act on: the active nav item, a price, a primary CTA, a focus ring. If two
  accents compete, one is wrong.
- **Type carries the attitude.** Headlines are `Barlow Condensed`, extra-bold,
  uppercase, tight leading (`line-height: 1`). Body and UI copy are `Montserrat` at
  small sizes with wide letter-spacing on labels and eyebrows.
- **Photography is the product.** Real gym photos sit in darkened, softly filtered
  containers with dynamic crops. Never brighten or flatten them into stock-looking
  tiles.
- Spanish is the interface language for this brand. Keep UI copy in Spanish.

## Hard constraints

1. **Never hardcode a color, radius, or shadow.** Use the tokens in
   `src/styles.css` (`--background`, `--foreground`, `--primary`, `--secondary`,
   `--border`, `--destructive`, `--radius-md`, `--shadow-card`) or the Tailwind
   utilities mapped from them (`bg-background`, `text-primary`, `border-border`).
   Raw hex/oklch values in page code are a defect.
2. **Actions go through `Button` variants**, never an ad-hoc styled `<div>`:
   `sport` (yellow CTA), `heroOutline` (outlined CTA on photography), `link`,
   `outline`, `ghost`, `default`; sizes `sm` → `xl`.
3. **Load the brand fonts.** `src/styles.css` sets `--font-sans: Montserrat` and
   `--font-display: Barlow Condensed`, but the fonts are *not* bundled — they load
   from a `<link>` in the document head. Spread `brandFontLinks` (exported from the
   barrel) into the route `head()` links array, or add `BRAND_FONT_HREF` to the HTML
   head. Without it, every headline silently falls back to the system sans-serif.
   Never `@import` the remote font URL inside `src/styles.css` — the Tailwind v4
   Lightning CSS build resolves `@import` from the filesystem and the build fails.
4. **The theme is one file.** `src/styles.css` is the canonical theme entry: it maps
   tokens into Tailwind's `@theme` namespace and defines the brand layout classes
   (`.shell`, `.hero`, `.ticker`, `.site-header`, `.join-band`, `.plan-card`,
   `.social-links`). Importing the barrel (`@/design-system/{slug}`) pulls it in.
   Consumers on their own Tailwind setup must include that file in their build.
5. **Touch targets stay ≥ 44px** (`--space-touch`) and every interactive element needs
   a visible focus style. Icon-only controls need an accessible name.
6. **Respect `prefers-reduced-motion`** — the global rule in `styles.css` disables
   animations and transitions; don't reintroduce motion that ignores it.

## Preferred patterns

```tsx
// CTA — always a Button variant, always token-colored
<Button asChild variant="sport" size="xl">
  <Link to="/planes">VER PLANES <ArrowUpRight /></Link>
</Button>

// Section rhythm — .shell centers and pads, .section sets vertical spacing
<section className="section shell">
  <div className="section-top">…</div>
</section>

// Social destinations — never hand-write the hrefs
<SocialLinks variant="labeled" />
```

- Layout primitives to reuse before writing new ones: `.shell`, `.section`,
  `.section-top`, `.page-title`, `.join-band`, `.rates-grid`, `.plans-grid`,
  `.plan-card`, `.information-section`, `.payment-strip`, `.social-links`.
- Component-level classes live in `styles.css` next to the tokens; that is deliberate
  — the brand layout is part of the system, not per-page CSS.

## What agents should NOT do

- No light backgrounds, no white cards, no pastel palettes.
- No second accent color (no blue/purple "gym neon" gradients) — yellow only.
- No serif or rounded display type; `Barlow Condensed` and `Montserrat` only.
- No inline `style={{}}` for look-and-feel, and no raw hex in `className`
  (e.g. `text-[#F2C200]`).
- No new button, card, or badge component when a `Button` variant, `.plan-card`,
  `.rate-card`, or `.badge` already covers it — add a variant instead.
- Don't invent specs, prices, opening hours, or machine names: commercial content
  comes from `src/lib/gym-data.ts` and `src/lib/plans.ts`.

## Reference

See `design-tokens.md` for the full token table, `components.md` for the component
index and props, `library-guidelines.md` for stack and theme-file notes, and
`assets.md` for the logo and photography catalog.
