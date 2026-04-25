/**
 * Enhances every `.kosmo-btn` element on the page with the @kosmo/ui Button
 * component so loading state, variants, and click handling are wired
 * automatically. Pages declare semantic markup:
 *
 * ```html
 * <button class="kosmo-btn kosmo-btn--pink">
 *   <span class="kosmo-btn-face">Label</span>
 * </button>
 * ```
 */

import { enhanceButton } from '@kosmo/ui';

export function initButtons(root: ParentNode = document): void {
  root.querySelectorAll<HTMLButtonElement>('button.kosmo-btn').forEach((el) => {
    if (el.dataset.btnEnhanced) return;
    el.dataset.btnEnhanced = 'true';
    enhanceButton(el);
  });
}
