# Suitcase Archive — unofficial Reverse: 1999 fan site

## Stack
Vite + React + TypeScript, Tailwind CSS v4 (@tailwindcss/vite), Lenis (`lenis/react`), React Router, Motion (`motion/react`), @fontsource packages for self-hosted fonts. No other dependencies unless justified in one sentence. No backend.

## Content architecture
- All site content lives in JSON files in `src/content/` (characters.json, psychubes.json, story.json, events.json, manus.json, teams.json, tiers.json, afflatus.json, legal.json, site.json).
- Types live in `src/types.ts`. A single loader module `src/data/index.ts` imports the JSON, types it, and exports helpers. Components NEVER hardcode content.
- Adding a character, chapter, event, Manus lord, team, etc. must require editing JSON only, not components.
- Images: each content entry has an `image` field (path under `public/images/...` or null). When null, show the placeholder; when set, show the real image. No code changes needed to swap.

## Code rules
- Minimal, readable code. One component per file, named exports, files under ~150 lines.
- Strict TypeScript, no `any`.
- Mobile-first; everything works from 320px to 2560px wide.
- Dark scheme only: `color-scheme: dark`.
- After adding anything, make sure existing pages still render. Run `npm run build` and fix errors before finishing.

## Identity
- Site name is exactly "Suitcase Archive". The browser tab title is ALWAYS exactly "Suitcase Archive" on every route (static `<title>` in index.html; never change it per route; no helmet libraries).
- Custom favicon (SVG suitcase, brass on ink) plus apple-touch-icon and theme-color.

## Design language: "Gaslamp Neobrutalism"
Vibe: London, philosophical/intellectual, retro-futuristic gaslamp fantasy, cinematic and atmospheric.
Structure (neobrutalist): 3px solid borders, hard offset shadows with NO blur (e.g. 6px 6px 0), oversized fluid typography (clamp), sticker-like labels rotated -2 to 2deg, marquee strips, intentionally overlapping elements, visible grid lines. Chaos is decoration only; navigation, cards, filters and text blocks stay predictable and readable.
Atmosphere (cinematic): film grain overlay (inline SVG data-URI, no image files), vignette, fog gradients, letterbox bars on hero, sections labelled like scenes ("SCENE 02 — LONDON, 1966"), mono serial numbers ("No. 0042").
Color tokens (define in Tailwind @theme, never raw hex in components):
- ink #0D0B12 (page bg), soot #16131D (surface), smoke #231E2E (raised)
- parchment #EADFC8 (text), fog #9A92AD (muted text)
- brass #C9A24B (primary accent), oxblood #D8453A (loud pop), verdigris #4FB5A3 (secondary pop)
All text must pass WCAG AA.
Fonts (self-hosted via @fontsource, only used weights): Bodoni Moda (display), Newsreader (body), Space Mono (labels, data, buttons).
Borders parchment or brass; shadows brass or oxblood. Hover = element shifts 4px toward its shadow and the shadow shrinks. Focus-visible = 3px verdigris outline.

## Motion, scroll, accessibility
- Smooth scroll with Lenis via a single provider; disabled under `prefers-reduced-motion`.
- Animate only transform/opacity; respect reduced motion everywhere.
- Semantic HTML, one h1 per page, alt text on images, keyboard navigable, visible focus.

## Performance and SEO
- Images: fixed aspect ratio, width/height set, loading="lazy" (except hero), decoding="async".
- No large backdrop-filter blur, no huge shadows, no video. `content-visibility:auto` on long sections.
- Meta description, Open Graph tags, robots.txt and sitemap.xml in `public/`. The loader must never hide content from crawlers (content stays in the DOM underneath).
- Lighthouse targets (mobile): Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95.

## Legal and content rules
- Footer on every page: "Unofficial fan site. Reverse: 1999 and all related names, characters and assets are property of Bluepoch. Not affiliated with or endorsed by Bluepoch."
- ## Human-made feel
- No decorative eyebrow or kicker text above headings (no "SCENE 02", no "PUBLIC ACCESS TERMINAL", no "FIELD GUIDE · EDITION 3.8", no decorative serial numbers like "No. 0042"). A heading stands alone. Functional labels (chapter labels, years, locations, DRAFT/NEW/Unverified tags) are fine.
- No horizontal scroll at any width or on any hover/focus/animation state. Hover shifts and hard shadows must never enlarge the page.
- Images: placeholders by default. Official game imagery (icons, art) may be added by the site owner, and is always credited to Bluepoch in the footer and the loader.
- Never invent game facts. Use only the seed content given in the prompts, or content added later through CONTENT-GUIDE.md. Unknown fields stay `null` and render as "Unverified". Anything unconfirmed is `draft: true` and shows a "DRAFT" sticker.
- All prose (dossiers, summaries, explainers, reasons) is written in original words. Never copy sentences or distinctive phrasing from the seed notes, wikis, or community sites. The seed notes are facts to restate, not text to reuse. Opinions appear only in fields named `myTake` or `reason`.
- All story content is `spoiler: true`.
- Game version for all content: 3.8 (stored once in `site.json` as `gameVersion`).