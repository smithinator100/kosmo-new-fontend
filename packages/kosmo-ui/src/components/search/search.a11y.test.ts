/**
 * a11y smoke tests for `createSearch`.
 */

import { afterEach, describe, it } from 'vitest';
import { createSearch } from './search.ts';
import { expectNoA11yViolations } from '../../test-utils/a11y.ts';

describe('Search accessibility', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('has no a11y violations when empty', async () => {
    const inst = createSearch({ placeholder: 'Search', ariaLabel: 'Search components' });
    await expectNoA11yViolations(inst.el);
  });

  it('has no a11y violations with a value (clear button visible)', async () => {
    const inst = createSearch({ placeholder: 'Search', value: 'Layout', ariaLabel: 'Search components' });
    await expectNoA11yViolations(inst.el);
  });
});
