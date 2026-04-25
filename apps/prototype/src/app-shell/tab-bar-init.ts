/**
 * Enhances every `.kosmo-tab-bar` element on the page with the @kosmo/ui
 * TabBar component so keyboard navigation + active-tab indicator are wired
 * automatically.
 *
 * Inside the prototype's plugin shell tabs are managed by the prototype state
 * machine; this enhancer is intentionally a pure UI layer with no router
 * coupling.
 */

import { enhanceTabBar } from '@kosmo/ui';

export function initTabBars(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('.kosmo-tab-bar').forEach((el) => {
    if (el.dataset.tabBarEnhanced) return;
    // Tabs marked as prototype router targets are owned by the state machine.
    if (el.querySelector('[data-proto-tab]')) return;
    el.dataset.tabBarEnhanced = 'true';
    enhanceTabBar(el);
  });
}
