/**
 * Enhances every `.kosmo-input` block on the page with the @kosmo/ui Input
 * component so focus, has-text, and error states are wired automatically.
 *
 * Pages declare semantic markup:
 *
 * ```html
 * <div class="kosmo-input">
 *   <label class="kosmo-input-face">
 *     <input class="kosmo-input-field" />
 *   </label>
 * </div>
 * ```
 *
 * and this enhancer upgrades each one in place.
 */

import { enhanceInput } from '@kosmo/ui';

export function initInputs(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('.kosmo-input').forEach((el) => {
    if (el.dataset.inputEnhanced) return;
    el.dataset.inputEnhanced = 'true';
    enhanceInput(el);
  });
}
