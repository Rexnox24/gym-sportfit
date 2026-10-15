// Gym Sportfit brand web fonts: Montserrat (body/UI) and Barlow Condensed (display headings).
// They must be loaded with a <link> tag in the document head. Tailwind v4's Lightning CSS
// build resolves @import from the filesystem, so a remote font stylesheet can never be
// @import'ed from src/styles.css — that would fail the build.
//
// Consumers: spread `brandFontLinks` into the route `head()` links array (TanStack Start)
// or add the same <link> to their HTML head. Without it the brand type falls back to
// the system sans-serif.
export const BRAND_FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Montserrat:wght@400;500;600;700;800&display=swap";

export const brandFontLinks = [{ rel: "stylesheet", href: BRAND_FONT_HREF }];
