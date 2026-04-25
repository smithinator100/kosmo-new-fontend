/**
 * Prototype entry point.
 *
 * Composes the dev shell + the prototype state machine. All meaningful logic
 * lives in dedicated modules; this file just wires them together and owns the
 * top-level keyboard router.
 */

import '@kosmo/ui/styles.css';
import './style.css';

import { refreshIcons } from './icons.ts';
import { updateSidebarActive } from './app-shell/sidebar.ts';
import { initInputArrowBehavior } from './app-shell/input-arrow.ts';
import { initSearchBehavior } from './app-shell/search-init.ts';
import { initInputs } from './app-shell/inputs.ts';
import { initButtons } from './app-shell/buttons.ts';
import { initTabBars } from './app-shell/tab-bar-init.ts';
import { initComponentDocs } from './views/component-docs.ts';
import {
  initPluginsScrollbar,
  initFavouritesScrollbar,
} from './app-shell/scrollbars.ts';
import { initBarba } from './barba-init.ts';
import {
  loadAllSettings,
  initAnimPanel,
} from './prototype/anim-panel.ts';
import {
  initPrototype,
  resetPrototype,
  navigatePrototype,
  handleProtoStateArrowKey,
  isAtPluginsStep,
} from './prototype/state-machine.ts';
import { handlePageStateArrowKey } from './prototype/page-cycler.ts';
import { preloadPages } from './page-cache.ts';

initBarba();

updateSidebarActive();
refreshIcons();

initComponentDocs();
initInputs();
initButtons();
initTabBars();
initSearchBehavior();

if (document.querySelector('[data-barba-namespace="input"]')) {
  initInputArrowBehavior();
}

if (document.querySelector('[data-barba-namespace="plugins"]')) {
  initPluginsScrollbar();
}

if (document.querySelector('[data-barba-namespace="favourites"]')) {
  initFavouritesScrollbar();
}

if (document.querySelector('[data-barba-namespace="home"]')) {
  Promise.all([loadAllSettings(), preloadPages()]).then(() => {
    initAnimPanel();
    initPrototype();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

  if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && handlePageStateArrowKey(e)) return;

  if (!document.querySelector('[data-barba-namespace="home"]')) return;

  if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && isAtPluginsStep() && handleProtoStateArrowKey(e)) {
    return;
  }

  if (e.key === 'ArrowRight') { navigatePrototype('forward'); return; }
  if (e.key === 'ArrowLeft') { navigatePrototype('back'); return; }
  if (e.key === 'r') resetPrototype();
});
