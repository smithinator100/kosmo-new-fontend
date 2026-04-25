import type { LucideIconName } from '../../utils/types.ts';

/**
 * Button visual variant. Each variant maps to a `--ks-color-btn-*` token set
 * declared in `styles.css`. Add new variants by registering them here AND in
 * the CSS variant block.
 */
export type ButtonVariant = 'primary' | 'pink' | 'yellow' | 'outline';

/** All known variants — exported as a value so the runtime can iterate them. */
export const BUTTON_VARIANTS: readonly ButtonVariant[] = [
  'primary',
  'pink',
  'yellow',
  'outline',
] as const;

/**
 * Button activity state.
 * - `idle`: ready for input.
 * - `loading`: pointer-events disabled, spinner shown.
 * - `disabled`: visually + interactively disabled.
 */
export type ButtonState = 'idle' | 'loading' | 'disabled';

export const BUTTON_STATES: readonly ButtonState[] = [
  'idle',
  'loading',
  'disabled',
] as const;

export interface ButtonProps {
  /** Visible label text. Always required for accessibility — even icon-only buttons need a label (use `aria-label` via `ariaLabel`). */
  label: string;
  variant?: ButtonVariant;
  state?: ButtonState;
  /** Native button type. Defaults to `'button'` to avoid accidental form submits. */
  type?: 'button' | 'submit' | 'reset';
  iconLeft?: LucideIconName;
  iconRight?: LucideIconName;
  /** Override the accessible name when the visible label is decorative. */
  ariaLabel?: string;
  /** Optional click handler. Wired up via `addEventListener('click', …)`. */
  onClick?: (e: MouseEvent) => void;
  /** Stretch to fill the parent's width. */
  fullWidth?: boolean;
}

/** Imperative handle returned by `createButton` / `enhanceButton`. */
export interface ButtonInstance {
  /** Underlying `<button>` element. */
  readonly el: HTMLButtonElement;
  setLabel: (label: string) => void;
  setVariant: (variant: ButtonVariant) => void;
  setState: (state: ButtonState) => void;
  /** Replace the click handler. Pass `null` to remove. */
  setOnClick: (handler: ButtonProps['onClick'] | null) => void;
  /** Detach event listeners. The element itself is left in place. */
  destroy: () => void;
}
