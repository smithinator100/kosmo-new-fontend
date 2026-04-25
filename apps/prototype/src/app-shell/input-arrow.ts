/**
 * Wires the inline submit-arrow on the input preview page so the arrow toggles
 * its visible state based on whether the field has any non-whitespace text.
 *
 * The base `kosmo-input` styling and focus/error states are owned by the
 * `@kosmo/ui` Input component; this module only handles the prototype-specific
 * trailing arrow.
 */

export function initInputArrowBehavior(): void {
  const container = document.querySelector('[data-barba-namespace="input"]');
  if (!container) return;

  const root = container.querySelector('.kosmo-input:not(.is-focused):not(.is-error)');
  if (!root) return;

  const field = root.querySelector<HTMLInputElement>('.kosmo-input-field');
  const arrow = root.querySelector('.kosmo-input-arrow');
  if (!field || !arrow) return;

  function update(): void {
    if (!field || !root) return;
    root.classList.toggle('kosmo-input-has-text', field.value.trim().length > 0);
  }
  update();
  field.addEventListener('input', update);
  field.addEventListener('change', update);
}
