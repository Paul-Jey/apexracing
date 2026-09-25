/**
 * Builds the whole page as a string.
 *
 * vite.config.ts calls renderBody() at build time and drops the result into
 * index.html, so the site ships as real static markup. The TypeScript modules
 * in src/modules only attach behaviour to what is already there.
 */

import * as S from '../content/site';
import galleryRaw from '../content/gallery.json';
import { esc, chip, picture, sparkbars, icon, waLink } from './html';

type Shot = { slug: string; tag: string; alt: string; w: number; h: number };
const gallery = galleryRaw as Shot[];

/** The Razorpay ask, loud. Used inside Partner Setup and on the Pit Wall. */
function fundBand(variant: 'full' | 'compact' = 'full') {
  const f = S.fund;
  const nudges =
    variant === 'full'
      ? `<ul class="fund__nudges">${f.nudges
          .map(
            (n) =>
              `<li><b>${esc(n.amount)}</b><span>${esc(n.buys)}</span></li>`,
          )
          .join('')}</ul>${chip(f.nudgesConfirm)}`
      : '';

  return `<div class="fund fund--${variant}">
  <div class="fund__qr">
    <img src="assets/brand/razorpay-qr.png" alt="QR code that opens the Apex Racing Razorpay fundraising page." width="160" height="160" loading="lazy" decoding="async">
    <span>${esc(f.scan)}</span>
  </div>
  <div class="fund__body">
    <p class="kicker kicker--gold">${esc(f.kicker)}</p>
    <p class="fund__title">${esc(f.title)}</p>
    <p class="fund__lead">${esc(f.lead)}</p>
    ${variant === 'full' ? `<p class="fund__text">${esc(f.body)}</p>` : ''}
    ${nudges}
    <div class="fund__acts">
      <a class="btn btn--primary btn--big" href="${S.links.razorpay}" target="_blank" rel="noopener" data-track="razorpay">${icon(
        'heart',
      )} ${esc(f.cta)}</a>
      <span class="fund__url">rzp.io/rzp/apexracingfundraising</span>
    </div>
  </div>
</div>`;
}

const head = (id: string, title: string, lede?: string) => {
  const sc = S.screens.find((s) => s.id === id)!;
  return `<header class="screen-head">
  <div>
    <p class="screen-num">${sc.num} · ${esc(sc.name)}</p>
    <h2 class="screen-title">${title}</h2>
  </div>
  ${lede ? `<p class="screen-lede">${lede}</p>` : ''}
</header>`;
};

/* ------------------------------------------------------------------ boot */

function boot() {
  return `<div class="boot" id="boot" role="dialog" aria-label="Loading">
  <div class="boot__inner">
    <img class="boot__badge" src="assets/brand/phoenix-badge.png" alt="" width="96" height="96">
    <img class="boot__word" src="assets/brand/wordmark.png" alt="Apex Racing" width="190" height="97">
    <div class="boot__bar"><i></i></div>
    <p class="boot__tip" id="boot-tip"><b>TIP</b><span>${esc(S.boot.tips[0])}</span></p>
    <button class="btn btn--primary boot__start" id="boot-start" type="button">${esc(S.boot.cta)}</button>
    <p class="boot__hint">${esc(S.boot.hint)}</p>
  </div>
</div>`;
}

/** A simple closed circuit for the mini map. */
const TRACK =
  'M10 62 C 6 40, 18 26, 34 26 C 50 26, 52 44, 66 44 C 82 44, 80 16, 96 16 C 112 16, 116 40, 108 54 C 100 68, 74 70, 56 66 C 38 62, 20 74, 10 62 Z';

/** Rough sample points along that path, good enough for corner markers. */
function trackPoint(t: number) {
  const pts = [
    [10, 62],
    [8, 44],
    [22, 27],
    [42, 30],
    [58, 42],
    [76, 40],
    [92, 17],
    [110, 34],
    [104, 60],
    [72, 69],
    [34, 64],
  ];
  const i = Math.min(pts.length - 1, Math.round(t * (pts.length - 1)));
  return { x: pts[i][0], y: pts[i][1] };
}

/* ------------------------------------------------------------------- hud */

