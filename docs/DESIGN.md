# Dia Browser — Style Reference
> Prism on white stationery — light refracts color from a nearly monochrome surface.

**Theme:** light

Feels like holding a blank sheet of premium stationery up to warm morning light — the page is almost entirely achromatic, but a hidden spectrum bleeds through in concentrated gradient bursts that feel like sunlight refracting through a prism's edge. The warmth comes from translucent card surfaces (white at 90% opacity) floating on a #F8F8F8 canvas with backdrop-blur, creating frosted-glass depth without hard shadows. ABC Oracle at weight 300 for display text (72px, 54px) is the defining typographic gesture — impossibly thin letterforms with tight -0.04em tracking create an airy authority, like text etched into glass. The single rainbow gradient (pink → red → amber → lavender → blue) appears as a chromatic accent strip and ambient background glow, making what is otherwise a monochrome system feel alive. Buttons default to #D9D9D9 — deliberately muted, never demanding attention, letting the content hierarchy stay centered on the typography.

## Colors

| Name | Value | Role |
|------|-------|------|
| Ink Black | `#000000` | Primary text, headings, nav links, borders, icon fills — the sole chromatic anchor in an otherwise gray system |
| Snow | `#ffffff` | Card backgrounds (at 90% opacity), base fills, overlay surfaces |
| Canvas | `#f8f8f8` | Page background (--background token), the overall canvas beneath frosted cards |
| Fog | `#efefef` | Header background, subtle section dividers |
| Pebble | `#d9d9d9` | Filled button backgrounds ("Download Dia") — neutral gray buttons avoid competing with content; a deliberate anti-CTA that says 'ready when you are' |
| Graphite | `#636363` | Body text, secondary copy, subheadings beneath display type |
| Slate | `#959595` | Tertiary text, nav labels, metadata captions |
| Steel | `#aeaeae` | Disabled states, carousel indicator dots, icon strokes |
| Ash | `#7c7c7c` | Subtle borders, secondary body text |
| Spectrum Gradient | `linear-gradient(90deg, rgb(198, 121, 196) 0%, rgb(250, 61, 29) 25%, rgb(255, 176, 5) 50%, rgb(225, 225, 254) 75%, rgb(3, 88, 247) 100%)` | The signature chromatic moment — ambient hero glow and decorative accent strip; this gradient IS the brand color, appearing where a logo mark would in other systems; Gradient stop — the red accent, available as --red token for error or emphasis states |
| Rose Quartz | `#c679c4` | Gradient stop — pink/mauve tone at the warm edge of the spectrum |
| Marigold | `#ffb005` | Gradient stop — warm amber center of the spectrum, available as --yellow token |
| Signal Blue | `#0358f7` | Gradient stop — the cool end of the spectrum, available as --blue token for links or informational highlights |
| Hot Pink | `#fd02f5` | Available as --pink token for highlight or playful accent contexts |

## Typography

### ABC Oracle — The sole typeface across the entire system — display headlines at weight 300 (72px, 54px), body at 400 (16px, 18px), nav/buttons at 500 (14px, 16px). Weight 300 for display is the signature: most browser/SaaS sites use 600+ for headlines, but Dia goes featherweight, making large type feel like ink drying on paper rather than commands carved in stone. The tight -0.04em tracking at display sizes compresses the airy letterforms just enough to hold together at scale.
- **Substitute:** GT Super Display (weight 300) or DM Sans (lighter weights) for structure; for closer match, Instrument Serif light or Reckless Neue light
- **Weights:** 300, 400, 500
- **Sizes:** 10px, 14px, 16px, 18px, 22px, 50px, 54px, 72px
- **Line height:** 1.11–1.50
- **Letter spacing:** -0.04em at display sizes (50-72px), -0.02em at heading sizes (22px), normal at body (14-18px)
- **OpenType features:** `none detected`

### Type Scale

| Role | Size | Line Height | Letter Spacing |
|------|------|-------------|----------------|
| caption | 10px | 1.5 | — |
| body-sm | 14px | 1.5 | — |
| body | 16px | 1.5 | — |
| subheading | 18px | 1.33 | — |
| heading-sm | 22px | 1.25 | -0.44px |
| heading | 50px | 1.18 | -2px |
| heading-lg | 54px | 1.17 | -2.16px |
| display | 72px | 1.11 | -2.88px |

