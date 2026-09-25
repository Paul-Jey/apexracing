/** Boot screen, pill nav, mini map, speedo and the pause menu. */

import { $, $$, reduced, toast } from './core';
import { boot as bootCopy, screens } from '../content/site';

const SEEN_KEY = 'apex.booted';

/* ------------------------------------------------------------------ boot */

export function initBoot(onDone: () => void) {
  const el = $('#boot');
  if (!el) return onDone();

  let seen = false;
  try {
    seen = sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    // private window, or storage blocked. Show it once and move on.
  }

  if (seen || reduced) {
    el.remove();
    document.body.classList.remove('is-booting');
    onDone();
    return;
  }

  document.body.classList.add('is-booting');

  const tipEl = $('#boot-tip span');
  let i = 0;
  const rotate = window.setInterval(() => {
    i = (i + 1) % bootCopy.tips.length;
    if (tipEl) tipEl.textContent = bootCopy.tips[i];
  }, 1700);

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    window.clearInterval(rotate);
    el.classList.add('is-out');
    document.body.classList.remove('is-booting');
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* nothing to do */
    }
    window.setTimeout(() => el.remove(), 460);
    onDone();
  };

  $('#boot-start')?.addEventListener('click', finish);
  el.addEventListener('click', finish);
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') finish();
    },
    { once: true },
  );

  // never hold anyone up for long
  window.setTimeout(finish, 3200);
  window.setTimeout(() => ($('#boot-start') as HTMLElement | null)?.focus(), 300);
}

/* --------------------------------------------------------------- the HUD */

export function initHud() {
  const sections = screens
    .map((s) => ({ ...s, el: document.getElementById(s.id) }))
    .filter((s): s is typeof s & { el: HTMLElement } => Boolean(s.el));

  const navLinks = $$('#pill-nav .nav-link') as HTMLAnchorElement[];
  const corners = $$<SVGCircleElement>('.hud-map__svg .corner');
  const sectorEl = $('#sector');
  const dot = $('#map-dot') as unknown as SVGCircleElement | null;
  const donePath = $('#map-done') as unknown as SVGPathElement | null;
  const speedoEl = $('#speedo');
  const gearEl = $('#gear');

  const trackLen = donePath?.getTotalLength() ?? 0;
  if (donePath && trackLen) {
    donePath.style.strokeDasharray = String(trackLen);
    donePath.style.strokeDashoffset = String(trackLen);
  }

  corners.forEach((c) =>
    c.addEventListener('click', () => {
      const id = (c as unknown as HTMLElement).dataset.target;
      if (id) document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    }),
  );

  let lastY = window.scrollY;
  let lastT = performance.now();
  let shown = 0;
  let current = '';

  // brighten the HUD while the page is moving, dim it when you stop to read
  let idle = 0;
  window.addEventListener(
    'scroll',
    () => {
      document.body.classList.add('is-scrolling');
      window.clearTimeout(idle);
      idle = window.setTimeout(() => document.body.classList.remove('is-scrolling'), 900);
    },
    { passive: true },
  );

  const frame = () => {
    const y = window.scrollY;
    const now = performance.now();
    const dt = Math.max(16, now - lastT);
    const vel = Math.abs(y - lastY) / dt; // px per ms
    lastY = y;
    lastT = now;

    // scroll velocity, mapped to a toy 0 to 80 km/h readout
    const kmh = Math.min(80, Math.round(vel * 26));
    shown += (kmh - shown) * 0.18;
    const n = Math.round(shown);
    if (speedoEl) speedoEl.textContent = String(n);
    if (gearEl) gearEl.textContent = n === 0 ? 'N' : String(Math.min(6, Math.ceil(n / 14)));

    // progress round the mini map
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
    if (donePath && trackLen) donePath.style.strokeDashoffset = String(trackLen * (1 - p));
    if (dot && donePath && trackLen) {
      const pt = donePath.getPointAtLength(trackLen * p);
      dot.setAttribute('cx', String(pt.x));
      dot.setAttribute('cy', String(pt.y));
    }

    // which screen are we on
    const mid = y + window.innerHeight * 0.4;
    let active = sections[0];
    for (const s of sections) if (s.el.offsetTop <= mid) active = s;

    if (active && active.id !== current) {
      current = active.id;
      if (sectorEl) {
        sectorEl.innerHTML = `SECTOR <b>${active.num}</b> / ${screens.length} · ${active.name}`;
      }
      navLinks.forEach((a) =>
        a.setAttribute('aria-current', a.getAttribute('href') === '#' + active.id ? 'true' : 'false'),
      );
      corners.forEach((c) =>
        c.classList.toggle('on', (c as unknown as HTMLElement).dataset.target === active.id),
      );
    }

    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);

  initPause();
}

/* ------------------------------------------------------------ pause menu */

function initPause() {
  const menu = $('#pause');
  const openBtn = $('#menu-open');
  const closeBtn = $('#menu-close');
  if (!menu) return;

  let lastFocus: HTMLElement | null = null;

  const open = () => {
    lastFocus = document.activeElement as HTMLElement;
    menu.hidden = false;
    document.body.style.overflow = 'hidden';
    openBtn?.setAttribute('aria-expanded', 'true');
    (menu.querySelector('.pause__item') as HTMLElement | null)?.focus();
  };

  const close = () => {
    menu.hidden = true;
    document.body.style.overflow = '';
    openBtn?.setAttribute('aria-expanded', 'false');
    lastFocus?.focus();
  };

  openBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  menu.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const lb = $('#lightbox') as HTMLElement | null;
    if (lb && !lb.hidden) return; // the lightbox owns Escape while it is open
    if (menu.hidden) open();
    else close();
  });

  // keep tab focus inside while it is open
  menu.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || menu.hidden) return;
    const items = $$('a, button', menu).filter((n) => !(n as HTMLButtonElement).disabled);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

/** Used by the replay share button. */
export async function copyLink() {
  try {
    await navigator.clipboard.writeText(location.href.split('#')[0]);
    toast('LINK COPIED');
  } catch {
    toast('COPY FAILED, USE THE ADDRESS BAR');
  }
}