function hud() {
  const nav = S.screens
    .filter((s) => s.inNav)
    .map((s) => `<a class="nav-link" href="#${s.id}">${esc(s.short)}</a>`)
    .join('');

  const tick = S.ticker.map((t) => `<span>${esc(t)}</span>`).join('');

  const corners = S.screens
    .map((s, i) => {
      const pos = trackPoint(i / (S.screens.length - 1));
      return `<circle class="corner" data-target="${s.id}" cx="${pos.x}" cy="${pos.y}" r="3.2"><title>${esc(
        s.name,
      )}</title></circle>`;
    })
    .join('');

  return `<div class="ticker" aria-hidden="true"><div class="ticker__track">${tick}${tick}</div></div>

<header class="hud-top">
  <div class="hud-top__row">
    <a class="pill pill--logo" href="#top" aria-label="Apex Racing, back to the top">
      <img src="assets/brand/phoenix-badge.png" alt="" width="30" height="30">
      <span>Apex</span>
    </a>
    <nav class="pill pill--nav" id="pill-nav" aria-label="Screens">${nav}</nav>
    <div class="pill pill--fund">
      <a href="${S.links.razorpay}" target="_blank" rel="noopener" data-track="razorpay">${icon(
        'heart',
      )} <span>FUND THE BUILD</span></a>
    </div>
    <div class="pill pill--box"><a href="#partner" data-track="boxbox">BOX BOX</a></div>
    <div class="pill pill--icon menu-btn">
      <button type="button" id="menu-open" aria-label="Open the pause menu" aria-expanded="false">${icon('menu')}</button>
    </div>
  </div>
</header>

<div class="hud-map" aria-hidden="true">
  <svg class="hud-map__svg" viewBox="0 0 120 80" role="img" aria-label="Track map">
    <path class="track" d="${TRACK}"/>
    <path class="done" id="map-done" d="${TRACK}"/>
    ${corners}
    <circle class="dot" id="map-dot" cx="10" cy="62" r="3.6"/>
  </svg>
  <p class="hud-sector" id="sector">SECTOR <b>01</b> / 10 · MAIN MENU</p>
</div>

<div class="hud-speedo" aria-hidden="true">
  <span class="hud-speedo__n" id="speedo">0</span>
  <span class="hud-speedo__u">km/h</span>
  <span class="hud-speedo__g" id="gear">N</span>
</div>

<div class="pause" id="pause" hidden role="dialog" aria-modal="true" aria-label="Pause menu">
  <div class="pause__head">
    <p class="pause__title">PAUSED</p>
    <div class="pill pill--icon">
      <button type="button" id="menu-close" aria-label="Close the pause menu">${icon('close')}</button>
    </div>
  </div>
  <nav class="pause__list" aria-label="All screens">
    ${S.screens
      .map((s) => `<a class="pause__item" href="#${s.id}"><b>${s.num}</b><span>${esc(s.name)}</span></a>`)
      .join('')}
  </nav>
  <div class="pause__foot">
    <a class="btn btn--primary" href="#partner">BOX BOX: PARTNER</a>
    <a class="btn btn--gold" href="${S.links.razorpay}" target="_blank" rel="noopener" data-track="razorpay">RAZORPAY</a>
    <a class="btn btn--ghost" href="${S.links.instagram}" target="_blank" rel="noopener">INSTAGRAM</a>
    <a class="btn btn--ghost" href="${S.links.linkedin}" target="_blank" rel="noopener">LINKEDIN</a>
  </div>
</div>`;
}

/* ------------------------------------------------------------------ hero */

function heroCard(c: any): string {
  if (c.kind === 'results') {
    return `<article class="bubble hcard">
      <p class="bubble__label">${esc(c.label)}</p>
      <div class="hcard__rows">
        ${c.rows
          .map((r: any) => `<p class="hres"><b>${esc(r.pos)}</b><span>${esc(r.event)}</span></p>`)
          .join('')}
      </div>
      ${sparkbars(c.spark)}
    </article>`;
  }

  if (c.kind === 'volts') {
    return `<article class="bubble hcard hcard--volt">
      <p class="bubble__label">${esc(c.label)}</p>
      <p class="hvolt"><b>${esc(c.big)}</b><i>${esc(c.unit)}</i><span>${esc(c.name)}</span></p>
      ${c.rows
        .map(
          (r: any) =>
            `<div class="hspec"><span class="hspec__k">${esc(r.k)}</span><span class="hspec__v hspec__v--sm">${esc(
              r.v,
            )}</span></div>`,
        )
        .join('')}
      <span class="arc" aria-hidden="true"></span>
    </article>`;
  }

  if (c.kind === 'specs') {
    return `<article class="bubble hcard">
      <p class="bubble__label">${esc(c.label)}</p>
      ${c.rows
        .map(
          (r: any) => `<div class="hspec">
            <span class="hspec__k">${esc(r.k)}</span>
            <span><span class="hspec__v">${esc(r.v)}</span> <span class="hspec__u">${esc(r.u)}</span></span>
          </div>`,
        )
        .join('')}
      ${sparkbars(c.spark, true)}
    </article>`;
  }

  if (c.kind === 'awards') {
    return `<article class="bubble hcard">
      <p class="bubble__label">${esc(c.label)}${chip(c.confirm)}</p>
      ${c.items.map((i: string) => `<p class="hcard__award">${esc(i)}</p>`).join('')}
      <p class="hcard__note">${esc(c.note)}</p>
    </article>`;
  }

  // roadmap
  return `<article class="bubble hcard">
    <p class="bubble__label">${esc(c.label)}${chip(c.confirm)}</p>
    <div class="hroad">
      <div class="hroad__track">
        ${c.stops
          .map(
            (s: any) =>
              `<div class="hroad__stop" data-state="${s.state}"><i class="hroad__dot"></i><span>${esc(
                s.name,
              )}</span></div>`,
          )
          .join('')}
      </div>
      <p class="hroad__here">YOU ARE HERE</p>
    </div>
  </article>`;
}

