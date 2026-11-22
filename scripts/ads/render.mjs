// Renders the ads to public/ads/ with headless Chrome. The HabitRise thumbnail is also copied to
// public/og-image.png, the share image for every page (Rise & Read uses its own).
// Usage: node scripts/ads/render.mjs   (set CHROME_PATH to override the Chrome location)
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, '../../public/ads');
mkdirSync(outDir, { recursive: true });
const chrome = process.env.CHROME_PATH ?? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(existsSync);
if (!chrome) throw new Error('Chrome not found — set CHROME_PATH');
for (const ad of ['habitrise', 'rise-and-read']) {
  const page = pathToFileURL(resolve(here, `${ad}.html`)).href;
  for (const [size, w, h] of [['thumb', 1200, 630], ['square', 1080, 1080]]) {
    const out = resolve(outDir, `${ad}-${size}.png`);
    execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', `--window-size=${w},${h}`,
      '--virtual-time-budget=6000', '--allow-file-access-from-files', `--screenshot=${out}`, `${page}?size=${size}`], { stdio: 'ignore' });
    console.log(`wrote ${out}`);
  }
}
copyFileSync(resolve(outDir, 'habitrise-thumb.png'), resolve(here, '../../public/og-image.png'));
console.log('copied habitrise-thumb.png → public/og-image.png');
