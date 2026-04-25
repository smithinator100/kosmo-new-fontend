/**
 * Typed token surface. Mirrors `index.css`.
 *
 * Tokens are exposed as a const map (`tokens`) plus union types per category.
 * Component implementations should reference `cssVar(token)` to produce
 * `var(--ks-…)` strings rather than hard-coding token names.
 */

export const colorTokens = {
  ink: '--ks-color-ink',
  inkSoft: '--ks-color-ink-soft',
  inkMute: '--ks-color-ink-mute',
  inkQuiet: '--ks-color-ink-quiet',
  inkFaint: '--ks-color-ink-faint',
  inkWhisper: '--ks-color-ink-whisper',
  inkHaze: '--ks-color-ink-haze',
  inkMist: '--ks-color-ink-mist',
  surface: '--ks-color-surface',
  onSurface: '--ks-color-on-surface',
  border: '--ks-color-border',
  overlaySoft: '--ks-color-overlay-soft',
  overlayMedium: '--ks-color-overlay-medium',
  danger: '--ks-color-danger',
  dangerSoft: '--ks-color-danger-soft',
  focusRing: '--ks-color-focus-ring',
  pageBg: '--ks-page-color-bg',
  pageAccent: '--ks-page-color-accent',
  pageTabIndicator: '--ks-page-color-tab-indicator',
} as const;

export type ColorToken = keyof typeof colorTokens;

export const spaceTokens = {
  '0': '--ks-space-0',
  px: '--ks-space-px',
  '0.5': '--ks-space-0-5',
  '1': '--ks-space-1',
  '1.5': '--ks-space-1-5',
  '2': '--ks-space-2',
  '2.5': '--ks-space-2-5',
  '3': '--ks-space-3',
  '4': '--ks-space-4',
  '5': '--ks-space-5',
  '6': '--ks-space-6',
  '7': '--ks-space-7',
  '8': '--ks-space-8',
  '9': '--ks-space-9',
  '10': '--ks-space-10',
  '12': '--ks-space-12',
  '14': '--ks-space-14',
  '16': '--ks-space-16',
  '19': '--ks-space-19',
  '20': '--ks-space-20',
  '24': '--ks-space-24',
  '30': '--ks-space-30',
} as const;

export type SpaceToken = keyof typeof spaceTokens;

export const radiusTokens = {
  none: '--ks-radius-none',
  xs: '--ks-radius-xs',
  sm: '--ks-radius-sm',
  md: '--ks-radius-md',
  lg: '--ks-radius-lg',
  xl: '--ks-radius-xl',
  '2xl': '--ks-radius-2xl',
  pill: '--ks-radius-pill',
} as const;

export type RadiusToken = keyof typeof radiusTokens;

export const motionDurationTokens = {
  instant: '--ks-motion-duration-instant',
  fast: '--ks-motion-duration-fast',
  base: '--ks-motion-duration-base',
  slow: '--ks-motion-duration-slow',
  slower: '--ks-motion-duration-slower',
} as const;

export type MotionDurationToken = keyof typeof motionDurationTokens;

export const motionEaseTokens = {
  linear: '--ks-motion-ease-linear',
  inQuad: '--ks-motion-ease-in-quad',
  inCubic: '--ks-motion-ease-in-cubic',
  inQuint: '--ks-motion-ease-in-quint',
  outQuad: '--ks-motion-ease-out-quad',
  outCubic: '--ks-motion-ease-out-cubic',
  outQuint: '--ks-motion-ease-out-quint',
  inOutQuad: '--ks-motion-ease-in-out-quad',
  inOutCubic: '--ks-motion-ease-in-out-cubic',
  inOutQuint: '--ks-motion-ease-in-out-quint',
} as const;

export type MotionEaseToken = keyof typeof motionEaseTokens;

export const shadowTokens = {
  none: '--ks-shadow-none',
  sm: '--ks-shadow-sm',
  md: '--ks-shadow-md',
  panel: '--ks-shadow-panel',
} as const;

export type ShadowToken = keyof typeof shadowTokens;

export const textStyleTokens = [
  'display',
  'title',
  'subtitle',
  'body',
  'input',
  'action',
  'ui',
  'tab',
  'caption',
  'eyebrow',
  'digit',
] as const;

export type TextStyleToken = (typeof textStyleTokens)[number];

export interface KosmoTokens {
  color: typeof colorTokens;
  space: typeof spaceTokens;
  radius: typeof radiusTokens;
  motionDuration: typeof motionDurationTokens;
  motionEase: typeof motionEaseTokens;
  shadow: typeof shadowTokens;
  textStyle: typeof textStyleTokens;
}

export const tokens: KosmoTokens = {
  color: colorTokens,
  space: spaceTokens,
  radius: radiusTokens,
  motionDuration: motionDurationTokens,
  motionEase: motionEaseTokens,
  shadow: shadowTokens,
  textStyle: textStyleTokens,
};

/** Wrap a CSS custom-property name in `var(...)`. */
export function cssVar(name: string, fallback?: string): string {
  return fallback ? `var(${name}, ${fallback})` : `var(${name})`;
}

/** Helper to look up a token by category + key and produce a `var(--…)` string. */
export function color(token: ColorToken): string {
  return cssVar(colorTokens[token]);
}

export function space(token: SpaceToken): string {
  return cssVar(spaceTokens[token]);
}

export function radius(token: RadiusToken): string {
  return cssVar(radiusTokens[token]);
}

export function motionDuration(token: MotionDurationToken): string {
  return cssVar(motionDurationTokens[token]);
}

export function motionEase(token: MotionEaseToken): string {
  return cssVar(motionEaseTokens[token]);
}

export function shadow(token: ShadowToken): string {
  return cssVar(shadowTokens[token]);
}
