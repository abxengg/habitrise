# HabitRise website

Website for HabitRise, the 21-day 6 AM habit challenge, built with [Astro](https://astro.build) as a plain static site.
Live preview: **https://abxengg.github.io/habitrise/**

| Page | What it is |
|---|---|
| `/` | Home: hero streak tracker, how it works, the program, community, founder, stories, FAQ (no prices) |
| `/register` | **Pricing & Registration** — the only page with prices: the early-bird ticket, plan cards and the form → Google Sheet → Razorpay link |
| `/services` | Services (placeholder copy for now) + "I'm interested" form |
| `/about` | Founder story |

## Content Management for HabitRise (no code needed)

**Every word on the site lives in `src/content/*.json`** and is edited in [Pages CMS](https://app.pagescms.org),
configured by [`.pages.yml`](.pages.yml). Saving in the CMS commits to this repo; the GitHub Actions workflow rebuilds
the site and it is live in about a minute.

1. **Give the client access (once).** They need a free GitHub account. Add it to the repo
   (*Settings → Collaborators → Add people*, role **Write**), then have them open <https://app.pagescms.org>,
   **Sign in with GitHub**, install the Pages CMS app on `abxengg/habitrise` when asked, and pick the repo.
2. **Edit.** The sidebar lists: ⚙️ Site settings, prices & payment · 🏠 Home page · 👤 Founder · 📖 Founder page ·
   🧭 Services page · 💳 Pricing & Register page. The newsletter signup (bottom of every page) is under Site settings. Change any field → **Save**.
3. **It goes live by itself.** Each save rebuilds the site; it's live in about a minute. If a build fails, the
   previous version stays live.

Text can use placeholders that fill in automatically, so prices only ever change in one place:
`{currency}` `{studentPrice}` `{othersPrice}` `{originalPrice}` `{year}` `{nextMonday}` (the next cohort date).

### Prices and payment (Razorpay)

*Site settings → Prices & payment links*: Students and Everyone-else prices, the struck-through regular price, and a
**Razorpay payment link per plan**. After someone submits the registration form, their details are saved and they
are sent to the link for the plan they chose. Until a link is pasted, they see "we'll send your payment link on
WhatsApp" instead.

### Forms → Google Sheet + email

Registration, Interest and Newsletter submissions are saved to a Google Sheet **first** (one tab each), then emailed to the client. The sheet's
**Email status** column shows `sent`, or `failed: <reason>` (the row is kept either way). One-time setup:
[`scripts/google-apps-script/SETUP.md`](scripts/google-apps-script/SETUP.md) — then paste the Web app URL into
*Site settings → Forms → Form receiver URL*. Until then the forms politely point people to WhatsApp.

## Motion

Everything moves smoothly with one easing curve (`--ease-out` in `src/styles/streak.css`): sections and cards fade
up in sequence as you scroll, numbers count up, an amber progress bar tracks the page, the hero streak tracker builds
itself day by day, and buttons, cards and fields ease on hover and focus (`src/scripts/motion.ts`).

The forms each have their own touch:
- **Register** (`/register`, the only page with prices) is one rectangular ticket: a 3-step form (plan → about you →
  contact) on the left and a stub on the right that fills in as people type, then gets a "Seat reserved" stamp.
- **Services interest form** shows the message being written as a chat, which gets a reply when it's sent.
- **Newsletter** (footer, every page) is a letter with an airmail border and stamp that flies off on signup.

All motion is switched off for visitors whose device asks for reduced motion, and pages are fully visible without JS.

## SEO

- Per-page title and description from each page's **SEO** block in the CMS (defaults in Site settings → SEO).
- Canonical URLs, `en-IN`, Open Graph + Twitter cards with a 1200×630 share image (`public/og-image.png`,
  re-render with `node scripts/og/render.mjs`).
- Structured data (JSON-LD): Organization, WebSite, Course with both price offers, FAQPage, founder Person/ProfilePage,
  Services, Breadcrumbs.
- `/sitemap.xml`, `/robots.txt`, `/.well-known/security.txt`, web manifest, favicons, custom 404.
- Note: on the GitHub Pages preview the site is in a sub-folder, where crawlers ignore `robots.txt`; it takes full
  effect once `habitrise.in` points at the site. Submit `https://habitrise.in/sitemap.xml` in Google Search Console then.
- No star ratings are marked up for Google: the 4.9/5 figure has no verifiable review data behind it.

## For developers

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
```

| What | Where |
|---|---|
| All text | `src/content/*.json` (schema for the CMS in `.pages.yml` — add a field there when you add a key) |
| Loading content, placeholders | `src/lib/content.ts` (`t()` plain text, `rich()` HTML with the live date, `href()` links) |
| Pages | `src/pages/*.astro`; header/footer/logo in `src/components/streak/` |
| Styles | `src/styles/streak.css` |
| Form handling | `src/scripts/forms.ts`; receiver in `scripts/google-apps-script/Code.gs` |
| `<head>`, SEO, JSON-LD | `src/layouts/Shell.astro` |
| Logo files | `public/img/brand/` (`mark-black.png` on light, `mark-white.png` on dark; original sheets kept) |

**Brand:** the stair "H" mark; amber `#f8af3c`; HABITRISE wordmark in Anton; tagline "Build the system".

**Base path:** GitHub Pages serves the site under `/habitrise/`, so internal links and images go through `u()`
(`src/lib/url.ts`) or `href()`. The Pages workflow sets `SITE_URL`/`BASE_PATH`; a normal build targets
`https://habitrise.in` at the root.

Other design options shown to the client live on branches `design-b-sunrise`, `design-c-midnight`, `redesign-dawn`,
`redesign-founder`, `redesign-minimal`.

## Before launch

- [ ] Connect the forms (Google Sheet setup above) and paste both Razorpay payment links in the CMS.
- [ ] Add the client's GitHub account to the repo so they can use the CMS.
- [ ] Confirm the testimonials are from real members (copied from the old site).
- [ ] Replace the placeholder Services copy and the illustrative Skool card/leaderboard with real details.
- [ ] Founder to review the story text (Founder in the CMS).
- [ ] Point `habitrise.in` at the site, then submit the sitemap in Google Search Console.
