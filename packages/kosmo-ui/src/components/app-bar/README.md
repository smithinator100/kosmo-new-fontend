# AppBar

Compact horizontal bar — leading action · centered title · trailing actions.
Designed for plugin/page chrome (e.g. the bar at the top of `Plugin Content`
in the prototype) but reusable anywhere a small toolbar is needed.

Renders as `<div role="toolbar">` so screen-reader users get a single named
landmark with the supplied `aria-label` describing its scope. (A plain `div`
is used rather than `<header>`/`<nav>` to avoid clashing with the implicit
landmark roles those elements carry.)

## Usage

```ts
import { createAppBar } from '@kosmo/ui';

const bar = createAppBar({
  ariaLabel: 'Plugin actions',
  leading: { icon: 'chevron-left', ariaLabel: 'Back', onClick: () => history.back() },
  title: 'v1.0',
  trailing: [
    { icon: 'star', ariaLabel: 'Remove from favourites', tone: 'favourite' },
    { icon: 'trash-2', ariaLabel: 'Delete plugin' },
  ],
});

document.body.appendChild(bar.el);
```

To keep the centered title optically centered when only one side has actions,
pass a hidden spacer:

```ts
createAppBar({
  ariaLabel: 'Plugin actions',
  leading: { icon: 'chevron-left', ariaLabel: 'Back' },
  title: 'v1.0',
  trailing: [{ icon: 'chevron-left', ariaLabel: '', hidden: true }],
});
```

## Props

| Prop        | Type                          | Required | Description                                                       |
| ----------- | ----------------------------- | -------- | ----------------------------------------------------------------- |
| `ariaLabel` | `string`                      | Required | Landmark label for the `toolbar` (e.g. `"Plugin actions"`).       |
| `title`     | `string \| HTMLElement`       | Optional | Centered label — typically a version string or page name.         |
| `leading`   | `AppBarIconAction`            | Optional | Single leading icon action. Usually `chevron-left`.               |
| `trailing`  | `readonly AppBarIconAction[]` | Optional | Trailing icon actions, rendered left-to-right.                    |

### `AppBarIconAction`

| Prop        | Type                                  | Required | Description                                                                       |
| ----------- | ------------------------------------- | -------- | --------------------------------------------------------------------------------- |
| `icon`      | `LucideIconName`                      | Required | Lucide icon name.                                                                 |
| `ariaLabel` | `string`                              | Required | Required label — every icon-only button must announce its purpose.                |
| `tone`      | `'default' \| 'favourite'`            | Optional | `'favourite'` fills the icon yellow (uses `--ks-color-favourite-*` tokens).       |
| `onClick`   | `(e: MouseEvent) => void`             | Optional | Click handler.                                                                    |
| `hidden`    | `boolean`                             | Optional | Render invisibly as a layout spacer; the slot becomes inert (`tabindex="-1"`).    |

## Accessibility

- `<div role="toolbar">` with required `aria-label` so the bar is a single
  named landmark.
- Every icon-only button requires an `ariaLabel`.
- Hidden spacer slots are marked `aria-hidden="true"` and removed from the
  tab order so they're invisible to assistive tech.
- Focus state uses the global `--ks-focus-ring` token (visible on
  `:focus-visible`).
- Tap targets are larger than the 20px icon — the 4px padding plus the
  icon's own click area satisfies the 24px minimum on touch.

## Tokens used

Backgrounds: `--ks-page-color-bg` (with `--ks-color-surface` fallback).
Spacing: `--ks-space-1`, `--ks-space-2-5`, `--ks-space-3`, `--ks-space-5`.
Radius: `--ks-radius-sm`. Hover ink: `--ks-color-ink-whisper`. Focus:
`--ks-color-focus-ring`. Favourite tone: `--ks-color-favourite-fill`,
`--ks-color-favourite-stroke`.
