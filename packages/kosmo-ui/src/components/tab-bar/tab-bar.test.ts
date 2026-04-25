import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTabBar, enhanceTabBar } from './tab-bar.ts';

const items = [
  { id: 'favourites', label: 'Favourites' },
  { id: 'plugins', label: 'Plugins' },
  { id: 'tools', label: 'Tools' },
  { id: 'settings', label: 'Settings' },
];

describe('createTabBar', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders all items with the first as active by default', () => {
    const bar = createTabBar({ items });
    document.body.appendChild(bar.el);
    const tabs = bar.el.querySelectorAll('.kosmo-tab');
    expect(tabs).toHaveLength(items.length);
    expect(bar.getActiveId()).toBe('favourites');
    expect(tabs[0]?.getAttribute('aria-selected')).toBe('true');
  });

  it('respects activeId on construction', () => {
    const bar = createTabBar({ items, activeId: 'tools' });
    expect(bar.getActiveId()).toBe('tools');
  });

  it('changes active on click and fires onChange', () => {
    const onChange = vi.fn();
    const bar = createTabBar({ items, onChange });
    document.body.appendChild(bar.el);
    const tools = bar.el.querySelector<HTMLButtonElement>('[data-tab-id="tools"]')!;
    tools.click();
    expect(bar.getActiveId()).toBe('tools');
    expect(onChange).toHaveBeenCalledWith('tools', expect.objectContaining({ id: 'tools' }));
  });

  it('cycles with arrow keys', () => {
    const bar = createTabBar({ items });
    document.body.appendChild(bar.el);
    bar.el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(bar.getActiveId()).toBe('plugins');
    bar.el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(bar.getActiveId()).toBe('favourites');
    bar.el.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(bar.getActiveId()).toBe('settings');
  });

  it('skips disabled items in keyboard navigation', () => {
    const withDisabled = items.map((it, i) => (i === 1 ? { ...it, disabled: true } : it));
    const bar = createTabBar({ items: withDisabled });
    document.body.appendChild(bar.el);
    bar.el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(bar.getActiveId()).toBe('tools');
  });

  it('does not fire onChange for setActive (programmatic)', () => {
    const onChange = vi.fn();
    const bar = createTabBar({ items, onChange });
    bar.setActive('tools');
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('enhanceTabBar', () => {
  it('infers items + active from existing markup', () => {
    const el = document.createElement('div');
    el.innerHTML = `
      <button class="kosmo-tab" data-proto-tab="a">A</button>
      <button class="kosmo-tab active" data-proto-tab="b">B</button>
    `;
    const bar = enhanceTabBar(el);
    expect(bar.getActiveId()).toBe('b');
  });
});
