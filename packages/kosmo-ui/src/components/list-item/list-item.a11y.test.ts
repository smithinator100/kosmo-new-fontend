/**
 * a11y smoke tests for `createListItem`.
 */

import { afterEach, describe, it } from 'vitest';
import { createListItem } from './list-item.ts';
import { LIST_ITEM_TONES } from './types.ts';
import { expectNoA11yViolations } from '../../test-utils/a11y.ts';

describe('ListItem accessibility', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  for (const tone of LIST_ITEM_TONES) {
    it(`has no a11y violations: ${tone} (no trailing action)`, async () => {
      const item = createListItem({ icon: 'layout-grid', label: 'Layout', tone });
      await expectNoA11yViolations(item.el);
    });

    it(`has no a11y violations: ${tone} (with trailing action)`, async () => {
      const item = createListItem({
        icon: 'layout-grid',
        label: 'Layout',
        tone,
        action: { icon: 'settings-2', ariaLabel: 'Layout settings' },
      });
      await expectNoA11yViolations(item.el);
    });

    it(`has no a11y violations: ${tone} (interactive row)`, async () => {
      const item = createListItem({
        icon: 'layout-grid',
        label: 'Layout',
        tone,
        interactive: true,
        onClick: () => {},
      });
      await expectNoA11yViolations(item.el);
    });
  }
});
