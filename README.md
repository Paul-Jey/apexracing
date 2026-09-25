# Apex Racing

The official site for Apex Racing, the electric karting team of SSN College of
Engineering, Chennai.

One long page built as a racing sim menu. Static output, no backend.

---

## Put it live

The site is configured for **apexracingssn.vercel.app**. Deploying publishes to
your Vercel account, so you have to sign in yourself. It takes about a minute.

```bash
npx vercel login
```

That opens a browser. Pick the account you want the site under, then:

```bash
npx vercel --prod
```

The first run asks four questions. Answers:

| Question | Answer |
|---|---|
| Set up and deploy? | `y` |
| Which scope? | your personal account |
| Link to existing project? | `n` |
| Project name? | `apexracingssn` |

Everything else (build command, output directory, headers, caching) is already
in `vercel.json`, so accept the detected settings.

If the name `apexracingssn` is taken, Vercel gives you a different URL. You can
rename it later under Project Settings, Domains.

**After the first deploy**, every later release is just `npx vercel --prod`.

---

## Run it locally

```bash
npm install
npm run dev
```

Then open the address it prints, usually http://localhost:5173.

Add `?draft=1` to the URL to show the gold **CONFIRM** chips. Those mark every
fact on the site that nobody has verified yet. See `OPEN_ITEMS.md`.

---

## Change the content

**Everything you would want to edit lives in one file: `src/content/site.ts`.**

Results, specs, partner lanes, phone numbers, links, copy. No need to touch any
component. A few rules in there:

- No em dashes anywhere. Full stops, commas, colons or brackets instead.
- Never add a number, result or name that is not in a report or confirmed by the
  team. If it is not confirmed, add `confirm: true` to that item so it shows a
  review chip in draft mode.

After editing, run `npm run build` and deploy.

### Adding or changing photos

Photos are not committed as originals. `tools/build_assets.py` reads the team's
raw material and writes optimised WebP into `public/assets/`, plus
`src/content/gallery.json`.

To add a photo:

1. Put the file somewhere the script can reach and add an entry to the `GALLERY`
   list in `tools/build_assets.py`. Give it a slug, a tag
   (`track`, `garage`, `crew`, `events`) and a real alt description of what is
   in the picture.
2. Run `npm run assets`.
3. Run `npm run build`.

The `SRC` paths at the top of that script point at where the source material sat
when the site was built. Point them at wherever the originals live now.

### Adding a partner logo

1. Drop the logo into `public/assets/partners/<slug>.webp`, or add it to the
   `PARTNERS` list in `tools/build_assets.py` and run `npm run assets`.
2. Add `{ slug: '<slug>', name: 'Their Name' }` to `pastPartners` in
   `src/content/site.ts`.

---

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server with hot reload |
| `npm run build` | Type check, then build to `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run assets` | Rebuild images and logos from the raw sources |
| `npm run qc` | Screenshot every screen at 1440px and 390px into `qc/` |
| `npm run audit` | Layout and link audit across five widths, writes `qc/AUDIT.md` |
| `npm run check` | Type check only |

`qc` and `audit` need a build first.

---

## How it is put together

```
src/
  content/site.ts        every word, number and link on the site
  content/gallery.json   generated photo metadata
  render/sections.ts     builds the whole page as a string
  render/html.ts         small shared string helpers
  modules/core.ts        smooth scroll, motion preference, toasts, tracking
  modules/hud.ts         boot screen, pill nav, mini map, speedo, pause menu
  modules/scrollkart.ts  the kart that drives down the page
  modules/screens.ts     behaviour for each screen
  styles/                tokens, base, hud, sections
tools/
  build_assets.py        the image pipeline
  qc.mjs                 screenshots
  audit.mjs              layout and link audit
```

The page is rendered to real HTML **at build time**. `vite.config.ts` calls
`renderBody()` and drops the result into `index.html`. That means the site reads
fine with JavaScript off, the browser can paint the hero before any script runs,
and search engines see the content. The TypeScript in `src/modules` only attaches
behaviour to markup that is already there.

### Motion

GSAP ScrollTrigger and MotionPath drive the scroll kart, the horizontal Career
rail and the reveals. Lenis smooths the scroll on pointer devices and is off on
touch, where it fights the operating system.

`prefers-reduced-motion` is respected everywhere: the kart stops animating and
just tracks the scroll position, the career rail becomes a swipe carousel, the
telemetry canvases draw one static frame, and the boot screen is skipped.

### Analytics

`initTracking` in `src/modules/core.ts` already fires named events on the
important clicks: `boxbox`, `razorpay`, `call`, `whatsapp`, `instagram`,
`linkedin`, `sponsor-part`. Nothing is sent anywhere yet. Drop a Plausible or
GoatCounter snippet into `index.html` and it will start counting with no other
changes.
