import { createTabBar } from './tab-bar.ts';

void function typeChecks() {
  createTabBar({ items: [{ id: 'a', label: 'A' }] });

  // @ts-expect-error items is required
  createTabBar({});

  // @ts-expect-error wrong shape
  createTabBar({ items: [{ key: 'a' }] });
};
