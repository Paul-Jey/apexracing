/** Behaviour for each screen. Everything here attaches to markup the build
 *  already rendered, so the page still reads fine without any of it. */

import { $, $$, gsap, ScrollTrigger, reduced, toast } from './core';
import { copyLink } from './hud';
import { lanes } from '../content/site';
import galleryRaw from '../content/gallery.json';

type Shot = { slug: string; tag: string; alt: string; w: number; h: number };
const gallery = galleryRaw as Shot[];

export function initScreens() {
  reveal();
  careerRail();
  funFactCard();
  replayStories();
  garageExplorer();
  partnerSetup();
  photoMode();
  telemetryPanels();
}

/* ---------------------------------------------------------------- reveal */

function reveal() {
  if (reduced) return;

  $$('.bubble, .cslot, .dept, .lead, .quote, .shopitem, .lane, .everyone li, .pcard, .social')
    .filter((el) => !el.closest('.hero'))
    .forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 22,
        duration: 0.55,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 92%' },
      });
    });

  // hero cards boot in one after another
  gsap.from($$('.hero .hcard'), {
    opacity: 0,
    y: 16,
    duration: 0.5,
    stagger: 0.07,
    ease: 'power2.out',
    delay: 0.15,
  });
}

/* ---------------------------------------------------------------- career */

function careerRail() {
  const viewport = $('#career-viewport');
  const rail = $('#career-rail');
  if (!viewport || !rail) return;

  const swipe = reduced || window.matchMedia('(hover: none)').matches || window.innerWidth < 900;

  if (swipe) {
    viewport.style.overflowX = 'auto';
    viewport.style.scrollSnapType = 'x mandatory';
    $$('.cslot, .flip', rail).forEach((c) => (c.style.scrollSnapAlign = 'start'));
  } else {
    const dist = () => Math.max(0, rail.scrollWidth - viewport.clientWidth);
    gsap.to(rail, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: {
        trigger: viewport,
        start: 'top 18%',
        end: () => '+=' + dist(),
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
  }

  // arrow keys nudge the rail on either layout
  viewport.tabIndex = 0;
  viewport.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const step = e.key === 'ArrowRight' ? 340 : -340;
    if (swipe) viewport.scrollBy({ left: step, behavior: 'smooth' });
    else window.scrollBy({ top: step, behavior: 'smooth' });
  });
}

function funFactCard() {
  const card = $('#funfact');
  card?.addEventListener('click', () => {
    const on = card.getAttribute('aria-pressed') === 'true';
    card.setAttribute('aria-pressed', on ? 'false' : 'true');
  });
}

/* ---------------------------------------------------------------- replay */

