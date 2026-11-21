# HabitRise website

Marketing site for HabitRise, the 21-day 6 AM habit challenge, built with [Astro](https://astro.build).
It builds to plain static HTML/CSS (about 240 KB in total), so it can be hosted free on most static hosts.

## Run locally

```bash
npm install
npm run dev        # http://localhost:4321
```

## Build

```bash
npm run build      # outputs static site to dist/
npm run preview    # serve dist/ locally
```

## Where to edit things

The live design is "The Habit App" (bright, product-style, with a 21-day streak tracker in the hero).

| What | File |
|---|---|
| Copy, prices, links, testimonials, FAQ, founder story | `src/data/site.ts` |
| Homepage sections and their order | `src/pages/index.astro` |
| Founder page (`/about`) | `src/pages/about.astro` |
| Header, footer, logo lockup | `src/components/streak/Header.astro`, `Footer.astro`, `Brand.astro` |
| Colours, fonts, spacing (tokens at the top) | `src/styles/streak.css` (fonts list in `src/components/streak/fonts.ts`) |
| Page `<head>`: title, meta, favicon | `src/layouts/Shell.astro` |
| Logo files | `public/img/brand/` (`mark-black.png` for light backgrounds, `mark-white.png` for dark; original sheets kept alongside) |
| Other images | `public/img/` |

**Brand:** the HabitRise mark is the stair "H". Its amber is `--sun` (`#f8af3c`) in `streak.css`; keep the mark off amber
backgrounds, where its steps disappear. The HABITRISE wordmark is set in Anton; the tagline is "Build the system".

The other design options the client was shown live on their own branches (`design-b-sunrise`, `design-c-midnight`,
`redesign-dawn`, `redesign-founder`, `redesign-minimal`). The older components in `src/components/*.astro`,
`src/layouts/Base.astro` and `src/styles/global.css` belong to the first design and are not used by the live pages.

## Live preview (GitHub Pages)

Every push to `main` builds and publishes the site to **https://abxengg.github.io/habitrise/** via
`.github/workflows/pages.yml`. That build sets `SITE_URL` and `BASE_PATH=/habitrise`; links and images go through
`u()` in `src/lib/url.ts`, so the same code also works at a domain root. Use `u('/path')` for any new internal link
or image.

## Deploy (all free)

Every host uses the same settings: **build command** `npm run build`, **output directory** `dist`, Node 22.

- **Cloudflare Pages** (recommended: free unlimited bandwidth, fast in India):
  push to GitHub → Cloudflare dashboard → Workers & Pages → Create → Pages → connect repo → framework preset "Astro".
- **Netlify**: push to GitHub → "Add new site" → import repo (Astro is auto-detected).
  Or with no git: `npm run build`, then drag the `dist/` folder onto app.netlify.com/drop.
- **Vercel**: push to GitHub → "Add New Project" → import repo (auto-detected).
- **GitHub Pages**: Settings → Pages → Source "GitHub Actions" → use the official Astro workflow.

Custom domain: point `habitrise.in` at whichever host you pick (each has a "Custom domains" page).
`site` in `astro.config.mjs` is already set to `https://habitrise.in`.

## Before launch

- [ ] Confirm the testimonials in `src/data/site.ts` are from real members (copied from the old site).
- [ ] Replace the illustrative Skool group card and leaderboard in `src/pages/index.astro` with real details or a screenshot, if available.
- [ ] Confirm "Reserve my spot" (`pricing.joinUrl`) still points at the live registration/UPI page.
- [ ] Have the founder review the `/about` story text (`founder.story`, `founder.coaching`) — it was drafted from the old site's copy.
- [ ] Add FAQ answers for refunds, missed sessions and language once the client confirms them.
