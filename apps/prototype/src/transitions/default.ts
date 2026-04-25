const DURATION = 400;
const CUBIC_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

const TEXT_INPUT_SELECTOR = [
  'h1', 'h2', 'h3', 'p',
  '.kosmo-input',
  '.verification-inputs',
  '.component-preview-label',
  '.hero-badge',
  '.feature-card',
  '.prototype-area',
  '.transition-menu',
  '.anim-settings',
].join(', ');

const SVG_SELECTOR = 'img[src$=".svg"]';
const BUTTON_SELECTOR = '.kosmo-btn, .btn';

function collectElements(container: Element) {
  const textEls = Array.from(container.querySelectorAll(TEXT_INPUT_SELECTOR));
  const svgEls = Array.from(container.querySelectorAll(SVG_SELECTOR))
    .filter((el) => !el.closest('button'));
  const buttonEls = Array.from(container.querySelectorAll(BUTTON_SELECTOR));

  const allAnimated = new Set<Element>([...textEls, ...svgEls, ...buttonEls]);

  const filterNested = (els: Element[]) =>
    els.filter((el) => {
      let parent = el.parentElement;
      while (parent && parent !== container) {
        if (allAnimated.has(parent)) return false;
        parent = parent.parentElement;
      }
      return true;
    });

  return {
    text: filterNested(textEls),
    svg: filterNested(svgEls),
    buttons: filterNested(buttonEls),
  };
}

function animateSlideAndFade(
  el: Element,
  offsetPx: number,
  direction: 'in' | 'out',
): Animation[] {
  const isEnter = direction === 'in';
  return [
    el.animate(
      [
        { transform: `translateY(${isEnter ? offsetPx : 0}px)` },
        { transform: `translateY(${isEnter ? 0 : -offsetPx}px)` },
      ],
      { duration: DURATION, easing: CUBIC_EASE, fill: 'both' },
    ),
    el.animate(
      [
        { opacity: isEnter ? '0' : '1' },
        { opacity: isEnter ? '1' : '0' },
      ],
      { duration: DURATION, easing: 'linear', fill: 'both' },
    ),
  ];
}

function animateFade(el: Element, direction: 'in' | 'out'): Animation {
  const isEnter = direction === 'in';
  return el.animate(
    [
      { opacity: isEnter ? '0' : '1' },
      { opacity: isEnter ? '1' : '0' },
    ],
    { duration: DURATION, easing: 'linear', fill: 'both' },
  );
}

export function animatePageElements(
  container: Element,
  direction: 'in' | 'out',
): Promise<void> {
  const { text, svg, buttons } = collectElements(container);
  const animations: Animation[] = [];

  for (const el of text) {
    animations.push(...animateSlideAndFade(el, 24, direction));
  }

  for (const el of svg) {
    animations.push(...animateSlideAndFade(el, 48, direction));
  }

  for (const el of buttons) {
    animations.push(animateFade(el, direction));
  }

  if (animations.length === 0) return Promise.resolve();

  return Promise.all(animations.map((a) => a.finished)).then(() => undefined);
}
