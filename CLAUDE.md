# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Marketing/landing site for the LoveLofi browser extension. Hosted on Cloudflare Pages. Includes an interactive audio demo, documentation, pricing, FAQ, and legal pages.

## Tech Stack

- **Framework:** SvelteKit with Cloudflare Pages adapter
- **UI:** Svelte 5 (runes API)
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite`
- **Icons:** lucide-svelte
- **Package manager:** pnpm

## Common Commands

```bash
pnpm dev              # Start dev server
pnpm build            # Production build (Cloudflare Pages)
pnpm preview          # Preview production build locally
pnpm check            # Svelte type checking
```

## Architecture

### Design Token System

The site shares the same semantic theme token system as the browser extension (defined in `src/app.css`). Tokens follow a surface/ink/accent hierarchy with CSS custom properties and `data-theme` attribute switching. Four themes are available on the site: Cafe Nocturne (default light), Cafe Eclipse (dark), Midnight Session (dark), Sakura Study (light).

Theme state is managed via a reactive singleton in `src/lib/theme.svelte.ts` using Svelte 5 runes and `localStorage`.

### Key Modules

| Module | Purpose |
|---|---|
| `src/lib/constants.ts` | Store URLs, pricing plans, FAQ items, features, demo presets |
| `src/lib/theme.svelte.ts` | Theme state (reactive singleton with `$state`) |
| `src/lib/audio-demo.svelte.ts` | Web Audio engine for the interactive landing page demo (Low-Pass + Reverb only) |
| `src/lib/components/Nav.svelte` | Sticky nav with desktop/mobile, theme switcher, store CTA |
| `src/lib/components/Footer.svelte` | Site footer with links |
| `src/lib/components/ThemeSwitcher.svelte` | Theme dropdown |
| `src/lib/components/AudioDemo.svelte` | Interactive audio demo player with preset selector |

### Pages

| Route | Purpose |
|---|---|
| `/` | Landing page — hero, features, audio demo, pricing, FAQ, CTA |
| `/docs` | Documentation — getting started, effects, presets, tab audio, shortcuts, themes, licensing |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/changelog` | Version changelog |

### Relationship to the Extension

This site (`web/`) is the marketing companion to the LoveLofi browser extension (`../ext/`). The design token system (CSS variables, theme names, font families) is ported from the extension's `src/assets/css/global.css`. The interactive audio demo uses the same two free-tier effects (Low-Pass Filter + Reverb) as the extension, implemented as a lightweight standalone Web Audio engine.

### Conventions

- Svelte 5 runes: `$state`, `$derived`, `$effect`, `$props` — no legacy stores
- Reactive singleton pattern: `export function getXState() { return { get prop() { ... } } }`
- Tailwind classes use the semantic tokens: `bg-surface-0`, `text-ink`, `text-accent`, `border-border`, etc.
- Font classes: `font-display` for headings (DM Serif Display), `font-ui` for body (Inter/DM Sans)
- Radius classes: `rounded-card` (12px), `rounded-button` (8px), `rounded-pill` (9999px)
