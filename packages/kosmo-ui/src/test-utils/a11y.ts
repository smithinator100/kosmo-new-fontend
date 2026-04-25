/**
 * Shared a11y assertion helper for component tests.
 *
 * Runs `axe-core` against a detached DOM subtree (the component element is
 * temporarily attached to `document.body` so axe can resolve cascading rules)
 * and fails the test on any violations of the configured ruleset.
 *
 * We restrict the axe ruleset to `wcag2a` + `wcag2aa` + `best-practice`, which
 * matches the accessibility bar documented in each component README.
 *
 * NOTE: Some axe rules (`color-contrast`, `landmark-*`, `region`, `page-has-*`)
 * cannot be evaluated meaningfully in jsdom/happy-dom without a real renderer
 * or a full document, so we disable them here.
 */

import axe from 'axe-core';
import { expect } from 'vitest';

const DISABLED_RULES = [
  'color-contrast',
  'region',
  'landmark-one-main',
  'page-has-heading-one',
  'document-title',
  'html-has-lang',
  'html-lang-valid',
  'meta-viewport',
];

interface RunOptions {
  /**
   * Optional context root. When omitted, the element passed to `expectNoA11yViolations`
   * is used. When provided, axe is run against this root instead (useful when the
   * component must be evaluated as part of a larger fragment, e.g. a tab bar inside
   * a `<nav>`).
   */
  contextRoot?: HTMLElement;
}

export async function expectNoA11yViolations(el: HTMLElement, options: RunOptions = {}): Promise<void> {
  const root = options.contextRoot ?? el;
  const detached = !root.isConnected;
  if (detached) document.body.appendChild(root);

  try {
    const results = await axe.run(root, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'best-practice'],
      },
      rules: Object.fromEntries(DISABLED_RULES.map((id) => [id, { enabled: false }])),
    });

    if (results.violations.length > 0) {
      const summary = results.violations
        .map((v) => `  - [${v.id}] ${v.help} (${v.nodes.length} node${v.nodes.length === 1 ? '' : 's'})`)
        .join('\n');
      expect.fail(`axe found ${results.violations.length} accessibility violation(s):\n${summary}`);
    }
  } finally {
    // happy-dom can detach `<form>` mid-run; only remove if still connected.
    if (detached && root.isConnected && root.parentNode) {
      root.parentNode.removeChild(root);
    }
  }
}