## Spacing & Layout

**Base unit:** 8px

**Density:** spacious

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 32px
- **Element gap:** 15-20px

### Border Radius

- **cards:** 30px
- **images:** 10px
- **buttons:** 30px
- **navItems:** 16px
- **containers:** 40px
- **pillButtons:** 9999px

## Components

### Frosted Content Card
**Role:** Primary content container for feature descriptions, testimonials, and product showcases

Background rgba(255,255,255,0.9) with backdrop-filter: blur(24px). Border-radius 30px. Padding 32px all sides. Box-shadow rgba(0,0,0,0.08) 0px 0px 8px 0px. No visible border. Text inside uses #000000 headings at weight 400/500 and #636363 body text.

### Neutral Filled Button
**Role:** Primary download/action button ("Download Dia")

Background #D9D9D9, text color rgba(0,0,0,0.85), border-radius 30px, font 14-16px ABC Oracle weight 500. Hover transitions to --get-dia-button-hover (#000000 background with white text). No visible border. Padding inline — content-sized.

### Ghost Pill Button
**Role:** Secondary actions and navigation toggles

Background transparent, text rgba(0,0,0,0.85), border-radius 9999px. Relies on text and hover state for interactivity. Used for category tabs (Write, Learning, Planning) and secondary links.

### Soft Fill Button
**Role:** Announcement banner and contextual actions

Background rgba(0,0,0,0.04), text rgba(0,0,0,0.85), border-radius 16px, horizontal padding 24px. Used for the header announcement bar ('Start your mornings right, with Dia reports').

### Sticky Header Bar
**Role:** Fixed navigation with frosted glass effect

Background #EFEFEF (--header-background) with backdrop-filter: blur(24px). Contains Dia logo left, nav links center, and Download Dia button right. Nav links at 14px weight 400 #000000. Border-radius likely 16-20px for the banner pill nested inside.

### Testimonial Card
**Role:** User quote display in horizontal carousel

Same frosted card base (rgba(255,255,255,0.9), 30px radius, 32px padding, 8px shadow). Contains quote text at 14-16px weight 400 #000000, user avatar (circular, ~40px), name at weight 500, and role at #959595 caption weight.

### Product Screenshot Showcase
**Role:** Feature demonstration with ambient gradient background

Full-width section with the spectrum gradient bleeding softly behind a contained browser mockup screenshot. Screenshots have 10px border-radius. The gradient appears as a warm ambient glow at ~30% opacity beneath the screenshot frame, creating depth.

### Category Tab Carousel
**Role:** Horizontal dot pagination and content category switcher

Row of oval navigation dots in #AEAEAE (inactive) and #000000 (active). Below the "Dia is for" heading. Active category text appears as heading-sm (22px) with italic emphasis. Transition uses 0.2s ease.

### Video Thumbnail Button
**Role:** Watch the trailer CTA overlay

Circular avatar/thumbnail preview (~48px) with adjacent text label "Watch the trailer" at 14px weight 400. Positioned fixed bottom-left. No background fill — floats over content.

### Footer Navigation Grid
**Role:** Multi-column link grid in footer

Columns with headers (Product, Company, etc.) at 14px weight 500 #000000. Links at 14px weight 400 #636363. Column gap ~20px, row gap ~10px. No decorative borders or dividers.

### Privacy Section
**Role:** Trust/privacy messaging block

Centered layout with lock icon (black, ~24px), display heading at 50-54px weight 300 #000000 with -0.04em tracking. Body text at 16px #636363. Inline link in body uses underline with text-decoration-color transition.

### Inline Text Link
**Role:** Contextual links within body copy

Color #000000, text-decoration underline. Hover transitions text-decoration-color over 0.2s ease. No color change on hover — underline emphasis only. Used for 'Learn more about privacy in Dia' and similar.

## Do's and Don'ts

