import { lucideIcon, setVariantClass, toggleClass } from '../../utils/dom.ts';
import {
  INPUT_VARIANTS,
  type InputInstance,
  type InputProps,
  type InputState,
  type InputVariant,
} from './types.ts';

const BLOCK = 'kosmo-input';

let uid = 0;
function nextId(): string {
  uid += 1;
  return `ks-input-${uid}`;
}

function createField(props: InputProps): HTMLInputElement | HTMLTextAreaElement {
  if (props.variant === 'large') {
    const ta = document.createElement('textarea');
    ta.className = `${BLOCK}-field`;
    ta.rows = props.rows ?? 6;
    if (props.value != null) ta.value = props.value;
    if (props.placeholder) ta.placeholder = props.placeholder;
    if (props.name) ta.name = props.name;
    if (props.maxLength != null) ta.maxLength = props.maxLength;
    if (props.disabled) ta.disabled = true;
    if (props.readOnly) ta.readOnly = true;
    return ta;
  }

  const input = document.createElement('input');
  input.className = `${BLOCK}-field`;
  input.type = props.type ?? 'text';
  if (props.value != null) input.value = props.value;
  if (props.placeholder) input.placeholder = props.placeholder;
  if (props.name) input.name = props.name;
  if (props.maxLength != null) input.maxLength = props.maxLength;
  if (props.inputMode) input.inputMode = props.inputMode;
  if (props.disabled) input.disabled = true;
  if (props.readOnly) input.readOnly = true;
  return input;
}

function applyState(el: HTMLElement, state: InputState): void {
  toggleClass(el, 'is-focused', state === 'focused');
  toggleClass(el, 'is-error', state === 'error');
}

/**
 * Create a new Kosmo input.
 *
 * @example
 *   const input = createInput({ label: 'Email', placeholder: 'you@example.com' });
 *   document.body.appendChild(input.el);
 */
export function createInput(props: InputProps): InputInstance {
  const wrapper = document.createElement('div');
  wrapper.className = BLOCK;
  setVariantClass(wrapper, BLOCK, props.variant ?? 'default', INPUT_VARIANTS);
  if (props.disabled) wrapper.classList.add('is-disabled');

  const face = document.createElement('label');
  face.className = `${BLOCK}-face`;

  const field = createField(props);
  face.appendChild(field);

  if (props.trailingIcon) {
    const wrap = document.createElement('span');
    wrap.className = `${BLOCK}-icon ${BLOCK}-icon--trailing`;
    wrap.appendChild(lucideIcon(props.trailingIcon));
    face.appendChild(wrap);
  }

  wrapper.appendChild(face);

  const id = nextId();
  field.id = id;
  face.htmlFor = id;

  if (props.label) face.setAttribute('aria-label', props.label);
  if (props.ariaLabel) field.setAttribute('aria-label', props.ariaLabel);
  if (props.ariaLabelledBy) field.setAttribute('aria-labelledby', props.ariaLabelledBy);

  if (props.state && props.state !== 'idle') applyState(wrapper, props.state);

  return wireInstance(wrapper, field, props);
}

/**
 * Upgrade existing markup. Expects:
 * ```html
 * <div class="kosmo-input">
 *   <label class="kosmo-input-face">
 *     <input class="kosmo-input-field" />
 *   </label>
 * </div>
 * ```
 */
export function enhanceInput(
  el: HTMLElement,
  props: Partial<InputProps> = {},
): InputInstance {
  el.classList.add(BLOCK);
  const inferredVariant = INPUT_VARIANTS.find((v) => el.classList.contains(`${BLOCK}--${v}`));
  const variant: InputVariant = props.variant ?? inferredVariant ?? 'default';
  setVariantClass(el, BLOCK, variant, INPUT_VARIANTS);

  const field = el.querySelector<HTMLInputElement | HTMLTextAreaElement>(`.${BLOCK}-field`);
  if (!field) throw new Error('[kosmo-ui] enhanceInput: missing .kosmo-input-field child.');

  if (props.value != null) field.value = props.value;
  if (props.placeholder != null) field.placeholder = props.placeholder;
  if (props.disabled) {
    field.disabled = true;
    el.classList.add('is-disabled');
  }
  if (props.ariaLabel) field.setAttribute('aria-label', props.ariaLabel);

  let inferredState: InputState | undefined;
  if (el.classList.contains('is-error')) inferredState = 'error';
  else if (el.classList.contains('is-focused')) inferredState = 'focused';

  return wireInstance(el, field, { variant, state: inferredState, ...props });
}

function wireInstance(
  wrapper: HTMLElement,
  field: HTMLInputElement | HTMLTextAreaElement,
  props: InputProps,
): InputInstance {
  let currentState: InputState = props.state ?? 'idle';

  function syncHasText(): void {
    toggleClass(wrapper, 'has-text', field.value.length > 0);
  }
  syncHasText();

  const handleInput: EventListener = (e) => {
    syncHasText();
    props.onChange?.(field.value, e);
  };
  const handleFocus: EventListener = (e) => {
    if (currentState !== 'error') currentState = 'focused';
    applyState(wrapper, currentState);
    props.onFocus?.(e as FocusEvent);
  };
  const handleBlur: EventListener = (e) => {
    if (currentState === 'focused') currentState = 'idle';
    applyState(wrapper, currentState);
    props.onBlur?.(e as FocusEvent);
  };
  const handleKeyDown: EventListener = (e) => {
    props.onKeyDown?.(e as KeyboardEvent);
  };

  field.addEventListener('input', handleInput);
  field.addEventListener('focus', handleFocus);
  field.addEventListener('blur', handleBlur);
  field.addEventListener('keydown', handleKeyDown);

  return {
    el: wrapper,
    field,
    getValue() {
      return field.value;
    },
    setValue(value) {
      field.value = value;
      syncHasText();
    },
    setVariant(variant) {
      setVariantClass(wrapper, BLOCK, variant, INPUT_VARIANTS);
    },
    setState(state) {
      currentState = state;
      applyState(wrapper, currentState);
    },
    setError(errored) {
      currentState = errored ? 'error' : document.activeElement === field ? 'focused' : 'idle';
      applyState(wrapper, currentState);
    },
    setDisabled(disabled) {
      field.disabled = disabled;
      toggleClass(wrapper, 'is-disabled', disabled);
    },
    focus() {
      field.focus();
    },
    blur() {
      field.blur();
    },
    destroy() {
      field.removeEventListener('input', handleInput);
      field.removeEventListener('focus', handleFocus);
      field.removeEventListener('blur', handleBlur);
      field.removeEventListener('keydown', handleKeyDown);
    },
  };
}
