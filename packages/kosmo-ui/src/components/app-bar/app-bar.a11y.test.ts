import { afterEach, describe, it } from 'vitest';
import { createAppBar } from './app-bar.ts';
import { expectNoA11yViolations } from '../../test-utils/a11y.ts';

describe('AppBar accessibility', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('has no a11y violations with leading + title + trailing actions', async () => {
    const bar = createAppBar({
      ariaLabel: 'Plugin actions',
      leading: { icon: 'chevron-left', ariaLabel: 'Back' },
      title: 'v1.0',
      trailing: [
        { icon: 'star', ariaLabel: 'Remove from favourites', tone: 'favourite' },
        { icon: 'trash-2', ariaLabel: 'Delete plugin' },
      ],
    });
    await expectNoA11yViolations(bar.el);
  });

  it('has no a11y violations with only a title (no actions)', async () => {
    const bar = createAppBar({ ariaLabel: 'Plugin actions', title: 'v1.0' });
    await expectNoA11yViolations(bar.el);
  });

  it('has no a11y violations with a hidden spacer slot', async () => {
    const bar = createAppBar({
      ariaLabel: 'Plugin actions',
      leading: { icon: 'chevron-left', ariaLabel: 'Back' },
      title: 'v1.0',
      trailing: [{ icon: 'chevron-left', ariaLabel: '', hidden: true }],
    });
    await expectNoA11yViolations(bar.el);
  });
});
