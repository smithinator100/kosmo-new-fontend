import { createSearch } from './search.ts';

void function typeChecks() {
  createSearch();
  createSearch({ placeholder: 'Find', onChange: (v) => v.toUpperCase() });

  // @ts-expect-error onChange must be a function
  createSearch({ onChange: 'string' });
};