function hero() {
  const h = S.hero;
  return `<section class="screen hero" id="hero">
  <div class="hero__stage" aria-hidden="true"></div>

  <div class="wrap hero__inner">
    <div class="hero__strip">
      <span>${esc(h.eyebrowLeft)}</span>
      <span class="hero__strip-r">${esc(h.eyebrowRight)}</span>
    </div>

    <div class="hero__display">
      <p class="hero__word" aria-hidden="true">${h.word
        .map((w) => `<span>${esc(w)}</span>`)
        .join('')}</p>
      <div class="hero__kart" id="hero-kart">
        <img src="assets/kart/hero-kart-760.webp"
             srcset="assets/kart/hero-kart-480.webp 480w, assets/kart/hero-kart-760.webp 760w, assets/kart/hero-kart-1040.webp 1040w"
             sizes="(max-width: 720px) 80vw, (max-width: 1080px) 58vw, 42vw"
             alt="${esc(h.kartAlt)}" width="760" height="760" fetchpriority="high" decoding="async">
      </div>
    </div>

    <div class="hero__say">
      <h1 class="hero__title">${h.headline.map((l) => `<span>${esc(l)}</span>`).join('')}</h1>
      <p class="hero__sub">${esc(h.sub)}</p>
      <div class="hero__ctas">
        <a class="btn btn--primary" href="${h.primary.href}" data-track="boxbox">${esc(
          h.primary.label,
        )}</a>
        <a class="btn btn--gold" href="${h.tertiary.href}" target="_blank" rel="noopener" data-track="razorpay">${icon(
          'heart',
        )} ${esc(h.tertiary.label)}</a>
        <a class="btn btn--ghost" href="${h.secondary.href}">${esc(h.secondary.label)}</a>
      </div>
      <p class="hero__fundnote">${esc(h.fundNote)}</p>
    </div>

    <div class="hero__cards">${h.cards.map(heroCard).join('')}</div>
  </div>
</section>`;
}

/* ---------------------------------------------------------------- career */

function career() {
  const slots = S.career
    .map((s) => {
      if (s.locked) {
        return `<article class="cslot cslot--locked">
        <p class="cslot__slot"><b>${esc(s.slot)}</b><span>${esc(s.year)}</span></p>
        <h3 class="cslot__title">${esc(s.title)}${chip(s.confirm)}</h3>
        <p class="cslot__tag">${esc(s.tag)}</p>
        <p class="cslot__body">${esc(s.body)}</p>
        <a class="cslot__lock" href="#partner">${icon('lock')}${esc(s.lockNote ?? '')}</a>
      </article>`;
      }
      const shot = gallery.find((g) => g.slug === s.photo);
      return `<article class="cslot">
      <div class="cslot__media">${
        shot ? picture(shot.slug, shot.alt, { sizes: '(max-width: 720px) 80vw, 320px' }) : ''
      }</div>
      <p class="cslot__slot"><b>${esc(s.slot)}</b><span>${esc(s.year)}</span></p>
      <h3 class="cslot__title">${esc(s.title)}${chip(s.confirm)}</h3>
      <p class="cslot__tag">${esc(s.tag)}</p>
      <p class="cslot__body">${esc(s.body)}</p>
      ${
        s.stats
          ? `<div class="cslot__stats">${s.stats
              .map((t) => `<div class="cstat"><b>${esc(t.v)}</b><span>${esc(t.k)}</span></div>`)
              .join('')}</div>`
          : ''
      }
    </article>`;
    })
    .join('');

  const flip = `<button class="flip" id="funfact" type="button" aria-pressed="false" aria-label="Flip the fun fact card">
  <span class="flip__inner">
    <span class="flip__face flip__face--front">
      <b>${esc(S.funFact.front)}</b>
      <small>TAP TO FLIP</small>
    </span>
    <span class="flip__face flip__face--back">
      <b>${esc(S.funFact.backTitle)}</b>
      <p>${esc(S.funFact.back)}</p>
    </span>
  </span>
</button>`;

  return `<section class="screen" id="career">
  <div class="wrap">
    ${head(
      'career',
      'FROM PETROL<br><em>TO POWER.</em>',
      'We started in combustion. We switched to electric in 2025 and took P1 in acceleration in our first EV season.',
    )}
  </div>
  <div class="career__viewport" id="career-viewport">
    <div class="career__rail wrap" id="career-rail">${slots}${flip}</div>
  </div>
  <div class="wrap">
    <p class="rail-hint"><kbd>&larr;</kbd><kbd>&rarr;</kbd> to browse, or just keep scrolling</p>
    <div class="screen-cta">
      <a class="btn btn--ghost" href="#replay">VIEW REPLAY</a>
      <a class="btn btn--gold" href="${S.links.razorpay}" target="_blank" rel="noopener" data-track="razorpay">${icon(
        'heart',
      )} FUND THE BUILD</a>
    </div>
  </div>
</section>`;
}

