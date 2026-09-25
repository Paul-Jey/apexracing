/** Shared plumbing: smooth scroll, motion preference, toasts, tiny analytics. */

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export { gsap, ScrollTrigger, MotionPathPlugin };

export const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector(sel) as T | null;

export const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll(sel)) as T[];

export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isTouch = window.matchMedia('(hover: none)').matches;

/** Smooth scroll, off for reduced motion and for touch where it fights the OS. */
export function initScroll() {
  if (reduced || isTouch) return null;

  const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // hash links should go through Lenis so the HUD stays in sync
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
    if (!a) return;
    const id = a.getAttribute('href')!.slice(1);
    const el = id ? document.getElementById(id) : null;
    if (!el) return;
    e.preventDefault();
    lenis.scrollTo(el, { offset: -70 });
    history.replaceState(null, '', '#' + id);
  });

  return lenis;
}

let toastTimer = 0;

export function toast(message: string) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('on');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove('on'), 2600);
}

/**
 * Click tracking. Nothing is sent anywhere yet: a privacy friendly script
 * (Plausible or GoatCounter) can be dropped into index.html and this will
 * feed it. Until then the events are only logged with ?draft=1.
 */
type Counter = (name: string, props?: Record<string, string>) => void;

declare global {
  interface Window {
    plausible?: Counter;
    goatcounter?: { count: (o: { path: string; title: string; event: boolean }) => void };
  }
}

export function initTracking(draft: boolean) {
  document.addEventListener('click', (e) => {
    const el = (e.target as HTMLElement).closest('[data-track]') as HTMLElement | null;
    if (!el) return;
    const name = el.dataset.track!;
    window.plausible?.(name);
    window.goatcounter?.count({ path: name, title: name, event: true });
    if (draft) console.info('[track]', name);
  });
}
