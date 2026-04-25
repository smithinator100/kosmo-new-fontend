# ListItem

Single row in a list: optional **leading icon** · **label** · optional **trailing action**.

## Usage

```ts
import { createListItem } from '@kosmo/ui';

const layout = createListItem({
  label: 'Layout',
  icon: 'layout-grid',
  action: { icon: 'settings-2', ariaLabel: 'Configure layout' },
  onClick() { console.log('open layout'); },
});

document.body.appendChild(layout.el);
```

## Props

| Prop          | Type                                  | Default   | Description                                                                  |
| ------------- | ------------------------------------- | --------- | ---------------------------------------------------------------------------- |
| `label`       | `string`                              | required  | Visible label.                                                               |
| `icon`        | `LucideIconName`                      | —         | Leading Lucide icon.                                                         |
| `tone`        | `'default' \| 'danger'`               | `default` | Use `danger` for destructive copy (e.g. "Delete account").                   |
| `action`      | `{ icon, ariaLabel, onClick? }`       | —         | Trailing icon button. Stops propagation so it never triggers the row click.  |
| `onClick`     | `(MouseEvent) => void`                | —         | Make the whole row clickable; switches the underlying element to `<button>`. |
| `interactive` | `boolean`                             | inferred  | Force `<button>` rendering even without `onClick`.                           |

## Accessibility

- Renders as `<button>` when interactive — fully keyboard-activatable.
- Trailing action is a real `<button>` with a required `ariaLabel`.
- Visible focus ring on both the row and the action.
- The `danger` tone communicates only colour — pair with explicit copy ("Delete…") for screen readers.

## Limitations

- Trailing action's click handler is wrapped to call `stopPropagation()` so the row click does not fire. Use the row's `onClick` for navigation and the action for an alternate operation.
