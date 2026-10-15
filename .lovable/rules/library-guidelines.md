# Apex Gym Vibe — Guidelines

## Components

The design system exports these components — import them from `@ws-de0c3e7f02ec7cce7e95/9f8ff976-376d-4f0d-b359-6600603dd21c` and compose them before building anything from scratch:

`Button`, `Constants`, `DialogClose`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogOverlay`, `DialogPortal`, `DialogTitle`, `DialogTrigger`, `Dialog`, `EquipmentGallery`, `SiteFooter`, `SiteHeader`

Per-component details (import stanzas, props, variants, examples) live in `.lovable/rules/libraries/{slug}/components.md` — on disk, not auto-loaded. Read that file or the component source when the name alone isn't enough.

## Theme Files

The design system's theme is delivered through the following files. The author's original source files carry the full wiring the design system needs — variable declarations, framework-specific directives, provider objects, etc. — and are the canonical import target.

- `@ws-de0c3e7f02ec7cce7e95/9f8ff976-376d-4f0d-b359-6600603dd21c/styles.css` (source — preferred import)
- `@ws-de0c3e7f02ec7cce7e95/9f8ff976-376d-4f0d-b359-6600603dd21c/dist/tokens.css` (auto-generated flat list of CSS custom properties — a raw-values fallback only; does NOT carry framework-specific wiring that the source files above provide)

