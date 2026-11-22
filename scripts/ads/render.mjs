// Renders the Rise & Read ads to public/ads/ with headless Chrome.
// Usage: node scripts/ads/render.mjs   (set CHROME_PATH to override the Chrome location)
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, '../../public/ads');
mkdirSync(outDir, { recursive: true });
const chrome = process.env.CHROME_PATH ?? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(existsSync);
if (!chrome) throw new Error('Chrome not found — set CHROME_PATH');
const page = pathToFileURL(resolve(here, 'rise-and-read.html')).href;
for (const [size, w, h] of [['thumb', 1200, 630], ['square', 1080, 1080]]) {
  const out = resolve(outDir, `rise-and-read-${size}.png`);
  execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', `--window-size=${w},${h}`,
    '--virtual-time-budget=6000', '--allow-file-access-from-files', `--screenshot=${out}`, `${page}?size=${size}`], { stdio: 'ignore' });
  console.log(`wrote ${out}`);
}
