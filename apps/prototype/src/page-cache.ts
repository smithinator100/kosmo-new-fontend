/**
 * Lightweight page-content cache used by the prototype state machine to
 * preload + swap inner HTML for the prototype steps and tab pages.
 */

const cache: Record<string, string> = {};

interface FrameSpec {
  selector: string;
  cacheKey: string;
}

interface TabFrameGroup {
  page: string;
  frames: FrameSpec[];
}

const STEP_PAGES = ['login', 'email', 'verification', 'api-key', 'name'] as const;

const TAB_FRAME_GROUPS: TabFrameGroup[] = [
  {
    page: 'plugins',
    frames: [
      { selector: '.plugins-frame.plugins-frame--pink', cacheKey: 'proto-plugins-empty' },
      { selector: '.plugins-frame:not(.plugins-frame--pink)', cacheKey: 'proto-plugins' },
    ],
  },
  {
    page: 'favourites',
    frames: [
      { selector: '.favourites-frame.favourites-frame--pink', cacheKey: 'proto-favourites-empty' },
      { selector: '.favourites-frame:not(.favourites-frame--pink)', cacheKey: 'proto-favourites' },
    ],
  },
  { page: 'tools', frames: [{ selector: '.tools-frame', cacheKey: 'proto-tools' }] },
  { page: 'settings', frames: [{ selector: '.settings-frame', cacheKey: 'proto-settings' }] },
];

export function getCachedContent(key: string): string | undefined {
  return cache[key];
}

export async function preloadPages(): Promise<void> {
  await Promise.all([
    ...STEP_PAGES.map(async (page) => {
      try {
        const res = await fetch(`/${page}.html`);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const container = doc.querySelector('[data-barba="container"]');
        if (container) cache[page] = container.innerHTML.trim();
      } catch {
        /* fallback to runtime markup */
      }
    }),
    ...TAB_FRAME_GROUPS.map(async ({ page, frames }) => {
      try {
        const res = await fetch(`/${page}.html`);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        for (const { selector, cacheKey } of frames) {
          const frame = doc.querySelector(selector);
          if (frame) cache[cacheKey] = frame.outerHTML;
        }
      } catch {
        /* fallback to runtime markup */
      }
    }),
  ]);
}
