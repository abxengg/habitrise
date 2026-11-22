// Content Security Policy for a static site (GitHub Pages can't send security headers, so it goes in a
// <meta> tag). After the build, every inline <script> on each page is hashed and only those exact scripts
// (plus the site's own files) may run. Injected <script> tags, inline event handlers and scripts from
// other sites are blocked, and forms may only send data to the Google Apps Script receiver.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const settings = JSON.parse(readFileSync(new URL('../src/content/settings.json', import.meta.url), 'utf8'));

function receiverOrigins() {
  try { return [new URL(settings.forms.endpoint).origin, 'https://script.googleusercontent.com']; }
  catch { return ['https://script.google.com', 'https://script.googleusercontent.com']; }
}

const htmlFiles = dir => readdirSync(dir, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? htmlFiles(join(dir, e.name)) : e.name.endsWith('.html') ? [join(dir, e.name)] : []);

export default function csp() {
  return {
    name: 'habitrise-csp',
    hooks: {
      'astro:build:done': ({ dir }) => {
        for (const file of htmlFiles(fileURLToPath(dir))) {
          let html = readFileSync(file, 'utf8');
          const hashes = new Set();
          for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
            const attrs = m[1];
            if (/\bsrc=/.test(attrs) || /application\/ld\+json/.test(attrs)) continue; // files are allowed by 'self'; JSON-LD never runs
            hashes.add(`'sha256-${createHash('sha256').update(m[2], 'utf8').digest('base64')}'`);
          }
          const policy = [
            "default-src 'self'",
            `script-src 'self' ${[...hashes].join(' ')}`.trim(),
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data:",
            `connect-src 'self' ${receiverOrigins().join(' ')}`,
            "form-action 'self'",
            "base-uri 'self'",
            "object-src 'none'",
            "manifest-src 'self'",
            'upgrade-insecure-requests',
          ].join('; ');
          html = html.replace(/<meta charset="UTF-8"\s*\/?>/i, m => `${m}<meta http-equiv="Content-Security-Policy" content="${policy}">`);
          writeFileSync(file, html);
        }
      },
    },
  };
}
