// @ts-check
import { defineConfig } from 'astro/config';

// Static output: `npm run build` writes plain HTML/CSS/JS to dist/,
// which deploys as-is to Cloudflare Pages, Netlify, Vercel or GitHub Pages.
export default defineConfig({
  site: 'https://habitrise.in',
});
