import { createSubHeader } from './sub-header.ts';

void function typeChecks() {
  createSubHeader({ label: 'A' });
  createSubHeader({ label: 'A', as: 'h2' });

  // @ts-expect-error invalid as
  createSubHeader({ label: 'A', as: 'span' });

  // @ts-expect-error label required
  createSubHeader({ as: 'h2' });
};
