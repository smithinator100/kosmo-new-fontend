# TabBar

Horizontal tab bar with an active underline. Implements the WAI-ARIA tabs pattern.

## Usage

```ts
import { createTabBar } from '@kosmo/ui';

const bar = createTabBar({
  ariaLabel: 'Plugin frame',
  items: [
    { id: 'favourites', label: 'Favourites' },
    { id: 'plugins', label: 'Plugins' },
    { id: 'tools', label: 'Tools' },
    { id: 'settings', label: 'Settings' },
  ],
  activeId: 'plugins',
  onChange(id) { console.log('switched to', id); },
});
```

## Props

| Prop        | Type                              | Default      | Description                                            |
| ----------- | --------------------------------- | ------------ | ------------------------------------------------------ |
| `items`     | `readonly TabItem[]`              | required     | Each item: `{ id, label, disabled? }`.                 |
| `activeId`  | `string`                          | first enabled| Initial selection.                                     |
| `ariaLabel` | `string`                          | —            | `aria-label` for the `<div role="tablist">`.           |
| `onChange`  | `(id, item) => void`              | —            | Called when the user (not `setActive`) changes tabs.   |

## Active indicator color

The underline color uses `--ks-page-color-tab-indicator`. Override it at the page root for per-page palettes:

```css
[data-page='favourites'] {
  --ks-page-color-tab-indicator: #ce6772;
}
```

## Accessibility

- `role="tablist"` container, `role="tab"` buttons.
- `aria-selected` mirrors active state.
- Roving `tabindex` — only the active tab is in the tab order.
- Arrow Left / Right / Home / End cycle selection (skipping disabled tabs).
- Visible focus ring via `:focus-visible`.

## Limitations

- This component does not own panel switching — pair it with `aria-controls` on the tabs and a separate panel toggler if you have associated content.
