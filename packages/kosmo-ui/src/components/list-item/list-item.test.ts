import { describe, expect, it, vi } from 'vitest';
import { createListItem } from './list-item.ts';

describe('createListItem', () => {
  it('renders a div by default', () => {
    const it1 = createListItem({ label: 'Layout', icon: 'layout-grid' });
    expect(it1.el.tagName).toBe('DIV');
    expect(it1.el.classList.contains('kosmo-list-item')).toBe(true);
    expect(it1.el.classList.contains('kosmo-list-item--default')).toBe(true);
  });

  it('renders a button when interactive or onClick is set', () => {
    const onClick = vi.fn();
    const item = createListItem({ label: 'Run', icon: 'play', onClick });
    expect(item.el.tagName).toBe('BUTTON');
    item.el.dispatchEvent(new MouseEvent('click'));
    expect(onClick).toHaveBeenCalled();
  });

  it('attaches a trailing action with stopped propagation', () => {
    const onAction = vi.fn();
    const onClick = vi.fn();
    const item = createListItem({
      label: 'Layout',
      icon: 'layout-grid',
      action: { icon: 'settings-2', ariaLabel: 'Settings', onClick: onAction },
      onClick,
    });
    const action = item.el.querySelector<HTMLButtonElement>('.kosmo-list-item-action');
    expect(action).not.toBeNull();
    action!.click();
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('switches tone via setTone', () => {
    const item = createListItem({ label: 'Delete' });
    item.setTone('danger');
    expect(item.el.classList.contains('kosmo-list-item--danger')).toBe(true);
  });
});
