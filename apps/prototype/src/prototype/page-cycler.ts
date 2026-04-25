/**
 * Component-preview page cycler.
 *
 * On the multi-section preview pages (Plugins / Favourites variants), arrow
 * keys can step through individual sections so each can be inspected in
 * isolation. `index === -1` means "show all sections".
 */

import { initPluginsScrollbar, initFavouritesScrollbar } from '../app-shell/scrollbars.ts';
import { initSearchBehavior } from '../app-shell/search-init.ts';

let pageStateIndex = -1;

function getPageStateSections(): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>('.plugins-page-section, .favourites-page-section'),
  );
}

function applyPageStateView(sections: HTMLElement[], index: number): void {
  const parent = sections[0]?.parentElement;

  sections.forEach((section, i) => {
    const label = section.querySelector<HTMLElement>('.component-preview-label');
    if (index === -1) {
      section.hidden = false;
      if (label) label.hidden = false;
    } else {
      section.hidden = i !== index;
      if (i === index && label) label.hidden = true;
    }
  });

  if (parent) {
    parent.style.justifyContent = index === -1 ? '' : 'center';
  }
}

export function resetPageCycler(): void {
  pageStateIndex = -1;
}

export function handlePageStateArrowKey(e: KeyboardEvent): boolean {
  const sections = getPageStateSections();
  if (sections.length < 2) return false;

  e.preventDefault();

  if (e.key === 'ArrowDown') {
    pageStateIndex = Math.min(pageStateIndex + 1, sections.length - 1);
  } else {
    pageStateIndex = Math.max(pageStateIndex - 1, -1);
  }

  applyPageStateView(sections, pageStateIndex);

  if (pageStateIndex >= 0) {
    const ns = document.querySelector<HTMLElement>('[data-barba="container"]')?.dataset
      .barbaNamespace;
    if (ns === 'plugins') initPluginsScrollbar();
    if (ns === 'favourites') initFavouritesScrollbar();
    initSearchBehavior();
  }

  return true;
}
