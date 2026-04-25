import { describe, expect, it, vi } from 'vitest';
import { createButton, enhanceButton } from './button.ts';

describe('createButton', () => {
  it('renders a <button> with the given label and primary variant by default', () => {
    const btn = createButton({ label: 'Sign in' });
    expect(btn.el.tagName).toBe('BUTTON');
    expect(btn.el.type).toBe('button');
    expect(btn.el.classList.contains('kosmo-btn')).toBe(true);
    expect(btn.el.classList.contains('kosmo-btn--primary')).toBe(true);
    expect(btn.el.textContent).toContain('Sign in');
  });

  it('applies the requested variant', () => {
    const btn = createButton({ label: 'Run', variant: 'pink' });
    expect(btn.el.classList.contains('kosmo-btn--pink')).toBe(true);
    expect(btn.el.classList.contains('kosmo-btn--primary')).toBe(false);
  });

  it('switches variants imperatively', () => {
    const btn = createButton({ label: 'Run', variant: 'primary' });
    btn.setVariant('yellow');
    expect(btn.el.classList.contains('kosmo-btn--yellow')).toBe(true);
    expect(btn.el.classList.contains('kosmo-btn--primary')).toBe(false);
  });

  it('toggles loading state and sets aria-busy', () => {
    const btn = createButton({ label: 'Save' });
    btn.setState('loading');
    expect(btn.el.classList.contains('is-loading')).toBe(true);
    expect(btn.el.getAttribute('aria-busy')).toBe('true');

    btn.setState('idle');
    expect(btn.el.classList.contains('is-loading')).toBe(false);
    expect(btn.el.getAttribute('aria-busy')).toBeNull();
  });

  it('disables the underlying element when state is disabled', () => {
    const btn = createButton({ label: 'Save', state: 'disabled' });
    expect(btn.el.disabled).toBe(true);
    expect(btn.el.classList.contains('is-disabled')).toBe(true);
  });

  it('invokes onClick on click in idle state', () => {
    const onClick = vi.fn();
    const btn = createButton({ label: 'Go', onClick });
    btn.el.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('blocks onClick while loading', () => {
    const onClick = vi.fn();
    const btn = createButton({ label: 'Go', onClick, state: 'loading' });
    btn.el.click();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders left + right icons when supplied', () => {
    const btn = createButton({ label: 'Open', iconLeft: 'arrow-left', iconRight: 'arrow-right' });
    expect(btn.el.querySelector('.kosmo-btn-icon--left [data-lucide="arrow-left"]')).not.toBeNull();
    expect(btn.el.querySelector('.kosmo-btn-icon--right [data-lucide="arrow-right"]')).not.toBeNull();
  });

  it('respects ariaLabel override', () => {
    const btn = createButton({ label: 'Go', ariaLabel: 'Submit form' });
    expect(btn.el.getAttribute('aria-label')).toBe('Submit form');
  });

  it('removes listeners on destroy', () => {
    const onClick = vi.fn();
    const btn = createButton({ label: 'Go', onClick });
    btn.destroy();
    btn.el.click();
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('enhanceButton', () => {
  it('upgrades plain button markup', () => {
    const el = document.createElement('button');
    el.textContent = 'Click me';
    const inst = enhanceButton(el);
    expect(inst.el.classList.contains('kosmo-btn')).toBe(true);
    expect(inst.el.classList.contains('kosmo-btn--primary')).toBe(true);
    expect(inst.el.textContent).toContain('Click me');
  });

  it('infers variant from existing classes', () => {
    const el = document.createElement('button');
    el.className = 'kosmo-btn kosmo-btn--pink';
    el.innerHTML = '<span class="kosmo-btn-face"><span class="kosmo-btn-label">Run</span></span>';
    const inst = enhanceButton(el);
    expect(inst.el.classList.contains('kosmo-btn--pink')).toBe(true);
  });

  it('overrides label when provided', () => {
    const el = document.createElement('button');
    el.innerHTML = '<span class="kosmo-btn-face"><span class="kosmo-btn-label">Old</span></span>';
    enhanceButton(el, { label: 'New' });
    expect(el.textContent).toContain('New');
  });
});
