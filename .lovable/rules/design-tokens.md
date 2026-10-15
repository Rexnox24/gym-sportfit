# Design Tokens

Token reference for **GymSportFit**. Use utility classes and CSS variables — never raw values.

## Colors

Apply with any color utility: `bg-<name>`, `text-<name>`, `border-<name>`, `ring-<name>`, `divide-<name>`, etc.

| Name | CSS variable |
|---|---|
| `background` | `--background` |
| `foreground` | `--foreground` |
| `primary` | `--primary` |
| `primary-foreground` | `--primary-foreground` |
| `secondary` | `--secondary` |
| `muted-foreground` | `--muted-foreground` |
| `accent` | `--accent` |
| `border` | `--border` |
| `destructive` | `--destructive` |

## Typography

Typography classes (`font-*` for families, `text-*` for sizes):

| Class | CSS variable |
|---|---|
| `font-sans` | `--font-sans` |
| `font-display` | `--font-display` |
| — | `--type-hero-compact` |
| — | `--type-hero-short` |

## Spacing

Apply with any spacing utility: `p-<name>`, `m-<name>`, `gap-<name>`, `space-<name>`, `w-<name>`, `h-<name>`, etc.

| Name | CSS variable |
|---|---|
| `touch` | `--space-touch` |
| `social-gap` | `--space-social-gap` |
| `menu` | `--space-menu` |
| `hero-top` | `--space-hero-top` |
| `hero-bottom` | `--space-hero-bottom` |
| `hero-note` | `--space-hero-note` |
| `hero-short-top` | `--space-hero-short-top` |
| `hero-short-bottom` | `--space-hero-short-bottom` |

## Border Radius

Border-radius classes:

| Class | CSS variable |
|---|---|
| `rounded-md` | `--radius-md` |
| `rounded-lg` | `--radius-lg` |
| `rounded-sm` | `--radius-sm` |

## Shadows

Box-shadow classes:

| Class | CSS variable |
|---|---|
| `shadow-card` | `--shadow-card` |

## Other

Reference via `var(--name)` in inline styles or CSS.

| CSS variable |
|---|
| `--hero-shade` |

