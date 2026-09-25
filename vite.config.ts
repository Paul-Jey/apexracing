import { defineConfig } from 'vite';
import { renderBody } from './src/render/sections';

/**
 * Where this build will be served from. Set SITE_URL in CI to keep the
 * canonical link, the Open Graph URL and the share image honest wherever
 * the site is hosted.
 */
const SITE_URL = (process.env.SITE_URL ?? 'https://apexracingssn.vercel.app/').replace(/\/?$/, '/');

/**
 * The page is rendered to static markup at build time from src/content/site.ts,
 * so the site reads fine with JavaScript off and the browser can paint the hero
 * before any script runs. Relative base so it works on GitHub Pages under
 * /ApexRacing/ as well as at the root of a custom domain.
 */
export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    assetsInlineLimit: 2048,
    cssCodeSplit: false,
    reportCompressedSize: false,
  },
  plugins: [
    {
      name: 'apex-static-render',
      transformIndexHtml: {
        order: 'pre',
        handler: (html: string) =>
          html
            .replace('<!--APEX_BODY-->', renderBody())
            .replaceAll('https://apexracingssn.vercel.app/', SITE_URL),
      },
    },
  ],
});
