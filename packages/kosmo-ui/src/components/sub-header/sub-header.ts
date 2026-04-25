import type { SubHeaderInstance, SubHeaderProps } from './types.ts';

const BLOCK = 'kosmo-sub-header';

export function createSubHeader(props: SubHeaderProps): SubHeaderInstance {
  const tag = props.as ?? 'h3';
  const el = document.createElement(tag);
  el.className = BLOCK;
  el.textContent = props.label;
  return {
    el,
    setLabel(label) {
      el.textContent = label;
    },
    destroy() {
      // No event listeners to clean up — kept for API symmetry.
    },
  };
}

export function enhanceSubHeader(
  el: HTMLElement,
  props: Partial<SubHeaderProps> = {},
): SubHeaderInstance {
  el.classList.add(BLOCK);
  if (props.label != null) el.textContent = props.label;
  return {
    el,
    setLabel(label) {
      el.textContent = label;
    },
    destroy() {},
  };
}
