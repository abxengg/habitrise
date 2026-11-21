// Everything a visitor reads comes from src/content/*.json, which the client edits in
// Pages CMS ("Content Management for HabitRise"). This module loads those files and fills
// the placeholders the copy may use:
//   {currency} {studentPrice} {othersPrice} {originalPrice} {year} {nextMonday}
import settings from '../content/settings.json';
import home from '../content/home.json';
import founder from '../content/founder.json';
import about from '../content/about.json';
import services from '../content/services.json';
import register from '../content/register.json';
import { u } from './url';

export { settings, home, founder, about, services, register };

const p = settings.pricing;
const values: Record<string, string> = {
  currency: p.currencySymbol,
  studentPrice: String(p.student.price),
  othersPrice: String(p.others.price),
  originalPrice: String(p.originalPrice),
  year: String(new Date().getFullYear()),
};

/** Plain text with placeholders filled ({nextMonday} becomes "next Monday"). */
export const t = (s = '') =>
  s.replace(/\{(\w+)\}/g, (m, k) => (k === 'nextMonday' ? 'next Monday' : values[k] ?? m));

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** HTML-safe text with placeholders filled; {nextMonday} becomes a live date the browser fills in. */
export const rich = (s = '') =>
  esc(t(s.replace(/\{nextMonday\}/g, '\u0000'))).replace(/\u0000/g, `<span data-next-monday>${esc(settings.dates.fallbackDay)}</span>`);

/** Internal links ("/about", "/#how") get the base path; external links and #anchors stay as they are. */
export const href = (h = '#') => (h.startsWith('/') ? u(h) : h);

export const initials = (name: string) =>
  name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

/** Avatar colours are part of the design, not the content, so they live here. */
const avatarColors = ['#2d9e5f', '#c08a1a', '#6b5bd2', '#d2555b', '#2f7fb5', '#0d2818'];
export const avatar = (i: number) => avatarColors[i % avatarColors.length];

export const money = (n: number) => `${p.currencySymbol}${n}`;