/* ---------------------------------------------------------------- replay */

function replay() {
  const cards = S.replay
    .map((c, i) => {
      const shot = gallery.find((g) => g.slug === c.photo);
      return `<article class="rcard${i === 0 ? ' on' : ''}" data-i="${i}"${
        i === 0 ? '' : ' aria-hidden="true"'
      }>
      ${shot ? picture(shot.slug, '', { sizes: '100vw', cls: 'rcard__bg' }) : ''}
      <p class="kicker kicker--red">${esc(c.kicker)}${chip(c.confirm)}</p>
      ${c.big ? `<p class="rcard__big">${esc(c.big)}</p>` : ''}
      <h3 class="rcard__title">${esc(c.title)}</h3>
      <p class="rcard__body">${esc(c.body)}</p>
      ${
        c.cta
          ? `<div class="screen-cta" style="margin-top:8px">
              <a class="btn btn--primary" href="${c.cta.href}" data-track="boxbox">${esc(c.cta.label)}</a>
              <button class="btn btn--ghost" type="button" id="replay-share">${icon('share')} SHARE</button>
            </div>`
          : ''
      }
    </article>`;
    })
    .join('');

  const bars = S.replay
    .map((_, i) => `<div class="replay__bar${i === 0 ? ' done' : ''}" data-i="${i}"><i></i></div>`)
    .join('');

  return `<section class="screen replay" id="replay">
  <div class="wrap">
    ${head(
      'replay',
      'THE <em>SEASON</em><br>IN SIX CARDS.',
      'FKDC 2025, Season 9, at Kari Motor Speedway. Arrow keys, or tap the sides.',
    )}
    <div class="replay__frame" id="replay-frame" tabindex="0" role="group" aria-label="Season replay, six cards">
      <div class="replay__bars">${bars}</div>
      ${cards}
      <div class="replay__nav">
        <button class="rnav" type="button" id="replay-prev" aria-label="Previous card" disabled>${icon('left')}</button>
        <span class="replay__count" id="replay-count">01 / ${String(S.replay.length).padStart(2, '0')}</span>
        <button class="rnav" type="button" id="replay-next" aria-label="Next card">${icon('right')}</button>
      </div>
    </div>
    <div class="screen-cta">
      <a class="btn btn--primary" href="#partner" data-track="boxbox">BACK THE NEXT RACE</a>
      <a class="btn btn--gold" href="${S.links.razorpay}" target="_blank" rel="noopener" data-track="razorpay">${icon(
        'heart',
      )} FUND THE BUILD</a>
      <a class="btn btn--ghost" href="#garage">ENTER GARAGE</a>
    </div>
  </div>
</section>`;
}

/* ---------------------------------------------------------------- garage */

