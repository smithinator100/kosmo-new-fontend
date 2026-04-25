import type { LucideIconName } from '../../utils/types.ts';

/** Visual / semantic tone. `danger` colors the label red. */
export type ListItemTone = 'default' | 'danger';

export const LIST_ITEM_TONES: readonly ListItemTone[] = ['default', 'danger'] as const;

export interface ListItemAction {
  /** Lucide icon name for the trailing action button. */
  icon: LucideIconName;
  /** Required `aria-label` for the action button. */
  ariaLabel: string;
  onClick?: (e: MouseEvent) => void;
}

export interface ListItemProps {
  label: string;
  /** Lucide icon shown on the leading edge. */
  icon?: LucideIconName;
  tone?: ListItemTone;
  /** Trailing affordance — usually a settings/edit button. */
  action?: ListItemAction;
  /** Make the entire row clickable. */
  onClick?: (e: MouseEvent) => void;
  /** Pass `true` to render as a `<button>` instead of a `<div>` (recommended when `onClick` is set). */
  interactive?: boolean;
}

export interface ListItemInstance {
  readonly el: HTMLElement;
  setLabel: (label: string) => void;
  setTone: (tone: ListItemTone) => void;
  destroy: () => void;
}
