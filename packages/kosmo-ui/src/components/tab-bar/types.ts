export interface TabItem {
  /** Stable identifier — used for change events and `setActive`. */
  id: string;
  /** Visible label. */
  label: string;
  /** Disabled tabs are rendered visually but skip keyboard navigation + clicks. */
  disabled?: boolean;
}

export interface TabBarProps {
  /** Ordered list of tabs. */
  items: readonly TabItem[];
  /** Currently active tab id. Falls back to the first non-disabled tab. */
  activeId?: string;
  /** Accessible label for the tablist (e.g. "Plugin frame tabs"). */
  ariaLabel?: string;
  onChange?: (id: string, item: TabItem) => void;
}

export interface TabBarInstance {
  readonly el: HTMLElement;
  getActiveId: () => string;
  setActive: (id: string) => void;
  setItems: (items: readonly TabItem[]) => void;
  destroy: () => void;
}
