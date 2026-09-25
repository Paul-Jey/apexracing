/**
 * The kart that drives down the page.
 *
 * A dashed racing line is generated to fit the height of <main>, snaking
 * between the screens. GSAP walks the kart along it on scroll, the kart
 * flashes its brake light when the page stops moving, and it pulls into a
 * pit box at the Partner Setup screen.
 */

import { $, gsap, ScrollTrigger, MotionPathPlugin, reduced } from './core';
import { screens } from '../content/site';

export function initScrollKart() {
  const main = document.querySelector('main') as HTMLElement | null;
  const svg = $('#racing-line') as unknown as SVGSVGElement | null;
  const path = $('#racing-path') as unknown as SVGPathElement | null;
  const kart = $('#scroll-kart');
  if (!main || !svg || !path || !kart) return;

  let tween: gsap.core.Tween | null = null;

  const build = () => {
    const w = main.offsetWidth;
    const h = main.offsetHeight;
    const narrow = w < 860;

    svg.setAttribute('width', String(w));
    svg.setAttribute('height', String(h));
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.removeAttribute('preserveAspectRatio');

    // one waypoint per screen, alternating sides, with a pit box at Partner
    const pts: { x: number; y: number }[] = [];
    screens.forEach((s, i) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      const top = el.offsetTop - main.offsetTop;
      // sit low in each screen so the kart passes under the headings
      const y = top + el.offsetHeight * 0.62;

      let x: number;
      if (narrow) x = w * 0.07;
      else if (s.id === 'partner') x = w * 0.5; // pull into the pit box, dead centre
      else x = i % 2 === 0 ? w * 0.1 : w * 0.9;

      pts.push({ x, y });
    });

    if (pts.length < 2) return;

    // smooth the corners with quadratic curves through the midpoints
    let d = `M ${pts[0].x} ${Math.max(0, pts[0].y - 200)} L ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i];
      const q = pts[i - 1];
      const mx = (p.x + q.x) / 2;
      const my = (p.y + q.y) / 2;
      d += ` Q ${q.x} ${my} ${mx} ${my} T ${p.x} ${p.y}`;
    }
    d += ` L ${pts[pts.length - 1].x} ${h}`;
    path.setAttribute('d', d);

    tween?.scrollTrigger?.kill();
    tween?.kill();
    tween = null;

    if (reduced) return;

    tween = gsap.to(kart, {
      ease: 'none',
      immediateRender: true,
      motionPath: {
        path,
        align: path,
        alignOrigin: [0.5, 0.5],
        autoRotate: 90, // the artwork points up the page
      },
      scrollTrigger: {
        trigger: main,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
      },
    });
  };

  build();

  if (reduced) {
    // no animation: park the kart on the current screen and let it jump
    const place = () => {
      const len = path.getTotalLength();
      if (!len) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const pt = path.getPointAtLength(len * p);
      kart.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
    };
    place();
    window.addEventListener('scroll', place, { passive: true });
  } else {
    // brake light when the scroll stops
    let stop = 0;
    window.addEventListener(
      'scroll',
      () => {
        kart.classList.remove('braking');
        window.clearTimeout(stop);
        stop = window.setTimeout(() => kart.classList.add('braking'), 110);
      },
      { passive: true },
    );
  }

  let resize = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resize);
    resize = window.setTimeout(() => {
      build();
      ScrollTrigger.refresh();
    }, 220);
  });

  // imported for its registration side effect; keep bundlers from dropping it
  void MotionPathPlugin;
}
