/**
 * Internal DOM helpers. Not part of the public API.
 */

export function setAttr(el: Element, name: string, value: string | null): void {
  if (value === null) {
    el.removeAttribute(name);
    return;
  }
  el.setAttribute(name, value);
}

/** Add or remove a class based on a boolean. */
export function toggleClass(el: Element, name: string, on: boolean): void {
  el.classList.toggle(name, on);
}

/** Replace a class within a known set of variants. */
export function setVariantClass(
  el: Element,
  prefix: string,
  variant: string,
  knownVariants: readonly string[],
): void {
  for (const v of knownVariants) el.classList.remove(`${prefix}--${v}`);
  el.classList.add(`${prefix}--${variant}`);
}

/** Set or remove a `data-*` attribute. */
export function setData(el: HTMLElement, key: string, value: string | null): void {
  if (value === null) {
    delete el.dataset[key];
    return;
  }
  el.dataset[key] = value;
}

/** Render a Lucide icon placeholder element (`<i data-lucide="…">`). */
export function lucideIcon(name: string): HTMLElement {
  const i = document.createElement('i');
  i.setAttribute('data-lucide', name);
  return i;
}
