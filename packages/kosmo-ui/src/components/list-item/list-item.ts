import { lucideIcon, setVariantClass } from '../../utils/dom.ts';
import {
  LIST_ITEM_TONES,
  type ListItemAction,
  type ListItemInstance,
  type ListItemProps,
  type ListItemTone,
} from './types.ts';

const BLOCK = 'kosmo-list-item';

function buildAction(action: ListItemAction): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `${BLOCK}-action`;
  btn.setAttribute('aria-label', action.ariaLabel);
  btn.appendChild(lucideIcon(action.icon));
  if (action.onClick) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      action.onClick?.(e);
    });
  }
  return btn;
}

/**
 * Create a Kosmo list item.
 *
 * Renders as a `<button>` when `interactive` is true (or when `onClick` is set),
 * otherwise renders as a `<div>` so it can host non-interactive content.
 */
export function createListItem(props: ListItemProps): ListItemInstance {
  const interactive = props.interactive ?? Boolean(props.onClick);
  const el: HTMLElement = interactive
    ? document.createElement('button')
    : document.createElement('div');
  if (interactive) (el as HTMLButtonElement).type = 'button';
  el.className = BLOCK;
  setVariantClass(el, BLOCK, props.tone ?? 'default', LIST_ITEM_TONES);

  if (props.icon) {
    const icon = lucideIcon(props.icon);
    icon.classList.add(`${BLOCK}-icon-leading`);
    el.appendChild(icon);
  }

  const label = document.createElement('span');
  label.className = `${BLOCK}-label`;
  label.textContent = props.label;
  el.appendChild(label);

  if (props.action) el.appendChild(buildAction(props.action));

  let clickHandler: ((e: MouseEvent) => void) | undefined;
  if (props.onClick) {
    clickHandler = props.onClick;
    el.addEventListener('click', clickHandler);
  }

  return {
    el,
    setLabel(text) {
      label.textContent = text;
    },
    setTone(tone) {
      setVariantClass(el, BLOCK, tone, LIST_ITEM_TONES);
    },
    destroy() {
      if (clickHandler) el.removeEventListener('click', clickHandler);
    },
  };
}

/** Upgrade existing markup. */
export function enhanceListItem(
  el: HTMLElement,
  props: Partial<ListItemProps> = {},
): ListItemInstance {
  el.classList.add(BLOCK);
  const tone: ListItemTone = props.tone
    ?? (LIST_ITEM_TONES.find((t) => el.classList.contains(`${BLOCK}--${t}`)) ?? 'default');
  setVariantClass(el, BLOCK, tone, LIST_ITEM_TONES);

  const labelEl = el.querySelector<HTMLElement>(`.${BLOCK}-label`);
  if (labelEl && props.label != null) labelEl.textContent = props.label;

  let clickHandler: ((e: MouseEvent) => void) | undefined;
  if (props.onClick) {
    clickHandler = props.onClick;
    el.addEventListener('click', clickHandler);
  }

  return {
    el,
    setLabel(text) {
      if (labelEl) labelEl.textContent = text;
    },
    setTone(toneNext) {
      setVariantClass(el, BLOCK, toneNext, LIST_ITEM_TONES);
    },
    destroy() {
      if (clickHandler) el.removeEventListener('click', clickHandler);
    },
  };
}
