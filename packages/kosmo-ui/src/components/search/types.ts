export interface SearchProps {
  placeholder?: string;
  value?: string;
  ariaLabel?: string;
  /** Fires on every input. */
  onChange?: (value: string, event: Event) => void;
  /** Fires on Enter / submit. */
  onSubmit?: (value: string) => void;
  /** Fires when the clear button is pressed. */
  onClear?: () => void;
}

export interface SearchInstance {
  readonly el: HTMLElement;
  readonly field: HTMLInputElement;
  getValue: () => string;
  setValue: (value: string) => void;
  clear: () => void;
  focus: () => void;
  blur: () => void;
  destroy: () => void;
}
