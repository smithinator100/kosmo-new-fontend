export interface SubHeaderProps {
  /** Visible label. Rendered uppercase via CSS — pass natural case. */
  label: string;
  /**
   * Heading level — used for screen-reader semantics. Defaults to `'h3'`.
   * Pass `'div'` if the sub-header is purely decorative.
   */
  as?: 'h2' | 'h3' | 'h4' | 'div';
}

export interface SubHeaderInstance {
  readonly el: HTMLElement;
  setLabel: (label: string) => void;
  destroy: () => void;
}
