# `@kosmo/ui`

A small, typed, vanilla-TypeScript UI library powering the Kosmo prototype.

- **Zero runtime dependencies** — `lucide` is an optional peer.
- **Tokens-first** — every visual decision is a CSS custom property prefixed with `--ks-*`.
- **Two APIs per component** — `createButton(props)` returns a fresh element; `enhanceButton(el)` upgrades server-rendered markup. Pick whichever matches your data flow.
- **Discriminated unions** for variants and states; `// @ts-expect-error` tests guarantee invalid combinations don't compile.
- **Accessibility baked in** — semantic HTML, visible focus rings, keyboard-navigable, `prefers-reduced-motion` respected.

## Install

```bash
npm install @kosmo/ui lucide
```

(`lucide` only required if you use components that render icons.)

## Quickstart

```ts
import '@kosmo/ui/styles.css';
import { createButton, createInput } from '@kosmo/ui';

const email = createInput({ label: 'Email', type: 'email' });
const submit = createButton({ label: 'Sign in', variant: 'pink', fullWidth: true });

document.body.append(email.el, submit.el);
```

## Components

| Component  | Module                       | Docs                                  |
| ---------- | ---------------------------- | ------------------------------------- |
| `Button`   | `@kosmo/ui` → `createButton` | [`button/README.md`](./src/components/button/README.md)         |
| `Input`    | `@kosmo/ui` → `createInput`  | [`input/README.md`](./src/components/input/README.md)           |
| `TabBar`   | `@kosmo/ui` → `createTabBar` | [`tab-bar/README.md`](./src/components/tab-bar/README.md)       |
| `ListItem` | `@kosmo/ui` → `createListItem` | [`list-item/README.md`](./src/components/list-item/README.md) |
| `Search`   | `@kosmo/ui` → `createSearch` | [`search/README.md`](./src/components/search/README.md)         |
| `SubHeader`| `@kosmo/ui` → `createSubHeader` | [`sub-header/README.md`](./src/components/sub-header/README.md) |

## Tokens

```ts
import { color, space, radius, motionDuration, motionEase } from '@kosmo/ui/tokens';

element.style.background = color('pageBg');
element.style.padding = space('4');
```

The full CSS token set ships in `@kosmo/ui/styles.css` (re-exported from the JS barrel) and can also be imported standalone via `@kosmo/ui/tokens.css`.

### Per-page palettes

Override the `--ks-page-color-*` variables at a page root:

```css
[data-page='favourites'] {
  --ks-page-color-bg: #fff7f8;
  --ks-page-color-accent: #ce6772;
  --ks-page-color-tab-indicator: #ce6772;
}
```

Components automatically pick up the overrides because they reference these semantic tokens (not raw hex values).

## Scripts

```bash
npm test          # vitest + type-level tests
npm run typecheck # tsc --noEmit
npm run build     # vite library build + .d.ts emission
```

## Architecture

```
src/
├── tokens/              colour, type, space, radius, motion, shadow + typed maps
├── utils/               internal helpers (no public exports)
├── components/
│   ├── button/          types + styles + factory + tests + README
│   ├── input/           …
│   ├── tab-bar/         …
│   ├── list-item/       …
│   ├── search/          …
│   └── sub-header/      …
├── index.ts             public barrel
└── index.css            single-import stylesheet
```

See the root [`CHANGELOG.md`](./CHANGELOG.md) for release history.
