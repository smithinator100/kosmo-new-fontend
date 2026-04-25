/**
 * barba.js initialiser.
 *
 * Defines the namespace views (each just sets the document title) and the
 * default page transition that animates the page wrapper for non-prototype
 * pages. Per-page enhancement runs in `barba.hooks.after`.
 */

import barba from '@barba/core';
import { animatePageElements } from './transitions/default.ts';
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
import {
  loadAllSettings,
  syncPanelToSettings,
  saveAllSettings,
  initAnimPanel,
} from './prototype/anim-panel.ts';
import { initPrototype } from './prototype/state-machine.ts';
import { resetPageCycler } from './prototype/page-cycler.ts';
import { preloadPages } from './page-cache.ts';

const VIEW_TITLES: Record<string, string> = {
  home: 'KOSMO',
  about: 'About - KOSMO',
  button: 'Button - KOSMO',
  login: 'Login - KOSMO',
  email: 'Email - KOSMO',
  verification: 'Verification - KOSMO',
  'api-key': 'API Key - KOSMO',
  name: 'Name - KOSMO',
  input: 'Input - KOSMO',
  plugins: 'Plugins - KOSMO',
  'plugin-content': 'Plugin Content - KOSMO',
  'plugin-build': 'Plugin Build - KOSMO',
  favourites: 'Favourites - KOSMO',
  'tab-bar': 'Tab bar - KOSMO',
  'list-item': 'List item - KOSMO',
  'search-input': 'Search input - KOSMO',
  'sub-header': 'Sub-header - KOSMO',
  docs: 'Docs - KOSMO',
  tools: 'Tools - KOSMO',
  settings: 'Settings - KOSMO',
};

const STATIC_NAMESPACES = new Set(Object.keys(VIEW_TITLES));

function initEnhancers(): void {
  initComponentDocs();
  initInputs();
  initButtons();
  initTabBars();
  initSearchBehavior();
  if (document.querySelector('[data-barba-namespace="input"]')) initInputArrowBehavior();
  if (document.querySelector('[data-barba-namespace="plugins"]')) initPluginsScrollbar();
  if (document.querySelector('[data-barba-namespace="favourites"]')) initFavouritesScrollbar();
  if (document.querySelector('[data-barba-namespace="home"]')) {
    Promise.all([loadAllSettings(), preloadPages()]).then(() => {
      initAnimPanel();
      initPrototype();
    });
  }
}

export function initBarba(): void {
  barba.hooks.before((data) => {
    document.body.classList.add('is-transitioning');
    if (data?.current?.namespace === 'home') {
      syncPanelToSettings();
      saveAllSettings();
    }
  });

  barba.hooks.after(() => {
    document.body.classList.remove('is-transitioning');
    resetPageCycler();
    updateSidebarActive();
    refreshIcons();
    initEnhancers();
  });

  barba.init({
    transitions: [
      {
        name: 'default',
        leave(data) {
          const current = data.current.namespace ?? '';
          const next = data.next.namespace ?? '';
          if (STATIC_NAMESPACES.has(current) || next === 'home' || current === 'home') {
            return Promise.resolve();
          }
          return animatePageElements(data.current.container, 'out');
        },
        enter(data) {
          const next = data.next.namespace ?? '';
          if (STATIC_NAMESPACES.has(next) || next === 'home') {
            return Promise.resolve();
          }
          return animatePageElements(data.next.container, 'in');
        },
      },
    ],
    views: Object.entries(VIEW_TITLES).map(([namespace, title]) => ({
      namespace,
      beforeEnter() {
        document.title = title;
      },
    })),
  });
}

export { initEnhancers };
