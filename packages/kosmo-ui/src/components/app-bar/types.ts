import type { LucideIconName } from '../../utils/types.ts';

/**
 * Tone of an icon action slot inside the app-bar.
 *
 * - `default` — neutral ink stroke, transparent fill (the standard look).
 * - `favourite` — yellow-filled star (uses `--ks-color-favourite-*` tokens).
 *   Designed for the "favourited" state of a star/bookmark affordance.
 */
export type AppBarActionTone = 'default' | 'favourite';

export const APP_BAR_ACTION_TONES: readonly AppBarActionTone[] = [
  'default',
  'favourite',
] as const;

export interface AppBarIconAction {
  /** Lucide icon name (e.g. `chevron-left`, `star`, `trash-2`). */
  icon: LucideIconName;
  /** Required `aria-label` — every icon-only button must announce its purpose. */
  ariaLabel: string;
  /** Visual tone — defaults to `'default'`. */
  tone?: AppBarActionTone;
  /** Click handler for the action. */
  onClick?: (e: MouseEvent) => void;
  /**
   * Render the slot but keep it visually hidden (`opacity: 0`) and inert.
   * Useful as a layout spacer that mirrors a leading action so a centered
   * title stays optically centered.
   */
  hidden?: boolean;
}

export interface AppBarProps {
  /**
   * Centered title — usually a short version label (`"v1.0"`) or page name.
   * Pass an HTMLElement to render rich content (e.g. an icon + text). Omit
   * for an actions-only bar.
   */
  title?: string | HTMLElement;
  /** Leading action slot (typically `chevron-left` for "back"). */
  leading?: AppBarIconAction;
  /** Trailing action slots, rendered left-to-right. */
  trailing?: readonly AppBarIconAction[];
  /**
   * Required `aria-label` for the bar's `role="toolbar"` landmark — describes
   * what scope the actions operate on (e.g. `"Plugin actions"`).
   */
  ariaLabel: string;
}

export interface AppBarInstance {
  readonly el: HTMLElement;
  setTitle: (title: string | HTMLElement) => void;
  destroy: () => void;
}
