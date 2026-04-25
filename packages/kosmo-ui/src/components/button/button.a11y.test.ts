/**
 * a11y smoke tests for `createButton`.
 *
 * Each variant + state combination is rendered and asserted to produce zero
 * axe-core violations under WCAG2 AA + best-practice rules.
 */

import { afterEach, describe, it } from 'vitest';
import { createButton } from './button.ts';
import { BUTTON_STATES, BUTTON_VARIANTS } from './types.ts';
import { expectNoA11yViolations } from '../../test-utils/a11y.ts';

describe('Button accessibility', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  for (const variant of BUTTON_VARIANTS) {
    for (const state of BUTTON_STATES) {
      it(`has no a11y violations: ${variant} · ${state}`, async () => {
        const btn = createButton({ label: 'Sign in', variant, state });
        await expectNoA11yViolations(btn.el);
      });
    }
  }

  it('icon-only button must declare an aria-label', async () => {
    const btn = createButton({
      label: '',
      iconLeft: 'arrow-left',
      ariaLabel: 'Go back',
    });
    await expectNoA11yViolations(btn.el);
  });
});
