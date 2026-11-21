// /robots.txt — allow everything public and point to the sitemap.
import type { APIRoute } from 'astro';
import { u } from '../lib/url';

export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${new URL(u('/sitemap.xml'), site).href}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
