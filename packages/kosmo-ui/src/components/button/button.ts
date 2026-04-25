import { setVariantClass, toggleClass, lucideIcon } from '../../utils/dom.ts';
import {
  BUTTON_VARIANTS,
  type ButtonInstance,
  type ButtonProps,
  type ButtonState,
  type ButtonVariant,
} from './types.ts';

const BLOCK = 'kosmo-btn';

function applyVariant(el: HTMLButtonElement, variant: ButtonVariant): void {
  setVariantClass(el, BLOCK, variant, BUTTON_VARIANTS);
}

function applyState(el: HTMLButtonElement, state: ButtonState): void {
  toggleClass(el, 'is-loading', state === 'loading');
  toggleClass(el, 'is-disabled', state === 'disabled');
  el.disabled = state === 'disabled';
  if (state === 'loading') {
    el.setAttribute('aria-busy', 'true');
  } else {
    el.removeAttribute('aria-busy');
  }
}

function buildFace(props: ButtonProps): HTMLSpanElement {
  const face = document.createElement('span');
  face.className = `${BLOCK}-face`;

  if (props.iconLeft) {
    const wrap = document.createElement('span');
    wrap.className = `${BLOCK}-icon ${BLOCK}-icon--left`;
    wrap.appendChild(lucideIcon(props.iconLeft));
    face.appendChild(wrap);
  }

  const labelEl = document.createElement('span');
  labelEl.className = `${BLOCK}-label`;
  labelEl.textContent = props.label;
  face.appendChild(labelEl);

  if (props.iconRight) {
    const wrap = document.createElement('span');
    wrap.className = `${BLOCK}-icon ${BLOCK}-icon--right`;
    wrap.appendChild(lucideIcon(props.iconRight));
    face.appendChild(wrap);
  }

  return face;
}

/**
 * Create a fresh `<button>` element wired up as a Kosmo button.
 *
 * @example
 *   const btn = createButton({ label: 'Sign in', variant: 'pink' });
 *   document.body.appendChild(btn.el);
 *   btn.setState('loading');
 */
export function createButton(props: ButtonProps): ButtonInstance {
  const el = document.createElement('button');
  el.type = props.type ?? 'button';
  el.className = BLOCK;
  el.appendChild(buildFace(props));

  if (props.ariaLabel) el.setAttribute('aria-label', props.ariaLabel);
  if (props.fullWidth) el.classList.add(`${BLOCK}--full-width`);

  applyVariant(el, props.variant ?? 'primary');
  applyState(el, props.state ?? 'idle');

  return wireInstance(el, props);
}

/**
 * Upgrade existing server-rendered button markup to a typed Kosmo button.
 *
 * Expects either:
 *   `<button class="kosmo-btn kosmo-btn--pink"><span class="kosmo-btn-face">Label</span></button>`
 * or a plain `<button>` whose inner text becomes the label.
 */
export function enhanceButton(
  el: HTMLButtonElement,
  props: Partial<ButtonProps> = {},
): ButtonInstance {
  el.classList.add(BLOCK);

  const inferredVariant = BUTTON_VARIANTS.find((v) => el.classList.contains(`${BLOCK}--${v}`));
  const variant = props.variant ?? inferredVariant ?? 'primary';

  let face = el.querySelector<HTMLElement>(`.${BLOCK}-face`);
  if (!face) {
    const text = el.textContent?.trim() ?? '';
    el.textContent = '';
    face = buildFace({ ...props, label: props.label ?? text });
    el.appendChild(face);
  } else if (props.label != null) {
    const labelEl = face.querySelector<HTMLElement>(`.${BLOCK}-label`);
    if (labelEl) labelEl.textContent = props.label;
    else face.textContent = props.label;
  }

  if (!el.type) el.type = props.type ?? 'button';
  if (props.ariaLabel) el.setAttribute('aria-label', props.ariaLabel);
  if (props.fullWidth) el.classList.add(`${BLOCK}--full-width`);

  let inferredState: ButtonState | undefined;
  if (el.classList.contains('is-loading')) inferredState = 'loading';
  else if (el.classList.contains('is-disabled') || el.disabled) inferredState = 'disabled';

  applyVariant(el, variant);
  applyState(el, props.state ?? inferredState ?? 'idle');

  const finalLabel =
    props.label ?? face.querySelector<HTMLElement>(`.${BLOCK}-label`)?.textContent ?? '';

  return wireInstance(el, { ...props, label: finalLabel, variant, state: props.state ?? inferredState ?? 'idle' });
}

function wireInstance(el: HTMLButtonElement, initial: ButtonProps): ButtonInstance {
  let currentClick = initial.onClick ?? null;
  let currentVariant: ButtonVariant = initial.variant ?? 'primary';
  let currentState: ButtonState = initial.state ?? 'idle';

  function clickHandler(e: MouseEvent): void {
    if (currentState !== 'idle') {
      e.preventDefault();
      return;
    }
    currentClick?.(e);
  }
  el.addEventListener('click', clickHandler);

  return {
    el,
    setLabel(label) {
      const labelEl = el.querySelector<HTMLElement>(`.${BLOCK}-label`);
      if (labelEl) labelEl.textContent = label;
    },
    setVariant(variant) {
      currentVariant = variant;
      applyVariant(el, currentVariant);
    },
    setState(state) {
      currentState = state;
      applyState(el, currentState);
    },
    setOnClick(handler) {
      currentClick = handler ?? null;
    },
    destroy() {
      el.removeEventListener('click', clickHandler);
    },
  };
}
