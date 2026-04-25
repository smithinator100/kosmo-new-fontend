import { createListItem } from './list-item.ts';

void function typeChecks() {
  createListItem({ label: 'A' });
  createListItem({
    label: 'A',
    icon: 'wrench',
    action: { icon: 'settings-2', ariaLabel: 'Settings' },
  });

  // @ts-expect-error label is required
  createListItem({});

  // @ts-expect-error invalid tone
  createListItem({ label: 'A', tone: 'warning' });

  // @ts-expect-error action requires ariaLabel
  createListItem({ label: 'A', action: { icon: 'wrench' } });
};