### Do
- Use the spectrum gradient (pink → red → amber → lavender → blue) ONLY as ambient background glow or decorative strip — never as text color or button fill
- Keep buttons neutral gray (#D9D9D9) or transparent; the system deliberately avoids chromatic CTAs to keep focus on content
- Apply 30px border-radius consistently to cards and filled buttons; use 9999px pill radius only for ghost/tab buttons
- Use ABC Oracle weight 300 for all display text (50px+) with -0.04em letter-spacing; weight 500 only for buttons and labels ≤16px
- Apply backdrop-filter: blur(24px) with rgba(255,255,255,0.9) for any elevated surface to maintain the frosted-glass layering
- Maintain the rgba(0,0,0,0.08) 0px 0px 8px 0px shadow on all floating cards — this is the only shadow in the system
- Use #636363 for body text and #959595 for tertiary/metadata text against the #F8F8F8 canvas

### Don't
- Never use saturated colors (--red, --blue, --pink, --yellow) as solid backgrounds or button fills — they exist only within the gradient and as design tokens for rare micro-accents
- Never use border-radius less than 10px on any element; the system has no sharp corners
- Never use font weights above 500 — there is no bold (600/700/800) anywhere in this system
- Never add drop shadows beyond the single 8px blur shadow; avoid layered or colored shadows
- Never place dark backgrounds behind content sections; the system is exclusively light with the gradient as the only warm/dark element
- Never use underlined links with color changes — links stay #000000 and only animate underline opacity on hover
- Never introduce a second typeface; the entire system runs on a single family at three weights

## Elevation

- **Content Card:** `rgba(0, 0, 0, 0.08) 0px 0px 8px 0px`

## Surfaces

- **Canvas** (`#f8f8f8`) — Page-level background, the lightest layer
- **Header** (`#efefef`) — Sticky header bar with backdrop-blur(24px), semi-transparent
- **Card** (`#ffffff`) — Primary content cards at rgba(255,255,255,0.9) — frosted glass over gradient backgrounds
- **Button Fill** (`#d9d9d9`) — Filled button surfaces, slightly recessed against white cards

## Imagery

Product screenshots dominate — browser UI mockups (Gmail compose, Substack editor) shown at realistic scale with 10px rounded corners, floating over warm ambient gradient glows. No stock photography for hero/feature sections. The only photography is small circular avatar crops (~40px) for testimonial cards. The spectrum gradient functions as the primary decorative visual — a horizontal chromatic band (pink → red → amber → lavender → blue) that bleeds into soft ambient light behind screenshot showcases. This gradient replaces traditional hero imagery; it's atmospheric rather than illustrative. Icon style is minimal monochrome: a small lock icon for privacy, the Dia diamond logo mark. The system is text-dominant — imagery serves as proof (screenshots) or mood (gradient glow), never as decoration for its own sake.

## Layout

Max-width ~1200px centered content on #F8F8F8 canvas. Hero is centered single-column: subtitle at 18px, display headline at 72px weight 300, neutral button, then a floating product UI mockup with gradient glow beneath. Sticky frosted header (~52px tall) with logo left, nav center, CTA right. Sections flow vertically with generous 80-120px gaps. Feature sections use centered stacks: heading → carousel dots → subheading → full-width screenshot showcase. Testimonial section is a horizontal scrolling card carousel (5+ cards visible, edge-bleed). Privacy section returns to simple centered text stack. Footer is a multi-column link grid. No alternating background bands — the entire page stays on the same canvas color, with depth created by frosted card surfaces and gradient glows rather than section color changes.

## Similar Brands

- **Arc Browser** — Same parent company, shares the spectrum gradient DNA and single-font lightweight typography approach, though Arc's site uses more color saturation
- **Linear** — Single typeface at ultralight weights for headlines, monochrome UI with one accent gradient, frosted-glass card surfaces
- **Raycast** — AI tool with predominantly monochrome palette, product screenshot-driven feature sections, pill-radius buttons, and ambient gradient accents
- **Notion** — Near-achromatic design system where gray buttons intentionally refuse to shout, letting content hierarchy emerge from typography weight alone
- **Perplexity** — AI product with light canvas, neutral-fill action buttons, single sans-serif typeface, and restrained color usage concentrated in small accent moments
