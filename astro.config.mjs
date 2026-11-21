// @ts-check
import { defineConfig } from 'astro/config';

// Static output: `npm run build` writes plain HTML/CSS/JS to dist/.
// Defaults target habitrise.in (site root). The GitHub Pages workflow builds with
// SITE_URL=https://abxengg.github.io and BASE_PATH=/habitrise instead.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://habitrise.in',
  base: process.env.BASE_PATH ?? '/',
});
