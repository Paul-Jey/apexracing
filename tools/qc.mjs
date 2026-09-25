/**
 * Screenshots every screen at desktop and phone width into /qc.
 *
 *   npm run build && npm run qc
 *
 * Serves dist/ on a throwaway port so what gets shot is what ships.
 */
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DIST = path.join(ROOT, 'dist');
const OUT = path.join(ROOT, 'qc');
const PORT = 5199;

const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.json': 'application/json',
};

const SCREENS = [
  'hero',
  'career',
  'replay',
  'garage',
  'telemetry',
  'crew',
  'partner',
  'paddock',
  'photos',
  'pitwall',
];

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const file = path.join(DIST, p);
  if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404).end('not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

await new Promise((r) => server.listen(PORT, r));
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

for (const [tag, width, height] of [
  ['1440', 1440, 950],
  ['390', 390, 844],
]) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    isMobile: width < 700,
    hasTouch: width < 700,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(String(e)));

  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
  // skip the boot screen the same way a visitor would
  await page.keyboard.press('Enter').catch(() => {});
  await page.waitForTimeout(900);

  await page.screenshot({ path: path.join(OUT, `${tag}-00-boot-cleared.png`) });

  for (const id of SCREENS) {
    await page.evaluate((sel) => {
      document.getElementById(sel)?.scrollIntoView({ block: 'center', behavior: 'instant' });
    }, id);
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(OUT, `${tag}-${id}.png`) });
  }

  // one tall shot of the whole page
  await page.screenshot({ path: path.join(OUT, `${tag}-full.png`), fullPage: true });

  if (errors.length) {
    console.log(`\n${tag}px console errors:`);
    errors.forEach((e) => console.log('   ', e));
  } else {
    console.log(`${tag}px: no console errors`);
  }
  await ctx.close();
}

await browser.close();
server.close();
console.log('qc screenshots ->', OUT);
