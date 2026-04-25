/**
 * a11y smoke tests for `createSubHeader`.
 */

import { afterEach, describe, it } from 'vitest';
import { createSubHeader } from './sub-header.ts';
import { expectNoA11yViolations } from '../../test-utils/a11y.ts';

describe('SubHeader accessibility', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('has no a11y violations as a heading', async () => {
    const inst = createSubHeader({ label: 'Section title' });
    await expectNoA11yViolations(inst.el);
  });

  it('has no a11y violations as a decorative div', async () => {
    const inst = createSubHeader({ label: 'Section title', as: 'div' });
    await expectNoA11yViolations(inst.el);
  });
});
