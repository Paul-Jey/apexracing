/**
 * Layout and link audit. Run against the built site:
 *
 *   npm run build && npm run audit
 *
 * Reports, per breakpoint: horizontal overflow, elements wider than the
 * viewport, headings that land under the fixed HUD, small tap targets,
 * and any link that points nowhere. Writes qc/AUDIT.md.
 */
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DIST = path.join(ROOT, 'dist');
const PORT = 5198;

const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.json': 'application/json',
};

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

const WIDTHS = [
  ['desktop-1440', 1440, 950],
  ['laptop-1280', 1280, 800],
  ['tablet-1024', 1024, 768],
  ['tablet-768', 768, 1024],
  ['phone-390', 390, 844],
];

const SCREENS = ['hero', 'career', 'replay', 'garage', 'telemetry', 'crew', 'partner', 'paddock', 'photos', 'pitwall'];

const browser = await chromium.launch();
const report = [];

for (const [tag, width, height] of WIDTHS) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    isMobile: width < 700,
    hasTouch: width < 700,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));

  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
  await page.keyboard.press('Enter').catch(() => {});
  await page.waitForTimeout(800);

  const findings = await page.evaluate((vw) => {
    const out = { overflowX: 0, wide: [], smallTaps: [], emptyLinks: [], missingAlt: [] };

    out.overflowX = Math.max(0, document.documentElement.scrollWidth - vw);

    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || el.hasAttribute('hidden')) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;

      if (r.right > vw + 1 && !el.closest('.ticker, .racing-line, .hero__word, .career__rail')) {
        out.wide.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} right=${Math.round(r.right)}`);
      }

      if ((el.tagName === 'A' || el.tagName === 'BUTTON') && !el.closest('.ticker')) {
        // some controls draw small but carry a larger invisible hit area
        const hit = el.querySelector('[class*="__hit"]');
        const box = hit ? hit.getBoundingClientRect() : r;
        if (box.height > 0 && box.height < 40 && box.width < 40) {
          out.smallTaps.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} ${Math.round(box.width)}x${Math.round(box.height)}`);
        }
      }

      if (el.tagName === 'IMG' && !el.hasAttribute('alt')) {
        out.missingAlt.push(el.getAttribute('src') || '(no src)');
      }
    }

    for (const a of document.querySelectorAll('a[href]')) {
      const h = a.getAttribute('href');
      if (!h || h === '#') out.emptyLinks.push(a.textContent.trim().slice(0, 40) || '(empty)');
      else if (h.startsWith('#') && h.length > 1 && !document.getElementById(h.slice(1))) {
        out.emptyLinks.push(`${h} -> no such id`);
      }
    }

    return out;
  }, width);

  const hud = await page.evaluate(() => {
    const el = document.querySelector('.hud-top__row');
    return el ? el.getBoundingClientRect().bottom : 0;
  });

  const clashes = [];
  for (const id of SCREENS) {
    await page.evaluate((s) => document.getElementById(s)?.scrollIntoView({ block: 'start', behavior: 'instant' }), id);
    await page.waitForTimeout(220);
    const hit = await page.evaluate(({ s, hudBottom }) => {
      const sec = document.getElementById(s);
      if (!sec) return null;
      const first = sec.querySelector('h1, h2, .screen-num, .hero__strip');
      if (!first) return null;
      const r = first.getBoundingClientRect();
      return r.top < hudBottom && r.bottom > 0
        ? `${s}: heading top=${Math.round(r.top)} under HUD bottom=${Math.round(hudBottom)}`
        : null;
    }, { s: id, hudBottom: hud });
    if (hit) clashes.push(hit);
  }
  findings.hudClash = clashes;
  findings.consoleErrors = errors;

  report.push({ tag, width, findings });
  await ctx.close();
}

await browser.close();
server.close();

let md = '# Layout audit\n\nGenerated by `npm run audit` against `dist/`.\n';
for (const { tag, width, findings: f } of report) {
  md += `\n## ${tag} (${width}px)\n\n`;
  const line = (label, arr) =>
    `- **${label}:** ${arr.length ? '\n' + [...new Set(arr)].slice(0, 12).map((x) => `  - ${x}`).join('\n') : 'none'}\n`;
  md += `- **Horizontal overflow:** ${f.overflowX ? f.overflowX + 'px' : 'none'}\n`;
  md += line('Elements past the right edge', f.wide);
  md += line('Headings under the fixed HUD', f.hudClash);
  md += line('Tap targets under 40px', f.smallTaps);
  md += line('Dead or broken links', f.emptyLinks);
  md += line('Images without alt', f.missingAlt);
  md += line('Console errors', f.consoleErrors);
}

fs.mkdirSync(path.join(ROOT, 'qc'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'qc', 'AUDIT.md'), md);
console.log(md);
