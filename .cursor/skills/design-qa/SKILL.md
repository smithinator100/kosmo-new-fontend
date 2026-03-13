---
name: design-qa
description: >-
  Verify implemented UI against Figma designs for pixel-perfect accuracy.
  Use when the user says "check design", "compare to Figma", "design QA",
  "verify implementation", "does this match the design", "check fidelity",
  "visual diff", or provides a Figma URL and asks to validate the build.
  Requires Figma MCP server connection and a running dev server.
---

# Design QA

Compares the implemented UI against Figma designs and produces a structured fidelity report. Uses Figma MCP for design specs/screenshots and the browser-use subagent for implementation screenshots.

## Prerequisites

- Figma MCP server connected (verify `get_design_context` tool is available)
- Dev server running (`npm run dev`) — confirm before starting
- User provides a **Figma URL** and the **local page URL** (or page path) to compare

## Workflow

**Follow these steps in order.**

### Step 1: Parse Figma URL

Extract `fileKey` and `nodeId` from the Figma URL.

**URL format:** `https://figma.com/design/:fileKey/:fileName?node-id=1-2`

- `fileKey` = segment after `/design/`
- `nodeId` = value of `node-id` param (convert `-` to `:` for API calls)
- For branch URLs (`/branch/:branchKey/`), use `branchKey` as `fileKey`

### Step 2: Fetch Design Data

Run **both** calls in parallel:

1. `get_design_context(fileKey, nodeId)` — returns reference code, screenshot, design tokens, layout properties, typography, colors, spacing
2. `get_screenshot(fileKey, nodeId)` — returns a standalone screenshot as visual ground truth

Save the design context data for structured comparison. The screenshot is the visual source of truth.

**If the response is truncated:** Use `get_metadata(fileKey, nodeId)` to get the node tree, then fetch child nodes individually.

### Step 3: Capture Implementation Screenshot

Launch a **browser-use** subagent to:

1. Navigate to the local page URL (e.g. `http://localhost:5173/login.html`)
2. Wait for the page to fully load (wait for animations/transitions to complete)
3. Take a full-page screenshot
4. Also capture any specific component areas that correspond to the Figma node

Provide the subagent with the Figma screenshot for side-by-side reference.

### Step 4: Structural Comparison

Compare the design context data against the implementation. Check each category:

#### Layout & Spacing
- Container dimensions and aspect ratios
- Padding and margin values
- Gap spacing between elements
- Auto-layout direction and alignment
- Responsive constraints

#### Typography
- Font family, size, weight, line-height
- Letter spacing and text transform
- Text alignment and overflow behavior
- Text color values

#### Colors & Fills
- Background colors (solid, gradient)
- Border colors and widths
- Shadow values (offset, blur, spread, color)
- Opacity values

#### Components & Assets
- Icon sizes and stroke widths
- Image aspect ratios and object-fit
- Border radius values
- Interactive state styles (hover, active, focus, disabled)

#### Hierarchy & Structure
- Element ordering matches design
- Nesting depth matches
- Visibility and display states

### Step 5: Visual Comparison

With both screenshots available, perform a visual comparison:

1. **Overall layout** — Does the page structure match?
2. **Spacing rhythm** — Are gaps and padding consistent with the design?
3. **Typography rendering** — Do fonts, sizes, and weights match?
4. **Color accuracy** — Do background, text, and accent colors match?
5. **Component fidelity** — Do buttons, inputs, cards, etc. match their Figma counterparts?
6. **Alignment** — Are elements properly aligned as in the design?
7. **Responsive fit** — Does the implementation respect Figma constraints?

### Step 6: Generate Report

Produce a structured QA report using this format:

```markdown
# Design QA Report

**Figma:** [link to design]
**Page:** [local URL]
**Date:** [timestamp]
**Overall Score:** [PASS | NEEDS WORK | FAIL]

## Summary
[1-2 sentence overview of fidelity level]

## Detailed Findings

### PASS
- [ item ] — matches design

### NEEDS WORK (minor deviations)
- [ item ] — [what's off] → [expected value] vs [actual value]

### FAIL (significant mismatches)
- [ item ] — [what's off] → [expected value] vs [actual value]

## Recommendations
1. [Specific fix with CSS/HTML suggestion]
2. [Specific fix with CSS/HTML suggestion]
```

#### Scoring Criteria

| Score | Meaning |
|-------|---------|
| **PASS** | All elements match within acceptable tolerance (~2px spacing, identical colors) |
| **NEEDS WORK** | Minor deviations — spacing off by 4-8px, slightly wrong font weight, minor color shifts |
| **FAIL** | Structural mismatches — wrong layout, missing elements, significantly wrong colors or typography |

### Step 7: Offer Fixes

After presenting the report, offer to fix the identified issues. Group fixes by priority:

1. **Critical** — structural/layout mismatches
2. **High** — wrong colors, typography, or spacing
3. **Low** — minor pixel adjustments, polish

If the user accepts, apply fixes directly to the HTML/CSS files and re-run the comparison to verify.

## Usage Examples

### Example 1: Full Page QA

User: "Check if the login page matches the Figma design: https://figma.com/design/abc123/KOSMO?node-id=10-5"

**Actions:**
1. Parse: `fileKey=abc123`, `nodeId=10:5`
2. Fetch design context + screenshot from Figma MCP
3. Launch browser-use to screenshot `http://localhost:5173/login.html`
4. Compare layout, typography, colors, components
5. Generate report with findings and fix suggestions

### Example 2: Component QA

User: "Does my button component match the design? https://figma.com/design/abc123/KOSMO?node-id=42-15"

**Actions:**
1. Parse URL, fetch design context for the button node
2. Navigate to `http://localhost:5173/button.html` and screenshot
3. Compare button dimensions, padding, border-radius, colors, typography, hover state
4. Report on component-level fidelity

### Example 3: Batch QA

User: "Check all my pages against the designs" (with multiple Figma URLs)

**Actions:**
1. For each page, run Steps 1-6 in parallel where possible
2. Aggregate findings into a single report
3. Prioritize fixes across all pages

## Tips

- Always confirm the dev server is running before launching browser-use
- For complex pages, fetch child nodes individually if `get_design_context` truncates
- Compare at the same viewport width as the Figma frame
- Check both light and dark modes if the design includes both
- Re-run the check after applying fixes to confirm resolution

## Additional Resources

- For QA checklist details, see [checklist.md](checklist.md)
