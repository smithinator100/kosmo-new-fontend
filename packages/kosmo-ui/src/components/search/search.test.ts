import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createSearch, enhanceSearch } from './search.ts';

describe('createSearch', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a form[role=search] with input + clear', () => {
    const s = createSearch();
    document.body.appendChild(s.el);
    expect(s.el.tagName).toBe('FORM');
    expect(s.el.getAttribute('role')).toBe('search');
    expect(s.el.querySelector('.kosmo-search-field')).not.toBeNull();
    expect(s.el.querySelector('.kosmo-search-clear')).not.toBeNull();
  });

  it('toggles has-text on input', () => {
    const s = createSearch();
    document.body.appendChild(s.el);
    s.field.value = 'foo';
    s.field.dispatchEvent(new Event('input'));
    expect(s.el.classList.contains('has-text')).toBe(true);
    s.clear();
    expect(s.el.classList.contains('has-text')).toBe(false);
  });

  it('calls onChange / onSubmit / onClear', () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn();
    const onClear = vi.fn();
    const s = createSearch({ onChange, onSubmit, onClear });
    document.body.appendChild(s.el);
    s.field.value = 'q';
    s.field.dispatchEvent(new Event('input'));
    expect(onChange).toHaveBeenCalledWith('q', expect.any(Event));
    s.el.dispatchEvent(new Event('submit', { cancelable: true }));
    expect(onSubmit).toHaveBeenCalledWith('q');
    s.clear();
    expect(onClear).toHaveBeenCalled();
  });

  it('updates is-focused on focus/blur', () => {
    const s = createSearch();
    document.body.appendChild(s.el);
    s.field.dispatchEvent(new FocusEvent('focus'));
    expect(s.el.classList.contains('is-focused')).toBe(true);
    s.field.dispatchEvent(new FocusEvent('blur'));
    expect(s.el.classList.contains('is-focused')).toBe(false);
  });
});

describe('enhanceSearch', () => {
  it('adds a clear button when missing', () => {
    const el = document.createElement('div');
    el.innerHTML = '<input class="kosmo-search-field" />';
    const s = enhanceSearch(el);
    expect(s.el.querySelector('.kosmo-search-clear')).not.toBeNull();
  });
});
