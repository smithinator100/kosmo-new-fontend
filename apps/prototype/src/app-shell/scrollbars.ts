/**
 * Custom scrollbar wiring used by the prototype's plugin/favourites panes.
 *
 * One generic implementation parameterised by the three element classes.
 */

interface ScrollbarSpec {
  contentSelector: string;
  trackSelector: string;
  thumbSelector: string;
  minThumb?: number;
}

function initScrollbar({
  contentSelector,
  trackSelector,
  thumbSelector,
  minThumb = 20,
}: ScrollbarSpec): void {
  const content = document.querySelector<HTMLElement>(contentSelector);
  const track = document.querySelector<HTMLElement>(trackSelector);
  const thumb = document.querySelector<HTMLElement>(thumbSelector);
  if (!content || !track || !thumb) return;

  function update(): void {
    if (!content || !track || !thumb) return;
    const { scrollTop, scrollHeight, clientHeight } = content;
    if (scrollHeight <= clientHeight) {
      thumb.style.display = 'none';
      return;
    }
    thumb.style.display = '';
    const trackHeight = track.clientHeight;
    const ratio = clientHeight / scrollHeight;
    const thumbHeight = Math.max(minThumb, trackHeight * ratio);
    const maxScroll = scrollHeight - clientHeight;
    const thumbTop = (scrollTop / maxScroll) * (trackHeight - thumbHeight);
    thumb.style.height = `${thumbHeight}px`;
    thumb.style.top = `${thumbTop}px`;
  }

  content.addEventListener('scroll', update, { passive: true });
  update();
}

export function initPluginsScrollbar(): void {
  initScrollbar({
    contentSelector: '.plugins-content',
    trackSelector: '.plugins-scrollbar',
    thumbSelector: '.plugins-scrollbar-thumb',
  });
}

export function initFavouritesScrollbar(): void {
  initScrollbar({
    contentSelector: '.favourites-content',
    trackSelector: '.favourites-scrollbar',
    thumbSelector: '.favourites-scrollbar-thumb',
  });
}
