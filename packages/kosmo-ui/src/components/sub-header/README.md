# SubHeader

Uppercase eyebrow used to label sections within a list (e.g. between groups of `ListItem`s).

## Usage

```ts
import { createSubHeader } from '@kosmo/ui';

const sh = createSubHeader({ label: 'Copy design styles' });
```

## Props

| Prop    | Type                          | Default | Description                                                |
| ------- | ----------------------------- | ------- | ---------------------------------------------------------- |
| `label` | `string`                      | required| Visible label.                                             |
| `as`    | `'h2' \| 'h3' \| 'h4' \| 'div'` | `h3`  | Heading level. Use `div` only when purely decorative.      |

## Accessibility

- Renders a real heading element by default so screen-reader users can navigate sections via the headings list.
- Uppercase styling is applied via CSS (`text-transform: uppercase`) — keep the underlying string in natural case so screen readers don't spell it out.