function replayStories() {
  const frame = $('#replay-frame');
  if (!frame) return;

  const cards = $$('.rcard', frame);
  const bars = $$('.replay__bar', frame);
  const prev = $('#replay-prev') as HTMLButtonElement | null;
  const next = $('#replay-next') as HTMLButtonElement | null;
  const count = $('#replay-count');
  let i = 0;

  const show = (n: number) => {
    i = Math.max(0, Math.min(cards.length - 1, n));
    cards.forEach((c, k) => {
      c.classList.toggle('on', k === i);
      if (k === i) c.removeAttribute('aria-hidden');
      else c.setAttribute('aria-hidden', 'true');
    });
    bars.forEach((b, k) => b.classList.toggle('done', k <= i));
    if (count) {
      count.textContent = `${String(i + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
    }
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === cards.length - 1;
  };

  prev?.addEventListener('click', () => show(i - 1));
  next?.addEventListener('click', () => show(i + 1));

  frame.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      show(i - 1);
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      show(i + 1);
    }
  });

  // tap the left third to go back, anywhere else to go on, like a story
  frame.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a, button')) return;
    const r = frame.getBoundingClientRect();
    show((e as MouseEvent).clientX - r.left < r.width / 3 ? i - 1 : i + 1);
  });

  $('#replay-share')?.addEventListener('click', copyLink);
  show(0);
}

/* ---------------------------------------------------------------- garage */

function garageExplorer() {
  const stage = $('#garage-stage');
  const panels = $('#garage-panels');
  if (!stage || !panels) return;

  const hotspots = $$('.hotspot', stage);
  const tabs = $$('.parttab[data-part]');
  const cards = $$('.partcard', panels);

  const select = (id: string) => {
    hotspots.forEach((h) => h.classList.toggle('on', h.dataset.part === id));
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.part === id)));
    cards.forEach((c) => (c.hidden = c.dataset.part !== id));
    if (!reduced) {
      const card = cards.find((c) => c.dataset.part === id);
      if (card) gsap.fromTo(card, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
    }
  };

  hotspots.forEach((h) => h.addEventListener('click', () => select(h.dataset.part!)));
  tabs.forEach((t) => t.addEventListener('click', () => select(t.dataset.part!)));

  // arrow keys move between systems once a tab has focus
  tabs.forEach((t, k) =>
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const n = (k + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
      tabs[n].focus();
      select(tabs[n].dataset.part!);
    }),
  );
}

/* --------------------------------------------------------------- partner */

function partnerSetup() {
  const laneBtns = $$('.lane');
  const zones = $$('.livery__zone');
  const gets = $$('.gets');
  const wa = $('#lane-wa') as unknown as HTMLAnchorElement | null;
  const mail = $('#lane-email') as unknown as HTMLAnchorElement | null;
  if (!laneBtns.length) return;

  const titleCase = (s: string) => s.toLowerCase().replace(/(^|\s|&\s)\S/g, (m) => m.toUpperCase());

  const select = (id: string) => {
    const lane = lanes.find((l) => l.id === id) ?? lanes[0];
    laneBtns.forEach((b) => b.setAttribute('aria-selected', String(b.dataset.lane === lane.id)));
    zones.forEach((z) => z.classList.toggle('on', z.dataset.zone === lane.zone));
    gets.forEach((g) => (g.hidden = g.dataset.lane !== lane.id));

    const title = titleCase(lane.name);
    if (wa) {
      wa.href = `${wa.href.split('?')[0]}?text=${encodeURIComponent(
        `Hi Abilash, I would like to talk to Apex Racing about a ${title} partnership.`,
      )}`;
    }
    if (mail) {
      mail.href = `${mail.href.split('?')[0]}?subject=${encodeURIComponent('Partnership: ' + title)}`;
    }
  };

  laneBtns.forEach((b) => b.addEventListener('click', () => select(b.dataset.lane!)));

  // "SPONSOR THIS" in the parts shop jumps here with a lane pre-picked
  $$('[data-lane]:not(.lane)').forEach((el) =>
    el.addEventListener('click', () => {
      const id = el.dataset.lane!;
      if (lanes.some((l) => l.id === id)) window.setTimeout(() => select(id), 60);
    }),
  );

  select(lanes[0].id);
}

/* ---------------------------------------------------------------- photos */

function photoMode() {
  const grid = $('#masonry');
  if (!grid) return;

  const items = $$('li', grid);
  const filters = $$('[data-filter]');
  const countEl = $('#photo-count');

  filters.forEach((f) =>
    f.addEventListener('click', () => {
      const tag = f.dataset.filter!;
      filters.forEach((o) => o.setAttribute('aria-pressed', String(o === f)));
      let shown = 0;
      items.forEach((li) => {
        const on = tag === 'all' || li.dataset.tag === tag;
        li.hidden = !on;
        if (on) shown++;
      });
      if (countEl) countEl.textContent = `${shown} FRAMES`;
    }),
  );

  const box = $('#lightbox');
  const img = $('#lb-img') as unknown as HTMLImageElement | null;
  const cap = $('#lb-cap');
  if (!box || !img) return;

  let i = 0;
  let lastFocus: HTMLElement | null = null;

  const visible = () =>
    items.reduce<number[]>((acc, li, k) => (li.hidden ? acc : (acc.push(k), acc)), []);

  const show = (n: number) => {
    const shot = gallery[n];
    if (!shot) return;
    i = n;
    img.src = `assets/gallery/${shot.slug}-1440.webp`;
    img.alt = shot.alt;
    if (cap) cap.textContent = shot.alt;
  };

  const step = (dir: number) => {
    const list = visible();
    if (!list.length) return;
    const at = list.indexOf(i);
    show(list[(at + dir + list.length) % list.length]);
  };

  const open = (n: number) => {
    lastFocus = document.activeElement as HTMLElement;
    show(n);
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    ($('#lb-close') as HTMLElement | null)?.focus();
  };

  const close = () => {
    box.hidden = true;
    document.body.style.overflow = '';
    lastFocus?.focus();
  };

  $$('.shot', grid).forEach((b) => b.addEventListener('click', () => open(Number(b.dataset.i))));
  $('#lb-close')?.addEventListener('click', close);
  $('#lb-prev')?.addEventListener('click', () => step(-1));
  $('#lb-next')?.addEventListener('click', () => step(1));
  box.addEventListener('click', (e) => {
    if (e.target === box) close();
  });

  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
}

/* ------------------------------------------------------------- telemetry */

function telemetryPanels() {
  const section = $('#telemetry');
  if (!section) return;

  $('#estop')?.addEventListener('click', () => toast('REMOTE STOP ARMED · DEMO ONLY'));

  const track = $('#tele-track') as unknown as HTMLCanvasElement | null;
  const temp = $('#tele-tempchart') as unknown as HTMLCanvasElement | null;
  const amps = $('#tele-ampchart') as unknown as HTMLCanvasElement | null;
  const gcan = $('#tele-g') as unknown as HTMLCanvasElement | null;
  const tempVal = $('#tele-temp');
  const ampVal = $('#tele-amps');

  const tempSeries = Array.from({ length: 48 }, () => 40 + Math.random() * 6);
  const ampSeries = Array.from({ length: 48 }, () => 14 + Math.random() * 12);

  const circuit = (w: number, h: number) => {
    const p = new Path2D();
    p.moveTo(w * 0.1, h * 0.75);
    p.bezierCurveTo(w * 0.02, h * 0.4, w * 0.16, h * 0.12, w * 0.34, h * 0.14);
    p.bezierCurveTo(w * 0.5, h * 0.16, w * 0.46, h * 0.6, w * 0.62, h * 0.58);
    p.bezierCurveTo(w * 0.78, h * 0.56, w * 0.74, h * 0.14, w * 0.9, h * 0.2);
    p.bezierCurveTo(w * 1.0, h * 0.24, w * 0.98, h * 0.8, w * 0.7, h * 0.86);
    p.bezierCurveTo(w * 0.44, h * 0.92, w * 0.2, h * 0.95, w * 0.1, h * 0.75);
    return p;
  };

  const line = (c: HTMLCanvasElement, data: number[], colour: string, lo: number, hi: number) => {
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const w = c.width;
    const h = c.height;
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    data.forEach((v, k) => {
      const x = (k / (data.length - 1)) * w;
      const y = h - ((v - lo) / (hi - lo)) * (h - 6) - 3;
      if (k) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    });
    ctx.strokeStyle = colour;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = colour.replace('rgb(', 'rgba(').replace(')', ', 0.12)');
    ctx.fill();
  };

  let t = 0;
  let running = false;

  const frame = () => {
    t += 0.004;

    if (track) {
      const ctx = track.getContext('2d');
      if (ctx) {
        const w = track.width;
        const h = track.height;
        ctx.clearRect(0, 0, w, h);
        const p = circuit(w, h);
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 12;
        ctx.stroke(p);
        ctx.strokeStyle = 'rgba(46,196,182,0.75)';
        ctx.lineWidth = 2;
        ctx.stroke(p);
        const ang = (t * 2) % 1 * Math.PI * 2;
        ctx.fillStyle = '#ff2d1a';
        ctx.beginPath();
        ctx.arc(w * 0.5 + Math.cos(ang) * w * 0.33, h * 0.5 + Math.sin(ang) * h * 0.3, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (Math.random() < 0.14) {
      tempSeries.push(
        Math.max(36, Math.min(62, tempSeries[tempSeries.length - 1] + (Math.random() - 0.45) * 2)),
      );
      tempSeries.shift();
      ampSeries.push(
        Math.max(6, Math.min(48, ampSeries[ampSeries.length - 1] + (Math.random() - 0.5) * 7)),
      );
      ampSeries.shift();
      if (tempVal) tempVal.textContent = String(Math.round(tempSeries[tempSeries.length - 1]));
      if (ampVal) ampVal.textContent = String(Math.round(ampSeries[ampSeries.length - 1]));
      if (temp) line(temp, tempSeries, 'rgb(217,162,27)', 30, 65);
      if (amps) line(amps, ampSeries, 'rgb(46,196,182)', 0, 50);
    }

    if (gcan) {
      const ctx = gcan.getContext('2d');
      if (ctx) {
        const w = gcan.width;
        const h = gcan.height;
        const cx = w / 2;
        const cy = h / 2;
        const r = Math.min(w, h) / 2 - 6;
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 1;
        [0.34, 0.67, 1].forEach((k) => {
          ctx.beginPath();
          ctx.arc(cx, cy, r * k, 0, Math.PI * 2);
          ctx.stroke();
        });
        ctx.beginPath();
        ctx.moveTo(6, cy);
        ctx.lineTo(w - 6, cy);
        ctx.moveTo(cx, 6);
        ctx.lineTo(cx, h - 6);
        ctx.stroke();
        ctx.fillStyle = '#ff2d1a';
        ctx.beginPath();
        ctx.arc(cx + Math.sin(t * 9) * 0.7 * r, cy + Math.cos(t * 6.5) * 0.55 * r, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (running) requestAnimationFrame(frame);
  };

  if (temp) line(temp, tempSeries, 'rgb(217,162,27)', 30, 65);
  if (amps) line(amps, ampSeries, 'rgb(46,196,182)', 0, 50);

  if (reduced) {
    frame(); // one static frame, then stop
    return;
  }

  ScrollTrigger.create({
    trigger: section,
    start: 'top 85%',
    end: 'bottom 15%',
    onToggle: (self) => {
      const was = running;
      running = self.isActive;
      if (running && !was) requestAnimationFrame(frame);
    },
  });
}
