# LoveLofi Web

Marketing & landing page for the [LoveLofi](https://lovelofi.app) browser extension — a lo-fi radio player with real-time audio effects.

## Features

- **Interactive Audio Demo** — Try all 12 audio effects live in the browser (no install needed), powered by Web Audio API + inline AudioWorklet processors
- **Preset Showcase** — a curated set of featured presets from the extension
- **Pricing & Plans** — Free, Monthly, Annual, and Lifetime tiers
- **Documentation** — Getting started guide, effects reference, and keyboard shortcuts
- **Theming** — 4 themes with semantic design tokens matching the extension
- **Policy Pages** — Privacy policy, terms of service, and changelog

## Tech Stack

- [SvelteKit](https://kit.svelte.dev) (Svelte 5 with runes)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Cloudflare Pages](https://pages.cloudflare.com) via `@sveltejs/adapter-cloudflare`
- [Lucide](https://lucide.dev) icons

## Development

```sh
pnpm install
pnpm dev
```

## Build

```sh
pnpm build
pnpm preview  # preview production build locally
```

## Cloudflare Email Binding

The uninstall feedback and support forms post to `/api/uninstall-feedback` and `/api/support`
and send mail through a Cloudflare `send_email` binding configured in
[`wrangler.toml`](./wrangler.toml).

Before deploying, make sure:

- Email Routing is enabled for `lovelofi.app`
- `lovelofiapp@gmail.com` is a verified destination address
- `feedback@lovelofi.app` is available as the sender address

## Type Checking

```sh
pnpm check
```
