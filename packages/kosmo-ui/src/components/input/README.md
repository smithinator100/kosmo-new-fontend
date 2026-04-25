# Input

Depth-stack input control with `default` (single line) and `large` (multi-line textarea) variants. Tracks focus and error states automatically.

## Usage

```ts
import { createInput } from '@kosmo/ui';

const email = createInput({
  label: 'Email',
  placeholder: 'you@example.com',
  type: 'email',
  onChange(value) { console.log(value); },
});

document.body.appendChild(email.el);

email.setError(true);   // error state — sticky across focus
email.focus();
```

To upgrade existing HTML (e.g. server-rendered):

```ts
import { enhanceInput } from '@kosmo/ui';

document.querySelectorAll<HTMLElement>('.kosmo-input').forEach((el) => enhanceInput(el));
```

## Props

| Prop             | Type                                             | Default   | Description                                                                |
| ---------------- | ------------------------------------------------ | --------- | -------------------------------------------------------------------------- |
| `label`          | `string`                                         | —         | Accessible label. One of `label` / `ariaLabel` / `ariaLabelledBy` required.|
| `value`          | `string`                                         | `''`      | Initial value.                                                             |
| `placeholder`    | `string`                                         | —         | Placeholder text.                                                          |
| `variant`        | `'default' \| 'large'`                           | `default` | `large` swaps the input for a multi-line textarea.                         |
| `state`          | `'idle' \| 'focused' \| 'error'`                 | `idle`    | Force a state — usually unnecessary; focus is auto-tracked.                |
| `type`           | `'text' \| 'email' \| 'password' \| ...`         | `text`    | Native input type. Ignored for `large`.                                    |
| `inputMode`      | `'text' \| 'numeric' \| ...`                     | —         | Mobile keyboard hint.                                                      |
| `maxLength`      | `number`                                         | —         | Native maxlength.                                                          |
| `rows`           | `number`                                         | `6`       | Textarea rows (only for `large`).                                          |
| `trailingIcon`   | `LucideIconName`                                 | —         | Icon shown when the field has text.                                        |
| `disabled`       | `boolean`                                        | `false`   | Disable the field.                                                         |
| `readOnly`       | `boolean`                                        | `false`   | Read-only.                                                                 |
| `onChange`       | `(value, event) => void`                         | —         | Fires on every input event.                                                |

## Instance API

```ts
input.getValue();
input.setValue('hello');
input.setVariant('large');
input.setState('error');
input.setError(true);
input.setDisabled(true);
input.focus();
input.blur();
input.destroy();
```

## Accessibility

- Renders a real `<input>` (or `<textarea>` for `large`) inside a `<label>` element so the entire face is clickable and the label is programmatically associated with the field.
- Auto-generates a unique `id` per input.
- Error state surfaces purely visually — pair with a separate `aria-describedby` message element when used in forms.
- Focus state is reflected via `:focus-within` so it works even without JS.
- Inherits the focus ring token from `--ks-color-focus-ring`.

## Limitations

- The component does not own validation logic. Wire your validators externally and call `setError(true)` to flip the state.
- `large` always renders a `<textarea>`; switching variants on a live instance via `setVariant('large')` keeps the existing element type — re-create the input if you need to swap underlying elements.
