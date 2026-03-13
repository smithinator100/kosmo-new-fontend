---
name: claude-frontend
description: >-
  Build frontend prototypes with barba.js page transitions, TypeScript, and Vite.
  Use when the user asks to create pages, add transitions, scaffold components,
  build UI prototypes, or work with barba.js animations and views.
---

# Claude Frontend Skill

## Quick Start

This project uses **Vite + TypeScript + barba.js** for multi-page prototypes with smooth transitions.

Run the dev server:

```bash
npm run dev
```

## Adding a New Page

1. Create an HTML file at the project root (e.g. `about.html`):

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>About - KOSMO</title>
</head>
<body data-barba="wrapper">
  <nav>
    <a href="/">Home</a>
    <a href="/about.html">About</a>
  </nav>
  <main data-barba="container" data-barba-namespace="about">
    <h1>About</h1>
  </main>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

2. Add a view in `src/views/` if the page needs custom logic:

```typescript
import type { IView } from '@barba/core/dist/core/src/defs';

export const aboutView: IView = {
  namespace: 'about',
  beforeEnter() {
    // init about-page-specific behavior
  },
  afterLeave() {
    // cleanup
  },
};
```

3. Register the view in `src/main.ts` inside `barba.init({ views: [...] })`.

## Creating Transitions

### CSS-only transition

```css
.barba-leave-active,
.barba-enter-active {
  transition: opacity 0.4s ease;
}
.barba-leave-to,
.barba-enter {
  opacity: 0;
}
```

### JS transition (e.g. with Web Animations API)

```typescript
import type { ITransitionData } from '@barba/core/dist/core/src/defs';

export async function fadeTransition(data: ITransitionData): Promise<void> {
  const leaveAnim = data.current.container.animate(
    [{ opacity: 1 }, { opacity: 0 }],
    { duration: 300, easing: 'ease-out' }
  );
  await leaveAnim.finished;

  const enterAnim = data.next.container.animate(
    [{ opacity: 0 }, { opacity: 1 }],
    { duration: 300, easing: 'ease-in' }
  );
  await enterAnim.finished;
}
```

### GSAP transition (if gsap is installed)

```typescript
import gsap from 'gsap';
import type { ITransitionData } from '@barba/core/dist/core/src/defs';

export function gsapSlide(data: ITransitionData): Promise<void> {
  return new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: resolve });
    tl.to(data.current.container, { x: '-100%', duration: 0.5 });
    tl.from(data.next.container, { x: '100%', duration: 0.5 });
  });
}
```

## Module Structure

```
src/
  main.ts              # barba.init + global imports
  transitions/
    fade.ts            # fade transition
    slide.ts           # slide transition
  views/
    home.ts            # home page view hooks
    about.ts           # about page view hooks
  utils/
    animation.ts       # shared animation helpers
  style.css            # global styles
```

## Conventions

- One transition per file in `src/transitions/`.
- One view per namespace in `src/views/`.
- Shared animation utilities go in `src/utils/`.
- All pages share the same `<nav>` markup outside the barba container.
- Use `data-barba-namespace` values that match the HTML filename (e.g. `about.html` -> `namespace="about"`).

## Responsive Design Checklist

- Use relative units (`rem`, `%`, `vw/vh`) over fixed `px` for layout.
- Test at 320px, 768px, and 1280px breakpoints minimum.
- Ensure touch targets are at least 44x44px on mobile.
- Use `prefers-reduced-motion` media query to disable transitions for accessibility.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
