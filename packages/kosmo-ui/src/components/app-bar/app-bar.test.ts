import { describe, expect, it, vi } from 'vitest';
import { createAppBar, enhanceAppBar } from './app-bar.ts';

describe('createAppBar', () => {
  it('renders a toolbar landmark with the supplied aria-label', () => {
    const bar = createAppBar({ ariaLabel: 'Plugin actions', title: 'v1.0' });
    expect(bar.el.tagName).toBe('DIV');
    expect(bar.el.getAttribute('role')).toBe('toolbar');
    expect(bar.el.getAttribute('aria-label')).toBe('Plugin actions');
    expect(bar.el.classList.contains('kosmo-app-bar')).toBe(true);
  });

  it('renders a string title in the centered slot', () => {
    const bar = createAppBar({ ariaLabel: 'a', title: 'v1.0' });
    const title = bar.el.querySelector<HTMLElement>('.kosmo-app-bar__title');
    expect(title).not.toBeNull();
    expect(title!.textContent).toBe('v1.0');
  });

  it('renders an HTMLElement title and tags it', () => {
    const node = document.createElement('span');
    node.textContent = 'Custom';
    const bar = createAppBar({ ariaLabel: 'a', title: node });
    expect(node.classList.contains('kosmo-app-bar__title')).toBe(true);
    expect(bar.el.contains(node)).toBe(true);
  });

  it('renders leading + trailing icon actions in DOM order', () => {
    const bar = createAppBar({
      ariaLabel: 'Plugin actions',
      leading: { icon: 'chevron-left', ariaLabel: 'Back' },
      title: 'v1.0',
      trailing: [
        { icon: 'star', ariaLabel: 'Favourite', tone: 'favourite' },
        { icon: 'trash-2', ariaLabel: 'Delete' },
      ],
    });
    const buttons = bar.el.querySelectorAll<HTMLButtonElement>('button.kosmo-app-bar__icon-btn');
    expect(buttons.length).toBe(3);
    expect(buttons[0]?.getAttribute('aria-label')).toBe('Back');
    expect(buttons[1]?.getAttribute('aria-label')).toBe('Favourite');
    expect(buttons[1]?.classList.contains('kosmo-app-bar__icon-btn--favourite')).toBe(true);
    expect(buttons[2]?.getAttribute('aria-label')).toBe('Delete');
  });

  it('fires onClick handlers on action buttons', () => {
    const onBack = vi.fn();
    const onDelete = vi.fn();
    const bar = createAppBar({
      ariaLabel: 'Plugin actions',
      leading: { icon: 'chevron-left', ariaLabel: 'Back', onClick: onBack },
      trailing: [{ icon: 'trash-2', ariaLabel: 'Delete', onClick: onDelete }],
    });
    const [back, del] = bar.el.querySelectorAll<HTMLButtonElement>('button');
    back!.click();
    del!.click();
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('hidden spacer slots are inert (aria-hidden + tabindex=-1) and ignore clicks', () => {
    const onClick = vi.fn();
    const bar = createAppBar({
      ariaLabel: 'Plugin actions',
      trailing: [{ icon: 'chevron-left', ariaLabel: '', hidden: true, onClick }],
    });
    const btn = bar.el.querySelector<HTMLButtonElement>('button.kosmo-app-bar__icon-btn');
    expect(btn?.getAttribute('aria-hidden')).toBe('true');
    expect(btn?.getAttribute('tabindex')).toBe('-1');
    expect(btn?.classList.contains('is-hidden')).toBe(true);
    btn!.click();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('updates the title via setTitle', () => {
    const bar = createAppBar({ ariaLabel: 'a', title: 'v1.0' });
    bar.setTitle('v2.0');
    const title = bar.el.querySelector<HTMLElement>('.kosmo-app-bar__title');
    expect(title?.textContent).toBe('v2.0');
  });

  it('destroy detaches click handlers', () => {
    const onClick = vi.fn();
    const bar = createAppBar({
      ariaLabel: 'a',
      leading: { icon: 'chevron-left', ariaLabel: 'Back', onClick },
    });
    const btn = bar.el.querySelector<HTMLButtonElement>('button')!;
    bar.destroy();
    btn.click();
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('enhanceAppBar', () => {
  it('upgrades existing markup with the toolbar landmark', () => {
    const el = document.createElement('div');
    enhanceAppBar(el, { ariaLabel: 'Plugin actions' });
    expect(el.classList.contains('kosmo-app-bar')).toBe(true);
    expect(el.getAttribute('role')).toBe('toolbar');
    expect(el.getAttribute('aria-label')).toBe('Plugin actions');
  });
});
