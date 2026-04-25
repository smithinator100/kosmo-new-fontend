/**
 * Enhances every `.kosmo-search` block found in the document with the
 * `@kosmo/ui` Search behaviour, plus the prototype's "title-case the first
 * character as you type" affordance.
 */

import { enhanceSearch } from '@kosmo/ui';

export function initSearchBehavior(): void {
  document.querySelectorAll<HTMLElement>('.kosmo-search').forEach((root) => {
    if (root.dataset.searchEnhanced) return;
    root.dataset.searchEnhanced = 'true';

    const instance = enhanceSearch(root);

    instance.field.addEventListener('input', () => {
      const value = instance.field.value;
      if (value.length !== 1) return;
      const pos = instance.field.selectionStart;
      const next = value.charAt(0).toUpperCase() + value.slice(1);
      if (next === instance.field.value) return;
      instance.field.value = next;
      instance.field.selectionStart = instance.field.selectionEnd = pos;
    });
  });
}
