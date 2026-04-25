import { createAppBar } from './app-bar.ts';

void function typeChecks() {
  createAppBar({ ariaLabel: 'a' });
  createAppBar({ ariaLabel: 'a', title: 'v1.0' });
  createAppBar({ ariaLabel: 'a', title: document.createElement('span') });
  createAppBar({
    ariaLabel: 'a',
    leading: { icon: 'chevron-left', ariaLabel: 'Back' },
    trailing: [
      { icon: 'star', ariaLabel: 'Favourite', tone: 'favourite' },
      { icon: 'trash-2', ariaLabel: 'Delete', onClick: () => {} },
      { icon: 'chevron-left', ariaLabel: '', hidden: true },
    ],
  });

  // @ts-expect-error ariaLabel required on the bar itself
  createAppBar({ title: 'v1.0' });

  // @ts-expect-error ariaLabel required on every action
  createAppBar({ ariaLabel: 'a', leading: { icon: 'chevron-left' } });

  // @ts-expect-error invalid tone
  createAppBar({
    ariaLabel: 'a',
    trailing: [{ icon: 'star', ariaLabel: 'x', tone: 'danger' }],
  });
};
