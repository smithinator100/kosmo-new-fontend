/**
 * a11y smoke tests for `createInput`.
 *
 * Verifies that every variant + state combo renders an input with a programmatic
 * label association (either visible `<label>` or an `aria-label` fallback).
 */

import { afterEach, describe, it } from 'vitest';
import { createInput } from './input.ts';
import { INPUT_STATES, INPUT_VARIANTS } from './types.ts';
import { expectNoA11yViolations } from '../../test-utils/a11y.ts';

describe('Input accessibility', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  for (const variant of INPUT_VARIANTS) {
    for (const state of INPUT_STATES) {
      it(`has no a11y violations: ${variant} · ${state} (visible label)`, async () => {
        const inst = createInput({ label: 'Email address', variant, state });
        await expectNoA11yViolations(inst.el);
      });

      it(`has no a11y violations: ${variant} · ${state} (aria-label fallback)`, async () => {
        const inst = createInput({ ariaLabel: 'Email address', variant, state });
        await expectNoA11yViolations(inst.el);
      });
    }
  }
});
