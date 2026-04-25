# Button

Depth-stack button: a coloured **face** stacked above a darker **depth** rim, with a layered overlay for hover and a press animation that "sinks" the face into the depth.

## Usage

```ts
import { createButton } from '@kosmo/ui';

const btn = createButton({
  label: 'Sign in',
  variant: 'pink',
  onClick: () => console.log('click'),
});

document.body.appendChild(btn.el);

btn.setState('loading');
```

To upgrade existing markup:

```ts
import { enhanceButton } from '@kosmo/ui';

const el = document.querySelector<HTMLButtonElement>('.kosmo-btn--yellow')!;
enhanceButton(el, { onClick: handleSubmit });
```

## Props

| Prop        | Type                                                          | Default   | Description                                                          |
| ----------- | ------------------------------------------------------------- | --------- | -------------------------------------------------------------------- |
| `label`     | `string`                                                      | required  | Visible label text.                                                  |
| `variant`   | `'primary' \| 'pink' \| 'yellow' \| 'outline'`                | `primary` | Visual style. New variants must be registered in `BUTTON_VARIANTS`.  |
| `state`     | `'idle' \| 'loading' \| 'disabled'`                           | `idle`    | Activity state. `loading` shows a spinner and blocks pointer events. |
| `type`      | `'button' \| 'submit' \| 'reset'`                             | `button`  | Native form-button type.                                             |
| `iconLeft`  | `LucideIconName`                                              | —         | Lucide icon shown before the label.                                  |
| `iconRight` | `LucideIconName`                                              | —         | Lucide icon shown after the label.                                   |
| `ariaLabel` | `string`                                                      | —         | Override the accessible name (use for icon-only buttons).            |
| `fullWidth` | `boolean`                                                     | `false`   | Stretch to fill the parent.                                          |
| `onClick`   | `(e: MouseEvent) => void`                                     | —         | Click handler. Suppressed while `loading`/`disabled`.                |

## Instance API

```ts
btn.setLabel('New label');
btn.setVariant('outline');
btn.setState('loading');
btn.setOnClick(null); // detach
btn.destroy();
```

## Accessibility

- Renders a real `<button>` — fully keyboard-activatable (`Enter` and `Space`).
- Visible focus ring via `--ks-color-focus-ring` and `:focus-visible`.
- Sets `aria-busy="true"` when in `loading` state.
- Sets `disabled` and `aria-disabled` when in `disabled` state; suppresses the click handler.
- Use `ariaLabel` for icon-only buttons; visible `label` is still required as the source of truth.

## Limitations

- Animation duration is tied to `--ks-motion-duration-instant`. If you need a slower press animation, override the token at the page level rather than per button.
