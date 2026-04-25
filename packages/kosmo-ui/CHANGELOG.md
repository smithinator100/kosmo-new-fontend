# Changelog

All notable changes to `@kosmo/ui` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] — 2026-04-25

Initial release of the Kosmo UI library.

### Added

- **Tokens** — full token layer as CSS custom properties + typed TS const maps
  - Colour primitives + semantic aliases
  - Per-page palette overrides via `--ks-page-color-*`
  - Typography (families, sizes, weights, line-heights, letter-spacing)
  - Semantic text presets (`--ks-text-display`, `--ks-text-title`, …)
  - Spacing on a 4 px scale (`--ks-space-0` … `--ks-space-30`)
  - Radius (`xs` → `pill`)
  - Motion durations + easings (mirrors the prototype animation panel)
  - Shadow primitives + `--ks-shadow-panel` composite
  - `prefers-reduced-motion` collapses all motion durations to `0.01ms`
- **Components** — every component ships factory + enhance APIs, full prop typings, behaviour + a11y tests, and a README:
  - `Button` (`primary | pink | yellow | outline` × `idle | loading | disabled`)
  - `Input` (`default | large` × `idle | focused | error`, `<input>` and `<textarea>` rendering)
  - `TabBar` + `Tab` with WAI-ARIA tabs pattern + arrow-key navigation
  - `ListItem` with leading icon, label, trailing action, `default | danger` tone
  - `Search` rendered as `<form role="search">` with reactive clear button
  - `SubHeader`
- **Accessibility** — every interactive component:
  - Renders semantic HTML first (`<button>`, real `<input>`, `<form role="search">`)
  - Has a visible focus ring via `--ks-color-focus-ring` and `:focus-visible`
  - Is keyboard-activatable
  - Has documented a11y notes in its README
