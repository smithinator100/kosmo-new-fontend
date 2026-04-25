import { toggleClass } from '../../utils/dom.ts';
import type { TabBarInstance, TabBarProps, TabItem } from './types.ts';

const BLOCK = 'kosmo-tab-bar';
const ITEM = 'kosmo-tab';

function buildTab(item: TabItem, isActive: boolean): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = ITEM;
  btn.textContent = item.label;
  btn.dataset.tabId = item.id;
  btn.setAttribute('role', 'tab');
  btn.setAttribute('aria-selected', String(isActive));
  btn.tabIndex = isActive ? 0 : -1;
  if (item.disabled) {
    btn.disabled = true;
    btn.classList.add('is-disabled');
  }
  if (isActive) btn.classList.add('is-active');
  return btn;
}

/**
 * Create a Kosmo tab bar.
 *
 * Implements the WAI-ARIA tabs pattern:
 *   - role="tablist" container
 *   - role="tab" buttons with `aria-selected`
 *   - Left/Right arrow keyboard navigation
 *   - Roving tabindex
 */
export function createTabBar(props: TabBarProps): TabBarInstance {
  const el = document.createElement('div');
  el.className = BLOCK;
  el.setAttribute('role', 'tablist');
  if (props.ariaLabel) el.setAttribute('aria-label', props.ariaLabel);

  return wireInstance(el, props);
}

/** Upgrade an existing `<div class="kosmo-tab-bar">` to a typed instance. */
export function enhanceTabBar(
  el: HTMLElement,
  props: Partial<TabBarProps> = {},
): TabBarInstance {
  el.classList.add(BLOCK);
  el.setAttribute('role', 'tablist');
  if (props.ariaLabel) el.setAttribute('aria-label', props.ariaLabel);

  const items: TabItem[] = props.items
    ? [...props.items]
    : Array.from(el.querySelectorAll<HTMLElement>(`.${ITEM}`)).map((node, i) => ({
        id: node.dataset.tabId ?? node.dataset.protoTab ?? `tab-${i}`,
        label: node.textContent?.trim() ?? `Tab ${i + 1}`,
        disabled: node.hasAttribute('disabled'),
      }));

  let activeId = props.activeId;
  if (!activeId) {
    const activeNode = el.querySelector<HTMLElement>(`.${ITEM}.is-active, .${ITEM}.active`);
    activeId = activeNode?.dataset.tabId ?? activeNode?.dataset.protoTab ?? items[0]?.id;
  }

  return wireInstance(el, { items, activeId, onChange: props.onChange });
}

function wireInstance(el: HTMLElement, initial: TabBarProps): TabBarInstance {
  let items: readonly TabItem[] = initial.items;
  let activeId: string =
    initial.activeId && items.some((it) => it.id === initial.activeId)
      ? initial.activeId
      : items.find((it) => !it.disabled)?.id ?? items[0]?.id ?? '';
  let onChange = initial.onChange;

  function render(): void {
    el.textContent = '';
    for (const item of items) {
      el.appendChild(buildTab(item, item.id === activeId));
    }
  }

  function setActiveInternal(id: string, fireEvent: boolean): void {
    const item = items.find((it) => it.id === id);
    if (!item || item.disabled) return;
    activeId = id;
    for (const node of el.querySelectorAll<HTMLButtonElement>(`.${ITEM}`)) {
      const isActive = node.dataset.tabId === id;
      toggleClass(node, 'is-active', isActive);
      node.setAttribute('aria-selected', String(isActive));
      node.tabIndex = isActive ? 0 : -1;
    }
    if (fireEvent) onChange?.(id, item);
  }

  function handleClick(e: MouseEvent): void {
    const target = e.target as HTMLElement | null;
    const tab = target?.closest<HTMLElement>(`.${ITEM}`);
    if (!tab || !el.contains(tab) || tab.hasAttribute('disabled')) return;
    const id = tab.dataset.tabId;
    if (id) setActiveInternal(id, true);
  }

  function handleKeyDown(e: KeyboardEvent): void {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    const enabled = items.filter((it) => !it.disabled);
    if (enabled.length === 0) return;
    const currentIndex = enabled.findIndex((it) => it.id === activeId);
    let nextIndex = currentIndex;
    if (e.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + enabled.length) % enabled.length;
    if (e.key === 'ArrowRight') nextIndex = (currentIndex + 1) % enabled.length;
    if (e.key === 'Home') nextIndex = 0;
    if (e.key === 'End') nextIndex = enabled.length - 1;
    const next = enabled[nextIndex];
    if (next) {
      setActiveInternal(next.id, true);
      el.querySelector<HTMLButtonElement>(`.${ITEM}[data-tab-id="${next.id}"]`)?.focus();
    }
  }

  render();
  el.addEventListener('click', handleClick);
  el.addEventListener('keydown', handleKeyDown);

  return {
    el,
    getActiveId: () => activeId,
    setActive(id) {
      setActiveInternal(id, false);
    },
    setItems(next) {
      items = next;
      if (!items.some((it) => it.id === activeId)) {
        activeId = items.find((it) => !it.disabled)?.id ?? items[0]?.id ?? '';
      }
      render();
    },
    destroy() {
      el.removeEventListener('click', handleClick);
      el.removeEventListener('keydown', handleKeyDown);
    },
  };
}
