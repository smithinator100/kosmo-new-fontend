# Design QA Checklist

Detailed checklist for comparing implementation against Figma designs. Use this as a reference during the comparison step.

## Layout & Structure

- [ ] Page/component dimensions match Figma frame size
- [ ] Auto-layout direction (row/column) matches flex direction
- [ ] Auto-layout alignment matches justify/align properties
- [ ] Padding values match (top, right, bottom, left)
- [ ] Gap spacing between children matches
- [ ] Element ordering matches design layer order
- [ ] Overflow behavior matches (hidden, scroll, visible)
- [ ] Fixed/absolute positioned elements are correctly placed
- [ ] Min/max width/height constraints are applied

## Typography

- [ ] Font family matches (check fallback stack too)
- [ ] Font size matches exactly
- [ ] Font weight matches (400, 500, 600, 700, etc.)
- [ ] Line height matches (px or multiplier)
- [ ] Letter spacing matches
- [ ] Text alignment matches (left, center, right)
- [ ] Text transform matches (uppercase, capitalize, none)
- [ ] Text decoration matches (underline, strikethrough)
- [ ] Text truncation/overflow behavior matches
- [ ] Paragraph spacing matches

## Colors & Visual Style

- [ ] Background color matches (hex/rgba)
- [ ] Text color matches
- [ ] Border color matches
- [ ] Border width matches
- [ ] Border style matches (solid, dashed, none)
- [ ] Border radius matches (per corner if needed)
- [ ] Box shadow matches (offset-x, offset-y, blur, spread, color)
- [ ] Opacity matches
- [ ] Gradient direction and color stops match
- [ ] Blend modes match (if used)

## Components

### Buttons
- [ ] Default state matches
- [ ] Hover state matches
- [ ] Active/pressed state matches
- [ ] Disabled state matches
- [ ] Focus ring style matches
- [ ] Icon placement and sizing matches
- [ ] Text label styling matches

### Inputs
- [ ] Default/empty state matches
- [ ] Placeholder text styling matches
- [ ] Focused state matches
- [ ] Filled state matches
- [ ] Error state matches
- [ ] Label positioning and styling matches
- [ ] Helper/error text styling matches

### Cards
- [ ] Container styling matches
- [ ] Content padding matches
- [ ] Image aspect ratio and fit matches
- [ ] Title/body typography matches
- [ ] Action area layout matches

### Navigation
- [ ] Active/current state styling matches
- [ ] Hover state matches
- [ ] Item spacing matches
- [ ] Icon + label alignment matches

## Icons & Assets

- [ ] Icon size matches (width x height)
- [ ] Icon stroke width matches
- [ ] Icon color matches
- [ ] Image dimensions and aspect ratio match
- [ ] Image object-fit matches (cover, contain, fill)
- [ ] SVG viewBox and sizing match
- [ ] Asset alignment within container matches

## Spacing & Alignment

- [ ] Margin values match between sections
- [ ] Content area max-width matches
- [ ] Horizontal centering matches
- [ ] Vertical centering matches
- [ ] Grid column/row structure matches
- [ ] Grid gap values match
- [ ] Consistent spacing scale used

## Interactive States

- [ ] Hover transitions match (duration, easing, property)
- [ ] Focus styles match (outline, ring, shadow)
- [ ] Active/pressed feedback matches
- [ ] Disabled appearance matches (opacity, cursor)
- [ ] Loading states match (spinners, skeletons)
- [ ] Tooltip styling and positioning match

## Responsive Behavior

- [ ] Viewport width matches Figma frame width during comparison
- [ ] Breakpoint behavior matches design variants
- [ ] Fluid scaling matches between breakpoints
- [ ] Element visibility changes at breakpoints match
- [ ] Stack/wrap behavior matches design intent

## Accessibility

- [ ] Color contrast meets WCAG AA (4.5:1 text, 3:1 large text)
- [ ] Focus indicators are visible
- [ ] Touch targets are at least 44x44px on mobile
- [ ] Text is not clipped or hidden unintentionally
- [ ] Interactive elements have appropriate cursor styles

## Tolerance Guidelines

| Property | Acceptable Tolerance |
|----------|---------------------|
| Spacing/sizing | +/- 2px |
| Font size | Exact match |
| Font weight | Exact match |
| Colors | Exact hex match (no "close enough") |
| Border radius | +/- 1px |
| Opacity | +/- 0.05 |
| Shadow blur/spread | +/- 1px |
| Line height | +/- 1px or 0.05 multiplier |
