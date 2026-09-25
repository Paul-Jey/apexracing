/**
 * Small string helpers shared by the section renderers.
 * These run at build time (vite.config.ts) as well as in the browser,
 * so nothing in here may touch the DOM.
 */

export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Review marker. Hidden unless the page is opened with ?draft=1. */
export const chip = (on?: boolean, note = 'CONFIRM') =>
  on ? `<span class="confirm-chip">${esc(note)}</span>` : '';

/** Responsive <img> for anything built by tools/build_assets.py. */
export function picture(
  slug: string,
  alt: string,
  opts: { dir?: string; widths?: number[]; sizes?: string; eager?: boolean; cls?: string } = {},
) {
  const dir = opts.dir ?? 'gallery';
  const widths = opts.widths ?? [420, 860, 1440];
  const srcset = widths.map((w) => `assets/${dir}/${slug}-${w}.webp ${w}w`).join(', ');
  const fallback = `assets/${dir}/${slug}-${widths[Math.min(1, widths.length - 1)]}.webp`;
  return `<img src="${fallback}" srcset="${srcset}" sizes="${opts.sizes ?? '(max-width: 720px) 50vw, 25vw'}"
    alt="${esc(alt)}" loading="${opts.eager ? 'eager' : 'lazy'}" decoding="async"${
      opts.cls ? ` class="${opts.cls}"` : ''
    }>`;
}

export const sparkbars = (vals: number[], gold = false) =>
  `<div class="spark${gold ? ' spark--gold' : ''}" aria-hidden="true">${vals
    .map((v) => `<i style="height:${Math.max(8, Math.min(100, v))}%"></i>`)
    .join('')}</div>`;

const PATHS: Record<string, string> = {
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  left: 'M15 5l-7 7 7 7',
  right: 'M9 5l7 7-7 7',
  lock: 'M7 11V8a5 5 0 0110 0v3M5 11h14v10H5z',
  sound: 'M4 9v6h4l5 4V5L8 9H4z',
  phone: 'M5 4h4l2 5-3 2a12 12 0 005 5l2-3 5 2v4a1 1 0 01-1 1A17 17 0 014 5a1 1 0 011-1z',
  chat: 'M21 12a8 8 0 01-11.6 7.1L4 21l1.9-5.4A8 8 0 1121 12z',
  insta: 'M4 8a4 4 0 014-4h8a4 4 0 014 4v8a4 4 0 01-4 4H8a4 4 0 01-4-4zM12 9a3 3 0 100 6 3 3 0 000-6zM17 7h.01',
  linkedin: 'M6 9v10M6 5v.01M11 19v-6a3 3 0 016 0v6M11 9v10',
  heart: 'M12 20l-7-7a4.2 4.2 0 016-6l1 1 1-1a4.2 4.2 0 016 6z',
  bolt: 'M13 3L5 14h6l-1 7 8-11h-6z',
  frame: 'M4 7h16v11H4zM8 7V4h8v3',
  wheel: 'M12 3a9 9 0 100 18 9 9 0 000-18zm0 5a4 4 0 100 8 4 4 0 000-8zM12 3v5M5 17l4-3M19 17l-4-3',
  clipboard: 'M9 4h6v3H9zM7 6H5v14h14V6h-2',
  camera: 'M4 8h3l2-2h6l2 2h3v11H4zM12 16a3.5 3.5 0 100-7 3.5 3.5 0 000 7z',
  share: 'M8 12a2 2 0 11-4 0 2 2 0 014 0zM20 6a2 2 0 11-4 0 2 2 0 014 0zM20 18a2 2 0 11-4 0 2 2 0 014 0zM8.7 11L16 7M8.7 13L16 17',
};

export const icon = (name: string, cls = '') =>
  `<svg viewBox="0 0 24 24" aria-hidden="true"${cls ? ` class="${cls}"` : ''}><path d="${
    PATHS[name] ?? ''
  }" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export const waLink = (number: string, text: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