function garage() {
  const hotspots = S.garageParts
    .map(
      (p, i) =>
        `<button class="hotspot${i === 0 ? ' on' : ''}" type="button" data-part="${p.id}"
        style="left:${p.x}%;top:${p.y}%" aria-label="${esc(p.name)}, ${esc(p.label)}">
        <span class="hotspot__hit"></span>
        <span class="hotspot__tip">${esc(p.name.toUpperCase())}</span>
      </button>`,
    )
    .join('');

  const tabs = S.garageParts
    .map(
      (p, i) =>
        `<button class="parttab" type="button" role="tab" data-part="${p.id}" aria-selected="${
          i === 0
        }">${esc(p.name)}</button>`,
    )
    .join('');

  const panels = S.garageParts
    .map(
      (p, i) => `<div class="partcard" data-part="${p.id}"${i === 0 ? '' : ' hidden'}>
      <div class="partcard__head">
        <h3 class="partcard__name">${esc(p.name)}</h3>
        <p class="partcard__label">${esc(p.label)}</p>
      </div>
      <p class="partcard__plain">${esc(p.plain)}</p>
      <dl class="partcard__specs">
        ${p.specs.map((s) => `<div><dt>${esc(s.k)}</dt><dd>${esc(s.v)}</dd></div>`).join('')}
      </dl>
    </div>`,
    )
    .join('');

  const shop = S.partsShop.items
    .map(
      (it) => `<div class="shopitem">
      <p class="shopitem__name">${esc(it.name)}</p>
      <p class="shopitem__cost">${esc(it.cost)}</p>
      <a class="btn btn--sm btn--gold" href="#partner" data-lane="${it.lane}" data-track="sponsor-part">SPONSOR THIS</a>
    </div>`,
    )
    .join('');

  return `<section class="screen" id="garage">
  <div class="wrap">
    ${head(
      'garage',
      'OPEN IT UP.<br><em>EVERY PART.</em>',
      'Pick anything on the kart and we will tell you what it is, what it does, and what it cost.',
    )}
    <div class="garage__layout">
      <div class="garage__stage" id="garage-stage">
        <img src="assets/kart/kart-iso.png" alt="Isometric CAD render of the Apex Racing kart chassis, showing the frame, battery box, axles and steering." width="1320" height="834" loading="lazy" decoding="async">
        ${hotspots}
      </div>
      <div class="garage__panel">
        <div class="parttabs" role="tablist" aria-label="Kart systems">${tabs}</div>
        <div id="garage-panels">${panels}</div>
      </div>
    </div>

    <div class="shop">
      <div class="shop__head">
        <div>
          <p class="kicker kicker--gold">PARTS SHOP${chip(S.partsShop.confirm)}</p>
          <p class="screen-lede" style="margin-top:4px">${esc(S.partsShop.note)}</p>
        </div>
        <p class="shop__total">${esc(S.partsShop.total)}</p>
      </div>
      <div class="shop__grid">${shop}</div>
    </div>

    <div class="screen-cta">
      <a class="btn btn--primary" href="#partner" data-track="boxbox">SEE WHERE FUNDING GOES</a>
      <a class="btn btn--gold" href="${S.links.razorpay}" target="_blank" rel="noopener" data-track="razorpay">${icon(
        'heart',
      )} FUND THE BUILD</a>
      <a class="btn btn--ghost" href="#telemetry">OPEN TELEMETRY</a>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------- telemetry */

function telemetryScreen() {
  const hw = S.telemetry.hardware
    .map((h) => `<div><dt>${esc(h.k)}</dt><dd>${esc(h.v)}</dd></div>`)
    .join('');

  return `<section class="screen tele" id="telemetry">
  <div class="wrap">
    ${head('telemetry', 'THE KART<br><em>TALKS BACK.</em>', esc(S.telemetry.caption))}
    <p class="tele__demo">DEMO DATA · NOT A LIVE FEED</p>
    <div class="tele__grid" style="margin-top:14px">
      <div class="bubble tele__wide">
        <p class="bubble__label">GPS TRACE · RTK</p>
        <canvas id="tele-track" width="720" height="300" role="img" aria-label="Animated demo of a GPS trace lapping a circuit outline"></canvas>
      </div>
      <div class="bubble">
        <p class="bubble__label">MOTOR TEMP</p>
        <p class="tele__val"><span id="tele-temp">42</span><small>&deg;C</small></p>
        <canvas id="tele-tempchart" width="320" height="90" aria-hidden="true"></canvas>
      </div>
      <div class="bubble">
        <p class="bubble__label">BATTERY CURRENT</p>
        <p class="tele__val"><span id="tele-amps">18</span><small>A</small></p>
        <canvas id="tele-ampchart" width="320" height="90" aria-hidden="true"></canvas>
      </div>
      <div class="bubble">
        <p class="bubble__label">G FORCE · IMU</p>
        <canvas id="tele-g" width="220" height="220" role="img" aria-label="Demo of lateral and longitudinal g force"></canvas>
      </div>
      <div class="bubble">
        <p class="bubble__label">HARDWARE</p>
        <dl class="hwlist">${hw}</dl>
      </div>
      <div class="bubble">
        <p class="bubble__label">SAFETY</p>
        <button class="estop" type="button" id="estop"><b>STOP</b><span>REMOTE KILL</span></button>
      </div>
    </div>
    <div class="screen-cta">
      <a class="btn btn--primary" href="#partner" data-lane="powertrain" data-track="boxbox">${esc(
        S.telemetry.cta.label,
      )}</a>
      <a class="btn btn--gold" href="${S.links.razorpay}" target="_blank" rel="noopener" data-track="razorpay">${icon(
        'heart',
      )} FUND THE BUILD</a>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ crew */

const DEPT_ICON: Record<string, string> = {
  powertrain: 'bolt',
  chassis: 'frame',
  steering: 'wheel',
  management: 'clipboard',
};

function crew() {
  const bg = gallery.find((g) => g.slug === 'team-lineup');

  const depts = S.departments
    .map(
      (d) => `<article class="dept">
      ${icon(DEPT_ICON[d.id] ?? 'bolt', 'dept__icon')}
      <h3 class="dept__name">${esc(d.name)}</h3>
      <p class="dept__line">${esc(d.line)}</p>
      <p class="dept__stat">${esc(d.stat)}</p>
    </article>`,
    )
    .join('');

  const leads = S.contacts
    .map(
      (c) => `<article class="lead">
      <p class="lead__name">${esc(c.name)}</p>
      <p class="lead__role">${esc(c.role)}</p>
      <div class="lead__acts">
        <a class="btn btn--sm btn--ghost" href="tel:${c.tel}" data-track="call">${icon('phone')} CALL</a>
        <a class="btn btn--sm btn--ghost" href="${waLink(
          c.whatsapp,
          `Hi ${c.name.split(' ')[0]}, I found Apex Racing online and I would like to talk about supporting the team.`,
        )}" target="_blank" rel="noopener" data-track="whatsapp">${icon('chat')} WHATSAPP</a>
      </div>
    </article>`,
    )
    .join('');

  const qs = S.quotes
    .map(
      (q) => `<blockquote class="quote">
      <p>${esc(q.text)}${chip(q.confirm)}</p>
      <footer>${esc(q.name)} · ${esc(q.role)}</footer>
    </blockquote>`,
    )
    .join('');

  return `<section class="screen crew" id="crew">
  ${bg ? picture(bg.slug, '', { sizes: '100vw', cls: 'crew__bg' }) : ''}
  <div class="wrap">
    ${head(
      'crew',
      'FOUR DEPARTMENTS.<br><em>ONE KART.</em>',
      'Everything on this kart was specified, sourced, cut, welded, wired or negotiated by a student in one of these four groups.',
    )}
    <div class="crew__grid">${depts}</div>
    <div class="leads">${leads}</div>
    <div class="quotes">${qs}</div>
    <div class="screen-cta">
      <a class="btn btn--primary" href="#partner" data-track="boxbox">PARTNER WITH THE TEAM</a>
      <a class="btn btn--gold" href="${S.links.razorpay}" target="_blank" rel="noopener" data-track="razorpay">${icon(
        'heart',
      )} FUND THE BUILD</a>
    </div>
  </div>
</section>`;
}

/* --------------------------------------------------------------- partner */

const ZONES: Record<string, { style: string; label: string }> = {
  nose: { style: 'left:72%;top:52%;width:15%;height:16%', label: 'NOSE' },
  pod: { style: 'left:40%;top:40%;width:20%;height:18%', label: 'SIDE POD' },
  rear: { style: 'left:12%;top:36%;width:20%;height:20%', label: 'REAR' },
  shirt: { style: 'left:46%;top:12%;width:20%;height:15%', label: 'TEAM SHIRTS' },
  report: { style: 'left:14%;top:10%;width:24%;height:15%', label: 'REPORTS' },
};

function partner() {
  const laneBtns = S.lanes
    .map(
      (l, i) => `<button class="lane" type="button" role="tab" data-lane="${l.id}" data-zone="${
        l.zone
      }" aria-selected="${i === 0}">
      <span class="lane__name">${esc(l.name)}</span>
      <span class="lane__builds">${esc(l.builds)}</span>
      <span class="lane__spot">${esc(l.spot)}</span>
    </button>`,
    )
    .join('');

  const zones = Object.entries(ZONES)
    .map(
      ([k, z]) =>
        `<span class="livery__zone${k === S.lanes[0].zone ? ' on' : ''}" data-zone="${k}" style="${
          z.style
        }">${esc(z.label)}</span>`,
    )
    .join('');

  const gets = S.lanes
    .map(
      (l, i) => `<ul class="gets" data-lane="${l.id}"${i === 0 ? '' : ' hidden'}>
      ${l.gets.map((g) => `<li>${esc(g)}</li>`).join('')}
    </ul>`,
    )
    .join('');

  const c = S.partnershipContact;
  const mail = S.links.email
    ? `<a class="btn btn--ghost" id="lane-email" href="mailto:${S.links.email}?subject=Partnership%3A%20Front%20Row%20Partner" data-track="email">EMAIL US</a>`
    : '';

  return `<section class="screen partner" id="partner">
  <div class="wrap">
    ${head('partner', 'PICK WHAT<br>YOU WANT <em>TO BUILD.</em>')}
    <p class="partner__intro">${esc(S.partnerIntro.body)}</p>

    <div class="setup">
      <div class="step">
        <p class="step__num">STEP 01 · CHOOSE A LANE</p>
        <div class="lanes" role="tablist" aria-label="Partnership lanes">${laneBtns}</div>
        <div class="inkind">
          <b>${esc(S.partnerIntro.inKind.label)}</b>
          <p>${esc(S.partnerIntro.inKind.body)}</p>
        </div>
      </div>

      <div class="step">
        <p class="step__num">STEP 02 · WHERE YOUR NAME GOES</p>
        <div class="livery" id="livery">
          <img src="assets/kart/kart-side.png" alt="Side view CAD render of the Apex Racing kart, used to show where a partner logo is placed." width="1400" height="694" loading="lazy" decoding="async">
          ${zones}
        </div>

        <p class="step__num">STEP 03 · WHAT YOU GET</p>
        <div id="lane-gets">${gets}</div>

        <p class="step__num">STEP 04 · START THE CONVERSATION</p>
        <p class="screen-lede">${esc(S.partnerIntro.noPrices)}</p>
        <div class="acts">
          <a class="btn btn--primary" href="tel:${c.tel}" data-track="call">${icon('phone')} CALL ${esc(
            c.name.split(' ')[0].toUpperCase(),
          )}</a>
          <a class="btn btn--ghost" id="lane-wa" href="${waLink(
            c.whatsapp,
            'Hi Abilash, I would like to talk to Apex Racing about a Front Row Partner partnership.',
          )}" target="_blank" rel="noopener" data-track="whatsapp">${icon('chat')} WHATSAPP US</a>
          ${mail}
        </div>
      </div>
    </div>

    <p class="kicker kicker--gold" style="margin-top:28px">EVERY PARTNER GETS${chip(
      S.partnerIntro.everyoneConfirm,
    )}</p>
    <ul class="everyone">${S.partnerIntro.everyone.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>
    <p class="smallprint">${esc(S.partnerIntro.smallprint)}</p>

    ${fundBand('full')}
  </div>
</section>`;
}

/* --------------------------------------------------------------- paddock */

/** Where each sticker sits on the side-view kart, as percentages. */
const STICKERS = [
  { l: 8, t: 46, w: 15, h: 11 },
  { l: 25, t: 40, w: 13, h: 10 },
  { l: 40, t: 56, w: 14, h: 10 },
  { l: 56, t: 42, w: 13, h: 10 },
  { l: 70, t: 55, w: 14, h: 10 },
  { l: 14, t: 66, w: 13, h: 9 },
  { l: 44, t: 24, w: 12, h: 9 },
  { l: 62, t: 70, w: 13, h: 9 },
];

function paddock() {
  const stickers = S.pastPartners
    .map((p, i) => {
      const s = STICKERS[i % STICKERS.length];
      return `<span class="sticker" style="left:${s.l}%;top:${s.t}%;width:${s.w}%;height:${s.h}%" tabindex="0">
      <img src="assets/partners/${p.slug}.webp" alt="${esc(p.name)} logo" loading="lazy" decoding="async">
      <span class="sticker__name">${esc(p.name)}</span>
    </span>`;
    })
    .join('');

  const open = `<a class="sticker sticker--open" href="#partner" style="left:80%;top:30%;width:13%;height:10%" data-track="boxbox">${esc(
    S.paddock.emptySpot,
  )}</a>`;

  const wall =
    S.pastPartners
      .map(
        (p) =>
          `<li><img src="assets/partners/${p.slug}.webp" alt="${esc(
            p.name,
          )} logo" width="180" height="54" loading="lazy" decoding="async"></li>`,
      )
      .join('') +
    `<li class="open"><a href="#partner" data-track="boxbox">${esc(S.paddock.emptySpot)}</a></li>`;

  return `<section class="screen" id="paddock">
  <div class="wrap">
    ${head('paddock', 'THEY PUT US<br><em>ON THE GRID.</em>')}
    <p class="paddock__line">${esc(S.paddock.line)}</p>
    <div class="paddock__board">
      <img class="kart" src="assets/kart/kart-side.png" alt="Side view of the kart with previous partner logos applied like sponsor decals." width="1400" height="694" loading="lazy" decoding="async">
      ${stickers}${open}
    </div>
    <ul class="logowall">${wall}</ul>
    <div class="screen-cta">
      <a class="btn btn--primary" href="#partner" data-track="boxbox">JOIN THE GRID</a>
      <a class="btn btn--gold" href="${S.links.razorpay}" target="_blank" rel="noopener" data-track="razorpay">${icon(
        'heart',
      )} FUND THE BUILD</a>
    </div>
  </div>
</section>`;
}

/* ---------------------------------------------------------------- photos */

function photos() {
  const filters = S.photoFilters
    .map(
      (f, i) =>
        `<button class="parttab" type="button" data-filter="${f.id}" aria-pressed="${i === 0}">${esc(
          f.label,
        )}</button>`,
    )
    .join('');

  const items = gallery
    .map(
      (g, i) => `<li data-tag="${g.tag}">
      <button class="shot" type="button" data-i="${i}" aria-label="Open photo: ${esc(g.alt)}">
        ${picture(g.slug, g.alt, { sizes: '(max-width: 720px) 48vw, 23vw' })}
        <span class="shot__tag">${esc(g.tag.toUpperCase())}</span>
      </button>
    </li>`,
    )
    .join('');

  return `<section class="screen" id="photos">
  <div class="wrap">
    ${head('photos', 'PHOTO <em>MODE.</em>', 'Every one of these was taken by someone on the team.')}
    <div class="photos__bar">
      ${filters}
      <span class="photos__count" id="photo-count">${gallery.length} FRAMES</span>
    </div>
    <ul class="masonry" id="masonry">${items}</ul>
    <div class="screen-cta">
      <a class="btn btn--primary" href="${S.links.instagram}" target="_blank" rel="noopener" data-track="instagram">${icon(
        'insta',
      )} FOLLOW ${esc(S.links.instagramHandle.toUpperCase())}</a>
      <a class="btn btn--gold" href="${S.links.razorpay}" target="_blank" rel="noopener" data-track="razorpay">${icon(
        'heart',
      )} FUND THE BUILD</a>
    </div>
  </div>
</section>

<div class="lightbox" id="lightbox" hidden role="dialog" aria-modal="true" aria-label="Photo viewer">
  <div class="pill pill--icon lightbox__close">
    <button type="button" id="lb-close" aria-label="Close the photo viewer">${icon('close')}</button>
  </div>
  <div class="lightbox__stage"><img id="lb-img" src="" alt=""></div>
  <div class="lightbox__bar">
    <button class="rnav" type="button" id="lb-prev" aria-label="Previous photo">${icon('left')}</button>
    <p class="lightbox__cap" id="lb-cap"></p>
    <button class="rnav" type="button" id="lb-next" aria-label="Next photo">${icon('right')}</button>
  </div>
</div>`;
}

/* -------------------------------------------------------------- pit wall */

function pitwall() {
  const cards = S.contacts
    .map(
      (c) => `<article class="pcard">
      <p class="pcard__name">${esc(c.name)}</p>
      <p class="pcard__role">${esc(c.role)}</p>
      <p class="pcard__phone">${esc(c.phone)}</p>
      <div class="pcard__acts">
        <a class="btn btn--sm btn--primary" href="tel:${c.tel}" data-track="call">${icon('phone')} CALL</a>
        <a class="btn btn--sm btn--ghost" href="${waLink(
          c.whatsapp,
          `Hi ${c.name.split(' ')[0]}, I found Apex Racing online and I would like to talk about supporting the team.`,
        )}" target="_blank" rel="noopener" data-track="whatsapp">${icon('chat')} CHAT</a>
      </div>
    </article>`,
    )
    .join('');

  return `<section class="screen pitwall" id="pitwall">
  <div class="wrap">
    <div class="pitwall__head">
      <p class="screen-num">10 · PIT WALL</p>
      <h2 class="pitwall__title">LET&rsquo;S BUILD<br><em>IT TOGETHER.</em></h2>
      <p class="screen-lede" style="max-width:52ch">${esc(S.pitwall.sub)}</p>
    </div>

    ${fundBand('compact')}

    <p class="kicker" style="margin-top:34px">OR TALK TO A PERSON</p>
    <div class="pitwall__grid" style="margin-top:12px">${cards}</div>

    <div class="socials">
      <a class="social" href="${S.links.instagram}" target="_blank" rel="noopener" data-track="instagram">
        ${icon('insta')}
        <span><b>Instagram</b><span>${esc(S.links.instagramHandle)}</span></span>
      </a>
      <a class="social" href="${S.links.linkedin}" target="_blank" rel="noopener" data-track="linkedin">
        ${icon('linkedin')}
        <span><b>LinkedIn</b><span>APEX RACING TEAM</span></span>
      </a>
    </div>

    <div class="finish" id="finish-line" aria-hidden="true"></div>

    <footer class="foot">
      <img src="assets/brand/ssn.png" alt="SSN College of Engineering">
      <span>${esc(S.team.name)} · ${esc(S.team.college)} · ${esc(S.team.city)}</span>
      <span class="foot__spacer"></span>
      <span>SEASON ${esc(S.meta.season)}</span>
      <span>${esc(S.pitwall.credits)}</span>
    </footer>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ all */

export function renderBody(): string {
  return `<a class="skip" href="#hero">Skip to content</a>
${boot()}
${hud()}
<main id="top">
  <div class="track-layer" id="track-layer" aria-hidden="true">
    <svg class="racing-line" id="racing-line" preserveAspectRatio="none"><path id="racing-path" d=""/></svg>
    <div class="scroll-kart" id="scroll-kart">
      <img src="assets/kart/kart-top.png" alt="" width="62" height="102">
      <span class="scroll-kart__brake"></span>
    </div>
  </div>
${hero()}
${career()}
${replay()}
${garage()}
${telemetryScreen()}
${crew()}
${partner()}
${paddock()}
${photos()}
${pitwall()}
</main>
<div class="grain" aria-hidden="true"></div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>`;
}
