/**
 * Type-level tests. These never run — they only need to type-check.
 * Use `// @ts-expect-error` for cases that *should* fail.
 */

import { createButton } from './button.ts';
import type { ButtonProps } from './types.ts';

void function typeChecks() {
  createButton({ label: 'ok' });
  createButton({ label: 'ok', variant: 'pink', state: 'loading' });

  // @ts-expect-error — invalid variant
  createButton({ label: 'no', variant: 'rainbow' });

  // @ts-expect-error — invalid state
  createButton({ label: 'no', state: 'spinning' });

  // @ts-expect-error — label is required
  createButton({ variant: 'primary' });

  // ariaLabel is a string
  const _a: ButtonProps = { label: 'x', ariaLabel: 'y' };
  void _a;
};
