import { lucideIcon, setVariantClass } from '../../utils/dom.ts';
import {
  APP_BAR_ACTION_TONES,
  type AppBarIconAction,
  type AppBarInstance,
  type AppBarProps,
} from './types.ts';

const BLOCK = 'kosmo-app-bar';
const BTN = `${BLOCK}__icon-btn`;

interface BoundAction {
  el: HTMLButtonElement;
  handler?: (e: MouseEvent) => void;
}

function buildIconButton(action: AppBarIconAction): BoundAction {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = BTN;
  setVariantClass(btn, BTN, action.tone ?? 'default', APP_BAR_ACTION_TONES);
  btn.setAttribute('aria-label', action.ariaLabel);

  if (action.hidden) {
    btn.setAttribute('aria-hidden', 'true');
    btn.setAttribute('tabindex', '-1');
    btn.classList.add('is-hidden');
  }

  btn.appendChild(lucideIcon(action.icon));

  let handler: ((e: MouseEvent) => void) | undefined;
  if (action.onClick && !action.hidden) {
    handler = action.onClick;
    btn.addEventListener('click', handler);
  }
  return { el: btn, handler };
}

function buildTitle(title: string | HTMLElement): HTMLElement {
  if (typeof title !== 'string') {
    title.classList.add(`${BLOCK}__title`);
    return title;
  }
  const el = document.createElement('span');
  el.className = `${BLOCK}__title`;
  el.textContent = title;
  return el;
}

/**
 * Create a Kosmo app-bar — a compact horizontal bar with optional leading
 * action, centered title, and trailing actions. Renders as
 * `<div role="toolbar">` so screen-reader users get a single named landmark
 * without conflicting with the implicit landmark roles of `<header>`/`<nav>`.
 */
export function createAppBar(props: AppBarProps): AppBarInstance {
  const el = document.createElement('div');
  el.className = BLOCK;
  el.setAttribute('role', 'toolbar');
  el.setAttribute('aria-label', props.ariaLabel);

  const bound: BoundAction[] = [];

  if (props.leading) {
    const action = buildIconButton(props.leading);
    bound.push(action);
    el.appendChild(action.el);
  }

  let titleEl: HTMLElement | null = null;
  if (props.title !== undefined) {
    titleEl = buildTitle(props.title);
    el.appendChild(titleEl);
  }

  if (props.trailing) {
    for (const action of props.trailing) {
      const built = buildIconButton(action);
      bound.push(built);
      el.appendChild(built.el);
    }
  }

  return {
    el,
    setTitle(next) {
      const replacement = buildTitle(next);
      if (titleEl) {
        titleEl.replaceWith(replacement);
      } else {
        // Insert after leading slot (or at the start if there's none).
        const leadingEl = props.leading ? el.firstElementChild : null;
        if (leadingEl?.nextSibling) el.insertBefore(replacement, leadingEl.nextSibling);
        else el.appendChild(replacement);
      }
      titleEl = replacement;
    },
    destroy() {
      for (const { el: btn, handler } of bound) {
        if (handler) btn.removeEventListener('click', handler);
      }
    },
  };
}

/**
 * Upgrade existing markup. The host element receives the `kosmo-app-bar`
 * class and the toolbar landmark — children are left untouched. Pair with
 * `createAppBar` for new instances.
 */
export function enhanceAppBar(
  el: HTMLElement,
  props: Pick<AppBarProps, 'ariaLabel'>,
): AppBarInstance {
  el.classList.add(BLOCK);
  el.setAttribute('role', 'toolbar');
  el.setAttribute('aria-label', props.ariaLabel);

  return {
    el,
    setTitle(next) {
      const titleEl = el.querySelector<HTMLElement>(`.${BLOCK}__title`);
      if (titleEl) {
        if (typeof next === 'string') titleEl.textContent = next;
        else titleEl.replaceWith(next);
      }
    },
    destroy() {
      // No event listeners attached during enhancement — kept for API symmetry.
    },
  };
}
