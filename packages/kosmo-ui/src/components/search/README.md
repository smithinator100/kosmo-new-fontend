# Search

Compact search field with a leading magnifier icon and a clear button that appears once text is entered.

## Usage

```ts
import { createSearch } from '@kosmo/ui';

const s = createSearch({
  placeholder: 'Search plugins',
  onChange(value) { filter(value); },
  onSubmit(value) { runSearch(value); },
});

document.body.appendChild(s.el);
```

## Props

| Prop          | Type                            | Default  | Description                              |
| ------------- | ------------------------------- | -------- | ---------------------------------------- |
| `placeholder` | `string`                        | `Search` | Placeholder text + accessible name fallback. |
| `value`       | `string`                        | `''`     | Initial value.                           |
| `ariaLabel`   | `string`                        | placeholder | Accessible name for the input.        |
| `onChange`    | `(value, event) => void`        | —        | Fires on every input event.              |
| `onSubmit`    | `(value) => void`               | —        | Fires on Enter / form submit.            |
| `onClear`     | `() => void`                    | —        | Fires when the clear button is pressed.  |

## Accessibility

- Renders a `<form role="search">` so screen-reader users can land in the search landmark.
- `<input type="search">` for native semantics.
- Clear button has a permanent `aria-label="Clear search"`.
- Pressing Enter submits naturally without triggering page navigation.

## Limitations

- Does not debounce — wrap `onChange` in your own debounce helper for live search.
