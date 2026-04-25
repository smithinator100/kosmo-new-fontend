# Contributing — KOSMO

Practical playbook for adding **components** to `@kosmo/ui` and **pages** to
`apps/prototype`. Distilled from the workflows we've actually used (most
recently: shipping the `AppBar` component for the Plugin Content page).

If you only read one rule, read this:

> **Reuse first. If you must build something new, build it inside
> `@kosmo/ui` and make it use existing tokens. Never hardcode a hex,
> spacing, radius, or duration outside `packages/kosmo-ui/src/tokens/`.**

---

## Repo layout

```
packages/kosmo-ui/           # Publishable vanilla-TS UI library (source of truth)
  src/
    tokens/                  # CSS custom-property tokens + typed TS mirror
    components/<name>/       # One folder per primitive
    utils/                   # Internal helpers (dom, types)
  scripts/extract-props.ts   # Regenerates the docs prop tables from types.ts
apps/prototype/              # Barba.js demo app that consumes @kosmo/ui
  shared/sidebar.html        # Shared partial — included via Vite HTML plugin
  styles/pages/<page>.css    # Per-page palette + layout overrides
  src/
    main.ts, barba-init.ts   # Entry + transitions
    app-shell/*              # Page-agnostic enhancers (buttons, inputs, …)
    views/component-docs.ts  # Renders docs pages from a typed EXAMPLES map
.github/workflows/ci.yml     # typecheck · test · build on PR + push to main
```

---

## Decision tree — reuse or build?

Before writing a single new file, run through this in order:

1. **Does an existing `@kosmo/ui` primitive already render this?** Use it.
   Add a new prop or variant to it only if the new behaviour is a natural
   member of the existing API surface.
2. **Can existing tokens cover it?** Check `packages/kosmo-ui/src/tokens/`
   and the typed maps in `tokens/index.ts`. Adding a token costs you two
   files; hardcoding a hex costs you a refactor later.
3. **If a brand new primitive is unavoidable**, scaffold it inside
   `@kosmo/ui` (never inline in a prototype page) and follow the component
   workflow below.

The `AppBar` story is the canonical example: the leading-icon-only minimal
hit target wasn't a `Button` variant (Button's depth/face/border ergonomics
are too heavy), and the favourite-yellow star colours weren't in the token
set — so we added two semantic colour tokens and one new component instead
of inlining hexes into a page CSS file.

---

## Adding a new component to `@kosmo/ui`

### 1. Scaffold

For a component named `app-bar`:

```
packages/kosmo-ui/src/components/app-bar/
  types.ts                  # Props, Instance, union types, JSDoc
  app-bar.ts                # createAppBar + enhanceAppBar
  styles.css                # BEM (.kosmo-app-bar, __element, --modifier)
  index.ts                  # Re-export factory + types + const arrays
  README.md                 # Usage + Props table + Accessibility
  app-bar.test.ts           # Vitest behaviour tests
  app-bar.a11y.test.ts      # axe-core accessibility tests
  app-bar.types.test.ts     # Type-level @ts-expect-error checks
```

### 2. `types.ts` rules

- One `XxxProps` interface (the prop-extractor finds it by name — see
  `scripts/extract-props.ts`).
- One `XxxInstance` interface — always exposes `readonly el: HTMLElement`,
  any setters, and `destroy(): void`.
- Variant unions are `'a' | 'b'` strings, mirrored by a `XXX_VARIANTS`
  `readonly` const array (so the docs page can iterate them at runtime).
- Every prop gets a JSDoc summary. Use `@default` for defaulted optionals —
  the prop-extractor surfaces it in the docs table.
- **Required props for icon-only buttons**: every icon-only action interface
  must require an `ariaLabel: string`. Type-enforce it.

### 3. `<name>.ts` rules

- A single `BLOCK = 'kosmo-<name>'` constant for the BEM root.
- `createX(props)` returns a fully-built instance. Bind every event listener
  through a stored handler so `destroy()` can detach it.
- `enhanceX(el, props?)` upgrades existing markup (adds the BEM class,
  rewires children if appropriate). Useful when the page is server-rendered.
- Use the `lucideIcon`, `setVariantClass`, `toggleClass` helpers in
  `src/utils/dom.ts` — don't reinvent them.
- Render semantic HTML by default. Only fall back to a `<div>` with
  `role="…"` if the semantic element conflicts with another role (e.g.
  `<header>` already carries an implicit `banner` landmark, which is why
  `AppBar` is a `<div role="toolbar">`).

