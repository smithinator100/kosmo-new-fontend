import type { LucideIconName } from '../../utils/types.ts';

/**
 * Input size variant.
 * - `default`: 64px tall single-line input.
 * - `large`: 208px multi-line text area.
 */
export type InputVariant = 'default' | 'large';

export const INPUT_VARIANTS: readonly InputVariant[] = ['default', 'large'] as const;

/** Discriminated state for the input. */
export type InputState = 'idle' | 'focused' | 'error';

export const INPUT_STATES: readonly InputState[] = ['idle', 'focused', 'error'] as const;

export interface InputProps {
  /** Optional `name` attribute for form serialization. */
  name?: string;
  /** Initial value. */
  value?: string;
  placeholder?: string;
  variant?: InputVariant;
  /**
   * Initial state. Note that focus state is generally driven automatically by
   * `:focus-within` / `focus`/`blur` listeners; only set this explicitly if you
   * need to force a state without focus (e.g. inline preview screens).
   */
  state?: InputState;
  /** Native input type. Ignored when `variant === 'large'`. */
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'search' | 'url';
  inputMode?: 'text' | 'numeric' | 'tel' | 'email' | 'url' | 'search' | 'decimal' | 'none';
  maxLength?: number;
  rows?: number;
  /** Accessible label. Either this or `ariaLabelledBy` is required. */
  label?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  /** Lucide icon shown on the trailing edge (e.g. arrow indicator). */
  trailingIcon?: LucideIconName;
  /** Disabled state. */
  disabled?: boolean;
  /** Read-only state. */
  readOnly?: boolean;
  /** Fired on every input. Receives the new value. */
  onChange?: (value: string, event: Event) => void;
  /** Fired on focus. */
  onFocus?: (event: FocusEvent) => void;
  /** Fired on blur. */
  onBlur?: (event: FocusEvent) => void;
  /** Fired on keydown. */
  onKeyDown?: (event: KeyboardEvent) => void;
}

export interface InputInstance {
  /** Wrapper element (`<div class="kosmo-input">`). */
  readonly el: HTMLElement;
  /** Underlying field — `<input>` or `<textarea>` depending on variant. */
  readonly field: HTMLInputElement | HTMLTextAreaElement;
  getValue: () => string;
  setValue: (value: string) => void;
  setVariant: (variant: InputVariant) => void;
  setState: (state: InputState) => void;
  setError: (errored: boolean) => void;
  setDisabled: (disabled: boolean) => void;
  focus: () => void;
  blur: () => void;
  destroy: () => void;
}
