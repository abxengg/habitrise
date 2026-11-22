// /sitemap.xml — every public page, with the site's base path (works on habitrise.in and GitHub Pages).
import type { APIRoute } from 'astro';
import { u } from '../lib/url';

const pages = [
  { path: '/', priority: '1.0', freq: 'weekly' },
  { path: '/register', priority: '0.9', freq: 'weekly' },
  { path: '/services', priority: '0.8', freq: 'monthly' },
  { path: '/rise-and-read', priority: '0.9', freq: 'weekly' },
  { path: '/about', priority: '0.7', freq: 'monthly' },
];

export const GET: APIRoute = ({ site }) => {
  const today = new Date().toISOString().slice(0, 10);
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url><loc>${new URL(u(p.path), site).href}</loc><lastmod>${today}</lastmod><changefreq>${p.freq}</changefreq><priority>${p.priority}</priority></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
