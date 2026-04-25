import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createInput, enhanceInput } from './input.ts';

describe('createInput', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a wrapper + label + input by default', () => {
    const inst = createInput({ label: 'Email' });
    document.body.appendChild(inst.el);
    expect(inst.el.classList.contains('kosmo-input')).toBe(true);
    expect(inst.el.classList.contains('kosmo-input--default')).toBe(true);
    expect(inst.field.tagName).toBe('INPUT');
  });

  it('renders a textarea when variant=large', () => {
    const inst = createInput({ label: 'Body', variant: 'large' });
    expect(inst.el.classList.contains('kosmo-input--large')).toBe(true);
    expect(inst.field.tagName).toBe('TEXTAREA');
  });

  it('reflects has-text on input', () => {
    const inst = createInput({ label: 'Email' });
    document.body.appendChild(inst.el);
    inst.setValue('hello');
    expect(inst.el.classList.contains('has-text')).toBe(true);
    inst.setValue('');
    expect(inst.el.classList.contains('has-text')).toBe(false);
  });

  it('calls onChange when value changes via input event', () => {
    const onChange = vi.fn();
    const inst = createInput({ label: 'Email', onChange });
    document.body.appendChild(inst.el);
    inst.field.value = 'hi';
    inst.field.dispatchEvent(new Event('input'));
    expect(onChange).toHaveBeenCalledWith('hi', expect.any(Event));
  });

  it('toggles focused state on focus/blur', () => {
    const inst = createInput({ label: 'Email' });
    document.body.appendChild(inst.el);
    inst.field.dispatchEvent(new FocusEvent('focus'));
    expect(inst.el.classList.contains('is-focused')).toBe(true);
    inst.field.dispatchEvent(new FocusEvent('blur'));
    expect(inst.el.classList.contains('is-focused')).toBe(false);
  });

  it('keeps error state across focus changes', () => {
    const inst = createInput({ label: 'Email' });
    document.body.appendChild(inst.el);
    inst.setError(true);
    expect(inst.el.classList.contains('is-error')).toBe(true);
    inst.field.dispatchEvent(new FocusEvent('focus'));
    expect(inst.el.classList.contains('is-error')).toBe(true);
  });

  it('disables and re-enables', () => {
    const inst = createInput({ label: 'Email' });
    inst.setDisabled(true);
    expect(inst.el.classList.contains('is-disabled')).toBe(true);
    expect(inst.field.disabled).toBe(true);
    inst.setDisabled(false);
    expect(inst.field.disabled).toBe(false);
  });

  it('connects label and field via for/id', () => {
    const inst = createInput({ label: 'Email' });
    const face = inst.el.querySelector<HTMLLabelElement>('.kosmo-input-face')!;
    expect(face.htmlFor).toBe(inst.field.id);
    expect(inst.field.id).toMatch(/^ks-input-\d+$/);
  });
});

describe('enhanceInput', () => {
  it('throws if the field is missing', () => {
    const el = document.createElement('div');
    expect(() => enhanceInput(el)).toThrow();
  });

  it('upgrades existing markup', () => {
    const el = document.createElement('div');
    el.innerHTML = `
      <label class="kosmo-input-face">
        <input class="kosmo-input-field" />
      </label>
    `;
    const inst = enhanceInput(el, { value: 'seed' });
    expect(inst.field.value).toBe('seed');
  });
});
