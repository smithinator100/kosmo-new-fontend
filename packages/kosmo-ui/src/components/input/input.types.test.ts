import { createInput } from './input.ts';

void function typeChecks() {
  createInput({ label: 'Email' });
  createInput({ label: 'Body', variant: 'large', rows: 8 });
  createInput({ label: 'Code', state: 'error' });

  // @ts-expect-error invalid state
  createInput({ label: 'x', state: 'borked' });

  // @ts-expect-error invalid variant
  createInput({ label: 'x', variant: 'mini' });

  // @ts-expect-error invalid type
  createInput({ label: 'x', type: 'date' });
};
