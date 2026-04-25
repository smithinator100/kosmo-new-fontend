import { lucideIcon, toggleClass } from '../../utils/dom.ts';
import type { SearchInstance, SearchProps } from './types.ts';

const BLOCK = 'kosmo-search';

/**
 * Create a Kosmo search field.
 *
 * Renders a `<form role="search">` containing the input and a clear button so
 * Enter naturally submits and screen-reader users land in a search landmark.
 */
export function createSearch(props: SearchProps = {}): SearchInstance {
  const form = document.createElement('form');
  form.className = BLOCK;
  form.setAttribute('role', 'search');
  form.setAttribute('action', '#');

  const input = document.createElement('input');
  input.type = 'search';
  input.className = `${BLOCK}-field`;
  input.placeholder = props.placeholder ?? 'Search';
  if (props.value) input.value = props.value;
  input.setAttribute('aria-label', props.ariaLabel ?? props.placeholder ?? 'Search');

  const iconWrap = document.createElement('span');
  iconWrap.className = `${BLOCK}-icon`;
  iconWrap.appendChild(lucideIcon('search'));

  const clear = document.createElement('button');
  clear.type = 'button';
  clear.className = `${BLOCK}-clear`;
  clear.setAttribute('aria-label', 'Clear search');
  clear.appendChild(lucideIcon('x'));

  form.append(input, iconWrap, clear);

  return wireInstance(form, input, clear, props);
}

/** Upgrade existing markup. */
export function enhanceSearch(
  el: HTMLElement,
  props: Partial<SearchProps> = {},
): SearchInstance {
  el.classList.add(BLOCK);
  if (el.tagName === 'FORM') el.setAttribute('role', 'search');
  const input = el.querySelector<HTMLInputElement>(`.${BLOCK}-field`);
  if (!input) throw new Error('[kosmo-ui] enhanceSearch: missing .kosmo-search-field child.');
  let clear = el.querySelector<HTMLButtonElement>(`.${BLOCK}-clear`);
  if (!clear) {
    clear = document.createElement('button');
    clear.type = 'button';
    clear.className = `${BLOCK}-clear`;
    clear.setAttribute('aria-label', 'Clear search');
    clear.appendChild(lucideIcon('x'));
    el.appendChild(clear);
  }
  if (props.value != null) input.value = props.value;
  if (props.placeholder != null) input.placeholder = props.placeholder;
  return wireInstance(el, input, clear, props);
}

function wireInstance(
  root: HTMLElement,
  field: HTMLInputElement,
  clearBtn: HTMLButtonElement,
  props: Partial<SearchProps>,
): SearchInstance {
  function syncHasText(): void {
    toggleClass(root, 'has-text', field.value.length > 0);
  }
  syncHasText();

  function onInput(e: Event): void {
    syncHasText();
    props.onChange?.(field.value, e);
  }
  function onFocus(): void {
    root.classList.add('is-focused');
  }
  function onBlur(): void {
    root.classList.remove('is-focused');
  }
  function onClear(): void {
    field.value = '';
    syncHasText();
    field.focus();
    props.onClear?.();
    props.onChange?.('', new Event('input'));
  }
  function onSubmit(e: Event): void {
    e.preventDefault();
    props.onSubmit?.(field.value);
  }

  field.addEventListener('input', onInput);
  field.addEventListener('focus', onFocus);
  field.addEventListener('blur', onBlur);
  clearBtn.addEventListener('click', onClear);
  root.addEventListener('submit', onSubmit);

  return {
    el: root,
    field,
    getValue: () => field.value,
    setValue(v) {
      field.value = v;
      syncHasText();
    },
    clear: onClear,
    focus: () => field.focus(),
    blur: () => field.blur(),
    destroy() {
      field.removeEventListener('input', onInput);
      field.removeEventListener('focus', onFocus);
      field.removeEventListener('blur', onBlur);
      clearBtn.removeEventListener('click', onClear);
      root.removeEventListener('submit', onSubmit);
    },
  };
}