### 4. `styles.css` rules

- **Tokens only.** No raw hex, no raw px, no raw ms, no raw cubic-bezier.
  Reach for the existing token; if it doesn't exist, add it (see "Adding a
  token" below).
- BEM throughout: `.kosmo-x`, `.kosmo-x__element`, `.kosmo-x--modifier`,
  state classes via `.is-active` / `.is-hidden` / etc.
- Use `--ks-page-color-bg` (with a token fallback) for surfaces that should
  inherit the host page's palette: `background: var(--ks-page-color-bg, var(--ks-color-surface));`
- Always declare a `:focus-visible` state using `box-shadow: var(--ks-focus-ring);`.
- Transitions use `var(--ks-motion-duration-*)` and `var(--ks-motion-ease-*)`.

### 5. Tests — three files, no exceptions

- **Behaviour** (`*.test.ts`): construct via the factory, assert the rendered
  DOM, simulate clicks, verify `destroy()` detaches handlers.
- **Accessibility** (`*.a11y.test.ts`): use `expectNoA11yViolations` from
  `src/test-utils/a11y.ts`. Cover every variant × state. Cover edge cases
  like icon-only buttons and hidden spacer slots.
- **Types** (`*.types.test.ts`): exercise valid prop combinations + at least
  three `@ts-expect-error` lines for the contracts that matter most
  (missing required prop, invalid variant, wrong shape on nested types).

### 6. Wire the component into the public surface

```ts
// packages/kosmo-ui/src/index.ts
export * from './components/app-bar/index.ts';
```

```css
/* packages/kosmo-ui/src/index.css */
@import './components/app-bar/styles.css';
```

### 7. Wire the component into the docs system

1. Add a `<component>.html` in `apps/prototype/` modelled on
   `sub-header.html`. It must include the sidebar partial, set
   `data-barba-namespace="<component>"`, and contain a
   `[data-docs-root][data-component="<component>"]` article with the
   examples / usage / props placeholders.
2. Add an entry to the `EXAMPLES` map in
   `apps/prototype/src/views/component-docs.ts` with one `ExampleSpec` per
   variant × state worth demonstrating. Each spec carries:
   - `label` — human-readable
   - `factorySnippet` — the TypeScript example
   - `htmlSnippet` — the equivalent markup
   - `build()` — returns a real DOM node built via the factory
3. Add a sidebar link in `apps/prototype/shared/sidebar.html`.
4. Add the namespace to `VIEW_TITLES` in
   `apps/prototype/src/barba-init.ts`.
5. Add the namespace to the docs-preview palette selector group in
   `apps/prototype/styles/pages/component-preview.css` so the page surface
   has sensible defaults (`--ks-page-color-bg`, accent, tab indicator).
6. Regenerate the typed prop table:

   ```bash
   npm run docs:extract --workspace=@kosmo/ui
   ```

### 8. Verify

```bash
npm run typecheck     # all workspaces, including type-level tests
npm test              # vitest behaviour + a11y, then types
npm run build         # library (Vite lib mode + .d.ts) + prototype
```

Optional but recommended when there's a reference design: capture the page
in a headless browser at the design's intended size and eyeball it next to
the source. The `design-qa` skill can automate this.

---

## Adding a new page to `apps/prototype`

### 1. Markup

```html
<!doctype html>
<html lang="en">
  <head>…</head>
  <body data-barba="wrapper">
    <!-- @include sidebar.html -->     <!-- The Vite plugin inlines this -->
    <main data-barba="container" data-barba-namespace="my-page">
      <div class="my-page">
        <!-- Compose @kosmo/ui factories or use their BEM classes directly. -->
      </div>
    </main>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

### 2. Page palette — declare twice

This is the single most-bitten gotcha in the prototype. Page tokens must
apply both when the page is viewed standalone (root has
`data-barba-namespace`) **and** when it's loaded into the prototype's
plugin frame (no namespace, just the inner page class):

```css
/* apps/prototype/styles/pages/my-page.css */
[data-barba-namespace='my-page'],
.my-page,                /* inner page wrapper */
.my-page-frame {         /* if the page has a separate frame element */
  --ks-page-color-bg: #b6ebff;
  --ks-page-color-accent: #88e0ff;
  --ks-page-color-tab-indicator: var(--ks-page-color-accent);
}
```

Layout/positioning rules can stay scoped to the namespace selector — only
the `--ks-page-color-*` declarations need to be duplicated to the inner
class.

### 3. Wiring

- Sidebar link in `apps/prototype/shared/sidebar.html`
- Title in `VIEW_TITLES` map in `apps/prototype/src/barba-init.ts`
- If the page needs JS-driven enhancement that isn't already global (most
  pages don't), add a guarded call to `initEnhancers()` in `barba-init.ts`
  and the bootstrap block in `main.ts`:
  ```ts
  if (document.querySelector('[data-barba-namespace="my-page"]')) initMyPage();
  ```

### 4. Reuse before composing

Before reaching for raw markup, check whether the page can be assembled
from existing primitives (`createButton`, `createInput`, `createTabBar`,
`createListItem`, `createSearch`, `createSubHeader`, `createAppBar`).
A new page should rarely introduce new BEM classes outside the library.

---

## Tokens

### Add a new token

Tokens live in `packages/kosmo-ui/src/tokens/`. To add one:

1. Add the **primitive** (raw value) to the relevant `*.css` file under
   `:root` — e.g. `--ks-palette-favourite-fill: #fce37e;`.
