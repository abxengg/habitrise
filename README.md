<div align="center">

<img src="public/img/brand/mark-black.png" alt="HabitRise logo" height="72" />

# HabitRise

**Build the system.** The website for the 21-day 6 AM habit challenge.

[Live site](https://abxengg.github.io/habitrise/) · [Edit content](https://app.pagescms.org) · [Releases](https://github.com/abxengg/habitrise/tags)

</div>

---

## About

**HabitRise** is a 21-day live habit challenge run by **Manikandan Rajendran (Mani)**: a PMP-certified delivery
lead, habit coach and Toastmaster. Members show up on Zoom at **6:00 AM IST** every morning, work through the
**S.A.V.E.R.S** routine (Silence, Affirmations, Visualisation, Exercise, Reading, Scribing) and keep each other
accountable in a private Skool community.

This repository is the public website: a fast, static site with every word editable by the client, registrations
that land in a Google Sheet, and payments handed off to Razorpay.

| Page | What it's for |
|---|---|
| `/` | Home: streak-tracker hero, how a morning works, the 21-day program, the Skool community, the founder, member stories, FAQ |
| `/register` | **Join**, with a tab for each program, each a rectangular ticket with a live stub that fills in as you type. **21-Day HabitRise Challenge**: 3-step form (plan → about you → contact), then Razorpay. **Rise & Read 2027**: plan + details. `/register?program=riseread` opens the second tab |
| `/services` | Every way to work with HabitRise, with a "Who is it for?" filter, a numbers row, "How we work together" and an "I'm interested" form shown as a live chat |
| `/rise-and-read` | **Rise & Read 2027**: a 21-day reading-habit challenge starting 1 January 2027 (waitlist landing page with its own prices and a sign-up form) |
| `/about` | The founder's story, background and coaching areas |
| `/privacy`, `/terms` | Privacy Policy and Terms of Use, with a sticky contents list (text in the CMS under ⚖️ Privacy & Terms) |
| `404` | Friendly "page not found" |

**On every page:** the menu marks the page you're on with an amber ✱; the footer shows the live release number (e.g. `v1.0.6`)
and the maker's credit; a newsletter signup styled as a letter (footer), floating Instagram / LinkedIn / WhatsApp buttons,
and on phones an app-style tab bar at the bottom with **Join** in the middle. On phones the tab bar and top header slide away while
you scroll down (and return when you scroll up), and the three contact buttons fold into one small button.

---

## How it all fits together

```
 Client edits in Pages CMS ──Save──▶ GitHub repo (src/content/*.json)
                                              │
 Client presses "Redeploy site" ─────▶ GitHub Actions: build → deploy → release vX.Y.Z
                                              │
                                              ▼
                                   Website (GitHub Pages / habitrise.in)
                                              │
 Visitor submits a form ──────────────▶ Google Apps Script ──▶ Google Sheet row + email
                                              │
 Registration ─────────────────────────▶ Razorpay payment link for the chosen plan
```

---

## Editing the website (Pages CMS)

Every word on the site, including buttons, labels, placeholders, form messages, SEO text and the 404 page, lives in
`src/content/*.json` and is edited in **[Pages CMS](https://app.pagescms.org)**. The editing screens are defined in
[`.pages.yml`](.pages.yml).

### Giving someone access

The Pages CMS GitHub App must be installed on `abxengg/habitrise` once, by the repo owner. Sign in at app.pagescms.org
with the `abxengg` GitHub account, install the app for this repository, and open the project. After that, add editors
in either of these ways:

- **By email (no GitHub account needed):** in Pages CMS, open the project's **Settings → Collaborators** and invite
  their email. They sign in with a link sent to their inbox.
- **By GitHub account:** in the repo's **Settings → Collaborators → Add people**, give them **Write** access. They sign
  in to Pages CMS with GitHub.

Anyone with access can edit everything in the CMS, including prices and payment links. Every save is a commit with
their name on it, so any change can be traced and undone.

### What's in the sidebar

| Section | Contains |
|---|---|
| ⚙️ **Site settings, prices & payment** | Brand, **prices and Razorpay links**, form receiver URL, newsletter, contact and social links, top menu and phone tab bar, footer, SEO defaults, dates, 404 page |
| 🏠 **Home page** | Hero, streak tracker, audience strip, how it works, stats, program, community, founder teaser, stories, FAQ, final call to action |
| 👤 **Founder (Mani)** | Name, role, photo text, quote, bio, credentials, education, story, journey, coaching areas |
| 📖 **Founder page** | Headings and labels for `/about` |
| 🧭 **Services page** | Services and the interest form, including its chat preview |
| 💳 **Pricing & Register page** | The ticket, form steps, plan cards, live ticket stub and every form label and message |
| 📚 **Rise & Read page** | Everything on `/rise-and-read`: hero and reading card, problem, steps, what you get, who it's for, plans and prices, coach, FAQ, sign-up form |

### Placeholders

Text can include placeholders that fill in automatically, so a price only ever changes in one place:

| Placeholder | Becomes |
|---|---|
| `{studentPrice}` `{othersPrice}` `{originalPrice}` | Prices from Site settings, e.g. ₹399 |
| `{currency}` | ₹ |
| `{nextMonday}` | The next cohort date (the coming Monday), e.g. "Monday, 23 Nov" |
| `{year}` | The current year |

### Publishing: press "Redeploy site"

**Saving does not publish.** Edits pile up safely until someone presses **Redeploy site** (Pages CMS sidebar →
**Actions**), then everything saved so far goes live in about a minute. If a build fails, the previous version stays
live.

Every deploy is a **release**:

1. The site is built and deployed to GitHub Pages.
2. `package.json` moves to the next patch version (1.0.5 → 1.0.6 …), committed as **"Release vX.Y.Z"**.
3. That commit is tagged `vX.Y.Z`. The tag message says who deployed and lists every change it published.

A Redeploy with nothing new publishes again without creating a version. Developers can also run the
**Deploy to GitHub Pages** workflow from the repo's **Actions** tab. Pushing code does **not** deploy by itself. For a
bigger version jump (`v1.1.0`, `v2.0.0`), push that tag by hand; the count continues from there.

Workflow: [`.github/workflows/pages.yml`](.github/workflows/pages.yml).

---

## Forms → Google Sheet + email

The **Register**, **Interest** (services), **Rise & Read** sign-up and **Newsletter** forms post to a Google Apps Script web app,
[`scripts/google-apps-script/Code.gs`](scripts/google-apps-script/Code.gs). For every submission it:

1. **saves a row first**, in the **Registrations**, **Interest**, **Rise & Read** or **Newsletter** tab, so nothing is ever lost;
2. **emails** `NOTIFY_EMAIL`. Reply-to is the visitor's email, and the sender name is "HabitRise Website";
3. writes **`sent`** or **`failed: <reason>`** in the row's **Email status** column.

Tabs and bold headers are created automatically on the first submission. The script also blocks spam bots with a
hidden field and stops spreadsheet-formula injection.

**Status:** connected. The receiver URL is set in *Site settings → Forms → Form receiver URL*.

> **Rise & Read sign-ups:** to give them their own **Rise & Read** tab, paste the latest `Code.gs` into the Apps
> Script editor and deploy a **New version** (see "Good to know" below). Until then, sign-ups are still saved, in
> the **Interest** tab with the service "Rise & Read 2027" and "I am a: …" in the message column, so none are lost.

### Setting it up again, or for a new Sheet

Full steps are in [`scripts/google-apps-script/SETUP.md`](scripts/google-apps-script/SETUP.md). In short:

1. In the Google Sheet: **Extensions → Apps Script**, paste `Code.gs`, set `NOTIFY_EMAIL`, then **Save**. The script
   must be created from inside the Sheet, because it writes to the Sheet it's attached to.
2. **Deploy → New deployment → Web app**, with **Execute as: Me** and **Who has access: Anyone**. Copy the `/exec` URL.
3. Paste the URL into the CMS (*Site settings → Forms*), Save, and press **Redeploy site**.

### Good to know

- **After any change to `Code.gs`** (for example a new `NOTIFY_EMAIL`), go to **Deploy → Manage deployments → ✏️ →
  Version: New version → Deploy**. Saving in the editor alone doesn't change the live script. The URL stays the same.
- **Emails are sent from the Google account that deployed the script.** To send from a domain address, deploy from
  that Google Workspace account, or add the address as a Gmail "Send mail as" alias and switch to `GmailApp` with `from:`.
- **Daily limit:** about 100 emails a day on free Gmail, or 1,500 on Google Workspace. Past that, rows still save and the
  status column shows the reason.
- **Health check:** opening the `/exec` URL in a browser should return `{"ok":true,"service":"HabitRise form receiver"}`.
- **No email?** Check Spam first, then whether the latest version was deployed, then the row's Email status column.

---

## Prices & payment (Razorpay)

Set in *Site settings → Prices & payment links*:

| Plan | Price | Who |
|---|---|---|
| Students | ₹399 | School and college students. They must enter their college or school, and only see student occupations |
| Professionals | ₹699 | Working professionals, entrepreneurs, career switchers and others |
| Regular (struck through) | ~~₹999~~ | Shown as the early-bird comparison |

Prices appear **only on `/register`** (and Rise & Read's own plans on `/rise-and-read`); the rest of the site and the share image have none. After the form is saved,
the visitor gets a "Seat reserved" stamp and is sent to the **Razorpay payment link for their plan**. Until a link is
pasted, they see "we'll send your payment link on WhatsApp" instead.

---

## SEO

- Per-page title and description from each page's **SEO** block in the CMS, with defaults in Site settings → SEO.
- Canonical URLs, `en-IN`, Open Graph and Twitter cards, and a price-free 1200×630 share image (`public/og-image.png`).
  Re-render it with `node scripts/og/render.mjs`.
- Structured data (JSON-LD): Organization, WebSite, Course with both offers (on `/register`), FAQPage, founder
  ProfilePage, Services, Breadcrumbs.
- `/sitemap.xml`, `/robots.txt`, `/.well-known/security.txt`, web manifest, favicons, a "skip to content" link and a
  custom 404.
- On the GitHub Pages preview the site sits in a sub-folder, where crawlers ignore `robots.txt`. It takes full effect
  once `habitrise.in` points at the site; then submit `https://habitrise.in/sitemap.xml` in Google Search Console.
- No star-rating markup: the 4.9/5 figure has no verifiable review data behind it.

---

## Design

- **Brand:** the stair "H" mark (`public/img/brand/`: `mark-black.png` on light, `mark-white.png` on dark), amber
  `#f8af3c`, ink `#121212`, the HABITRISE wordmark in **Anton**, body text in **Manrope**, tagline "Build the system".
- **Motion:** one smooth easing curve throughout. Sections fade up as you scroll, numbers count up, an amber progress
  bar runs along the top, the hero streak tracker fills day by day, and buttons, cards and fields ease on hover and
  focus. All of it is switched off for visitors who ask their device for reduced motion, and pages are fully readable
  without JavaScript.
- **Responsive:** checked at every width from 320 px to 1440 px. Phones get the bottom tab bar; tablets get centred,
  stacked sections; laptops keep two columns.
- Other design directions shown to the client are kept on the branches `design-b-sunrise`, `design-c-midnight`,
  `redesign-dawn`, `redesign-founder`, `redesign-minimal` and `redesign-streak`.

---

## For developers

**Stack:** [Astro](https://astro.build) (static output), plain CSS, a little TypeScript; Node 22 (see `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/ (targets https://habitrise.in)
npm run preview    # serve dist/
```

| What | Where |
|---|---|
| All text | `src/content/*.json`. When you add a key, add the field to `.pages.yml` too |
| Loading content, placeholders | `src/lib/content.ts`: `t()` plain text, `rich()` HTML with the live date, `href()` links, `money()` |
| Pages | `src/pages/*.astro` |
| Header, footer, tab bar, logo | `src/components/streak/` |
| Styles | `src/styles/streak.css` |
| Scroll motion | `src/scripts/motion.ts` |
| Form handling (browser) | `src/scripts/forms.ts` |
| Form receiver (Google) | `scripts/google-apps-script/Code.gs`, with [`SETUP.md`](scripts/google-apps-script/SETUP.md) |
| `<head>`, SEO, JSON-LD | `src/layouts/Shell.astro` |
| Sitemap, robots | `src/pages/sitemap.xml.ts`, `src/pages/robots.txt.ts` |
| Share image | `scripts/og/og-image.html`, rendered by `scripts/og/render.mjs` |
| Deploy and release | `.github/workflows/pages.yml` |

**Base path:** GitHub Pages serves the site under `/habitrise/`, so internal links and images go through `u()`
(`src/lib/url.ts`) or `href()`. The workflow sets `SITE_URL=https://abxengg.github.io` and `BASE_PATH=/habitrise`; a
plain build targets `https://habitrise.in` at the root. When the domain goes live, change those two values in the
workflow and set the custom domain in the repo's **Settings → Pages**.

---

## Launch checklist

- [x] Every word editable in Pages CMS; publishing via **Redeploy site** with automatic releases
- [x] Forms connected to the Google Sheet with email notifications
- [ ] Update the Google Apps Script with the latest `Code.gs` and deploy a **New version** (adds the Rise & Read tab)
- [ ] Rise & Read: confirm prices (Free / ₹199 / ₹499), the first book, the vision-board session date and the weekly live-session time
- [ ] Paste both **Razorpay payment links** (Site settings → Prices & payment links), then Redeploy
- [ ] Give the client access to Pages CMS
- [ ] Mani to review the Privacy Policy and Terms (especially cancellations and refunds) in ⚖️ Privacy & Terms
- [ ] Confirm the member stories are from real members (copied from the old site)
- [ ] Replace the placeholder Services copy and the illustrative Skool card and leaderboard with real details
- [ ] Founder to review the story text (👤 Founder in the CMS)
- [ ] Point **habitrise.in** at the site, update the workflow's `SITE_URL` / `BASE_PATH`, and submit the sitemap in
      Google Search Console

---

## Credits

Designed and built by **[ABX](https://theabx.in)**. The maker's mark lives in the footer ("</> Crafted by ABX"), in
[`/humans.txt`](public/humans.txt), in each page's `<meta name="designer">` and source comment, and in the browser console.

---

## Licence

**© 2026 HabitRise. All rights reserved.** This repository is public so the site can be hosted and reviewed. It is
**not** open source: the code, design, text, photos, logo and brand may not be copied, reused or redistributed
without written permission. See [`LICENSE`](LICENSE).

Third-party software keeps its own licence: [Astro](https://github.com/withastro/astro) (MIT) and the fonts
[Manrope](https://fonts.google.com/specimen/Manrope) and [Anton](https://fonts.google.com/specimen/Anton)
(SIL Open Font License), loaded from Google Fonts.
