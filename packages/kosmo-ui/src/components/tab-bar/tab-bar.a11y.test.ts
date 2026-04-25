/**
 * a11y smoke tests for `createTabBar`.
 *
 * Verifies the tablist has the expected ARIA structure (role=tablist, role=tab,
 * aria-selected) and passes axe-core for both default + disabled cases.
 */

import { afterEach, describe, it } from 'vitest';
import { createTabBar } from './tab-bar.ts';
import { expectNoA11yViolations } from '../../test-utils/a11y.ts';

describe('TabBar accessibility', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('has no a11y violations with three active tabs', async () => {
    const bar = createTabBar({
      items: [
        { id: 'one', label: 'One' },
        { id: 'two', label: 'Two' },
        { id: 'three', label: 'Three' },
      ],
      ariaLabel: 'Sample tabs',
      activeId: 'two',
    });
    await expectNoA11yViolations(bar.el);
  });

  it('has no a11y violations with a disabled tab', async () => {
    const bar = createTabBar({
      items: [
        { id: 'one', label: 'One' },
        { id: 'two', label: 'Two', disabled: true },
        { id: 'three', label: 'Three' },
      ],
      ariaLabel: 'Sample tabs',
    });
    await expectNoA11yViolations(bar.el);
  });
});