2. Add a **semantic alias** so consumers reference intent, not paint —
   e.g. `--ks-color-favourite-fill: var(--ks-palette-favourite-fill);`.
3. Mirror the semantic name in the typed map in `tokens/index.ts` so it
   shows up in autocomplete: `favouriteFill: '--ks-color-favourite-fill'`.

### Token consumption rules

- Components reference **semantic** tokens (`--ks-color-*`,
  `--ks-space-*`, `--ks-radius-*`, etc.). Never primitives.
- Page-specific palettes use the **page-color** layer
  (`--ks-page-color-bg`, `--ks-page-color-accent`,
  `--ks-page-color-tab-indicator`) so a single CSS variable swap can
  reskin a whole page.
- A grep for hex values outside `packages/kosmo-ui/src/tokens/` should
  return nothing meaningful. If it does, you've found a refactor target.

---

## Accessibility checklist

Every component PR must satisfy:

- [ ] Semantic HTML first; ARIA roles only when no native element fits.
- [ ] `:focus-visible` shows a `box-shadow: var(--ks-focus-ring)` outline.
- [ ] Every interactive element is reachable and operable via keyboard.
- [ ] Icon-only buttons require `ariaLabel` at the type level.
- [ ] Hidden / spacer slots are `aria-hidden="true"` **and** `tabindex="-1"`.
- [ ] `*.a11y.test.ts` exists and passes axe with the project's standard
      rule set.

---

## Commit conventions

- Imperative, present-tense subject line scoped to the unit of change
  (`Add AppBar component + Plugin Content top bar`,
  `Restructure into @kosmo/ui library + prototype workspace`).
- Body explains the why and lists user-facing surfaces touched.
- Never commit `*.tsbuildinfo`, `dist/`, `.env*`, or screenshots that
  aren't documentation.
- Don't push to `main` from a feature branch without running the full
  verification above. CI will catch you, but local-first saves a round-trip.

---

## Worked example — adding `AppBar` and the Plugin Content top bar

For posterity, the sequence we actually executed:

1. Read the Figma node via the MCP and audited the variables — found two
   missing colour tokens (`favourite-fill`, `favourite-stroke`).
2. Audited existing components — concluded `Button` was wrong (too heavy)
   and a new `AppBar` was needed.
3. Added the two token primitives + semantic aliases + typed map entries.
4. Scaffolded `packages/kosmo-ui/src/components/app-bar/` with the eight
   files listed above.
5. Wrote tests (9 behaviour + 3 a11y + 4 type-level). Initial axe run
   flagged a `role="toolbar"` conflict on `<header>` — switched the host
   to `<div role="toolbar">` and re-ran tests green.
6. Re-exported from the barrel + imported the stylesheet.
7. Registered `chevron-left`, `star`, `trash-2` in the prototype icon map.
8. Updated `apps/prototype/plugin-content.html` to include the new bar.
9. Created `apps/prototype/app-bar.html` docs page, sidebar link,
   `EXAMPLES` entry, `VIEW_TITLES` entry, and added the namespace to
   `component-preview.css`.
10. Ran `docs:extract` (now 7 components in the prop table).
11. `typecheck` ✓ · `test` ✓ (14 files, 92 tests) · `build` ✓.
12. Headless screenshot vs Figma reference confirmed visual parity.

That's the full loop. New work should follow the same shape.
