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

| What | File |
|---|---|
| Copy, prices, links, testimonials, FAQ | `src/data/site.ts` |
| Page section order | `src/pages/index.astro` |
| Founder story page (`/about`) | `src/pages/about.astro`, text in `founder.story` in `src/data/site.ts` |
| Individual sections | `src/components/*.astro` |
| Colours, fonts, spacing (design tokens at top) | `src/styles/global.css` |
| Small interactions (menu, tabs, count-up, next-cohort date) | `src/scripts/main.js` |
| Images | `public/img/` |

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
- [ ] Replace the community mock in `Community.astro` with a real Skool screenshot, if available.
- [ ] Confirm "Reserve my spot" (`pricing.joinUrl`) still points at the live registration/UPI page.
- [ ] Have the founder review the `/about` story text (`founder.story`, `founder.coaching`) — it was drafted from the old site's copy.
- [ ] Add FAQ answers for refunds, missed sessions and language once the client confirms them.
