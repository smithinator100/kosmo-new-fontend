import { describe, expect, it } from 'vitest';
import { createSubHeader, enhanceSubHeader } from './sub-header.ts';

describe('createSubHeader', () => {
  it('renders an h3 by default with the label', () => {
    const sh = createSubHeader({ label: 'Copy design styles' });
    expect(sh.el.tagName).toBe('H3');
    expect(sh.el.classList.contains('kosmo-sub-header')).toBe(true);
    expect(sh.el.textContent).toBe('Copy design styles');
  });

  it('respects the as override', () => {
    const sh = createSubHeader({ label: 'Section', as: 'h2' });
    expect(sh.el.tagName).toBe('H2');
  });

  it('updates label via setLabel', () => {
    const sh = createSubHeader({ label: 'A' });
    sh.setLabel('B');
    expect(sh.el.textContent).toBe('B');
  });
});

describe('enhanceSubHeader', () => {
  it('upgrades existing markup', () => {
    const el = document.createElement('div');
    el.textContent = 'EXISTING';
    enhanceSubHeader(el);
    expect(el.classList.contains('kosmo-sub-header')).toBe(true);
  });
});
