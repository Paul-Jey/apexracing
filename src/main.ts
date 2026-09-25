import '@fontsource/barlow-condensed/latin-700.css';
import '@fontsource/barlow-condensed/latin-800.css';
import '@fontsource/barlow-condensed/latin-800-italic.css';
import '@fontsource/chakra-petch/latin-500.css';
import '@fontsource/chakra-petch/latin-600.css';
import '@fontsource/barlow/latin-400.css';
import '@fontsource/barlow/latin-500.css';

import './styles/tokens.css';
import './styles/base.css';
import './styles/hud.css';
import './styles/sections.css';

import { initScroll, initTracking, ScrollTrigger } from './modules/core';
import { initBoot, initHud } from './modules/hud';
import { initScrollKart } from './modules/scrollkart';
import { initScreens } from './modules/screens';

const draft = new URLSearchParams(location.search).has('draft');
if (draft) document.body.classList.add('draft');
document.body.classList.add('has-ticker');

initScroll();
initTracking(draft);
initScreens();
initHud();

initBoot(() => {
  initScrollKart();
  // sections shift once fonts land and the boot screen clears
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.setTimeout(() => ScrollTrigger.refresh(), 400);
});
