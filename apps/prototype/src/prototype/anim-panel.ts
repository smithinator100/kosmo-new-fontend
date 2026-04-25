/**
 * Animation settings panel — config map, panel renderer, settings persistence,
 * and the animation runner used by the prototype state machine.
 *
 * Settings are persisted to disk through the dev-server's `/api/settings`
 * endpoint, with a one-time migration from the legacy `localStorage` payload.
 */

type PropType = 'position' | 'opacity' | 'scale' | 'color';

interface SectionConfig {
  label: string;
  target: string;
  props: PropType[];
}

interface EasingOption {
  group: string | null;
  label: string;
  value: string;
}

interface AnimTarget {
  el: HTMLElement;
  target: string;
}

const DEFAULT_EASING = 'cubic-bezier(0.645, 0.045, 0.355, 1)';

const EASING_OPTIONS: EasingOption[] = [
  { group: null, label: 'Linear', value: 'linear' },
  { group: 'Ease In', label: 'Quad', value: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)' },
  { group: 'Ease In', label: 'Cubic', value: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)' },
  { group: 'Ease In', label: 'Quint', value: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)' },
  { group: 'Ease Out', label: 'Quad', value: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' },
  { group: 'Ease Out', label: 'Cubic', value: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
  { group: 'Ease Out', label: 'Quint', value: 'cubic-bezier(0.23, 1, 0.32, 1)' },
  { group: 'Ease In Out', label: 'Quad', value: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)' },
  { group: 'Ease In Out', label: 'Cubic', value: 'cubic-bezier(0.645, 0.045, 0.355, 1)' },
  { group: 'Ease In Out', label: 'Quint', value: 'cubic-bezier(0.86, 0, 0.07, 1)' },
];

const TRANSITIONS: Record<string, SectionConfig[]> = {
  'login-intro': [
    { label: 'Title', target: 'title', props: ['position', 'opacity', 'scale'] },
    { label: 'Hedgehog', target: 'hedgehog', props: ['position', 'opacity', 'scale'] },
    { label: 'Login Button', target: 'button', props: ['opacity', 'scale'] },
    { label: 'Background', target: 'background', props: ['color'] },
  ],
  'login-outro': [
    { label: 'Title', target: 'title', props: ['position', 'opacity', 'scale'] },
    { label: 'Hedgehog', target: 'hedgehog', props: ['position', 'opacity', 'scale'] },
    { label: 'Login Button', target: 'button', props: ['opacity', 'scale'] },
    { label: 'Background', target: 'background', props: ['color'] },
  ],
  'email-intro': [
    { label: 'Email Title', target: 'email-title', props: ['position', 'opacity', 'scale'] },
    { label: 'Email Input', target: 'email-input', props: ['position', 'opacity', 'scale'] },
    { label: 'Email Doodle', target: 'email-doodle', props: ['position', 'opacity', 'scale'] },
  ],
  'email-outro': [
    { label: 'Email Title', target: 'email-title', props: ['position', 'opacity', 'scale'] },
    { label: 'Email Input', target: 'email-input', props: ['position', 'opacity', 'scale'] },
    { label: 'Email Doodle', target: 'email-doodle', props: ['position', 'opacity', 'scale'] },
  ],
  'verification-intro': [
    { label: 'Verification Title', target: 'verification-title', props: ['position', 'opacity', 'scale'] },
    { label: 'Verification Inputs', target: 'verification-inputs', props: ['position', 'opacity', 'scale'] },
    { label: 'Resend Link', target: 'verification-resend', props: ['position', 'opacity', 'scale'] },
    { label: 'Verification Doodle', target: 'verification-doodle', props: ['position', 'opacity', 'scale'] },
  ],
  'verification-outro': [
    { label: 'Verification Title', target: 'verification-title', props: ['position', 'opacity', 'scale'] },
    { label: 'Verification Inputs', target: 'verification-inputs', props: ['position', 'opacity', 'scale'] },
    { label: 'Resend Link', target: 'verification-resend', props: ['position', 'opacity', 'scale'] },
    { label: 'Verification Doodle', target: 'verification-doodle', props: ['position', 'opacity', 'scale'] },
  ],
  'api-key-intro': [
    { label: 'API Key Title', target: 'api-key-title', props: ['position', 'opacity', 'scale'] },
    { label: 'API Key Input', target: 'api-key-input', props: ['position', 'opacity', 'scale'] },
    { label: 'API Key Hint', target: 'api-key-hint', props: ['position', 'opacity', 'scale'] },
    { label: 'API Key Doodle', target: 'api-key-doodle', props: ['position', 'opacity', 'scale'] },
  ],
  'api-key-outro': [
    { label: 'API Key Title', target: 'api-key-title', props: ['position', 'opacity', 'scale'] },
    { label: 'API Key Input', target: 'api-key-input', props: ['position', 'opacity', 'scale'] },
    { label: 'API Key Hint', target: 'api-key-hint', props: ['position', 'opacity', 'scale'] },
    { label: 'API Key Doodle', target: 'api-key-doodle', props: ['position', 'opacity', 'scale'] },
  ],
  'name-intro': [
    { label: 'Name Title', target: 'name-title', props: ['position', 'opacity', 'scale'] },
    { label: 'Name Input', target: 'name-input', props: ['position', 'opacity', 'scale'] },
    { label: 'Name Doodle', target: 'name-doodle', props: ['position', 'opacity', 'scale'] },
  ],
  'name-outro': [
    { label: 'Name Title', target: 'name-title', props: ['position', 'opacity', 'scale'] },
    { label: 'Name Input', target: 'name-input', props: ['position', 'opacity', 'scale'] },
    { label: 'Name Doodle', target: 'name-doodle', props: ['position', 'opacity', 'scale'] },
  ],
};

let allSettings: Record<string, Record<string, string>> = {};
let activeTransitionId = 'login-outro';

// ── Settings storage ─────────────────────────

function getSetting(tid: string, key: string, fallback: string): string {
  return allSettings[tid]?.[key] ?? fallback;
}

function setSetting(tid: string, key: string, value: string): void {
  if (!allSettings[tid]) allSettings[tid] = {};
  allSettings[tid][key] = value;
}

export function syncPanelToSettings(): void {
  const body = document.getElementById('anim-settings-body');
  if (!body) return;
  body.querySelectorAll<HTMLInputElement | HTMLSelectElement>('.anim-input').forEach((el) => {
    const key = el.dataset.key;
    if (key) setSetting(activeTransitionId, key, el.value);
  });
}

export async function saveAllSettings(): Promise<void> {
  syncPanelToSettings();
  await fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(allSettings),
  });
}

export async function loadAllSettings(): Promise<void> {
  try {
    const res = await fetch('/api/settings');
    const data = await res.json();
    allSettings = data;
  } catch {
    /* defaults on failure */
  }

  const hasSettings = Object.keys(allSettings).some(
    (k) => Object.keys(allSettings[k] ?? {}).length > 0,
  );
  if (hasSettings) return;

  const legacy =
    localStorage.getItem('kosmo-anim-settings-v2') ?? localStorage.getItem('kosmo-anim-settings');
  if (!legacy) return;

  try {
    const parsed: Record<string, string> = JSON.parse(legacy);
    allSettings['login-outro'] = { ...parsed };
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(allSettings),
    });
  } catch {
    /* ignore malformed legacy payload */
  }
}

// ── Setting readers ──────────────────────────

function readAnimSetting(tid: string, target: string, prop: string) {
  return {
    easing: getSetting(tid, `${target}.${prop}.easing`, DEFAULT_EASING),
    duration: parseInt(getSetting(tid, `${target}.${prop}.duration`, '300'), 10),
    delay: parseInt(getSetting(tid, `${target}.${prop}.delay`, '0'), 10),
  };
}

function readPositionSetting(tid: string, target: string) {
  return {
    direction: getSetting(tid, `${target}.direction`, 'left'),
    distance: parseInt(getSetting(tid, `${target}.distance`, '16'), 10),
    ...readAnimSetting(tid, target, 'position'),
  };
}

function readScaleSetting(tid: string, target: string) {
  return {
    endValue: parseFloat(getSetting(tid, `${target}.scaleEnd`, '1')),
    ...readAnimSetting(tid, target, 'scale'),
  };
}

// ── Panel HTML generators ────────────────────

function easingOptionsHTML(selected: string): string {
  let html = '';
  let group = '';
  for (const opt of EASING_OPTIONS) {
    if (opt.group && opt.group !== group) {
      if (group) html += '</optgroup>';
      html += `<optgroup label="${opt.group}">`;
      group = opt.group;
    } else if (!opt.group && group) {
      html += '</optgroup>';
      group = '';
    }
    html += `<option value="${opt.value}"${opt.value === selected ? ' selected' : ''}>${opt.label}</option>`;
  }
  if (group) html += '</optgroup>';
  return html;
}

function directionSelectHTML(target: string, selected: string): string {
  const dirs = ['left', 'right', 'up', 'down'];
  const opts = dirs
    .map(
      (d) =>
        `<option value="${d}"${d === selected ? ' selected' : ''}>${d[0].toUpperCase() + d.slice(1)}</option>`,
    )
    .join('');
  return `<select class="anim-input anim-direction" data-key="${target}.direction">${opts}</select>`;
}

function durationField(target: string, prop: string, value: string, unit = 'ms', step = 50): string {
  return `<label class="anim-field">
    <span class="anim-field-label">${prop[0].toUpperCase() + prop.slice(1)}</span>
    <div class="anim-duration-wrap">
      <input type="number" class="anim-input anim-duration" data-key="${target}.${prop}" value="${value}" min="0" step="${step}" />
      <span class="anim-duration-unit">${unit}</span>
    </div>
  </label>`;
}

function easingField(target: string, easing: string, key: string): string {
  return `<label class="anim-field">
    <span class="anim-field-label">Curve</span>
    <select class="anim-input anim-select" data-key="${target}.${key}.easing">${easingOptionsHTML(easing)}</select>
  </label>`;
}

function durationDelayFields(tid: string, target: string, prop: string): string {
  const easing = getSetting(tid, `${target}.${prop}.easing`, DEFAULT_EASING);
  const dur = getSetting(tid, `${target}.${prop}.duration`, '300');
  const del = getSetting(tid, `${target}.${prop}.delay`, '0');
  return [
    easingField(target, easing, prop),
    durationField(target, `${prop}.duration`, dur),
    durationField(target, `${prop}.delay`, del),
  ].join('');
}

function positionPropHTML(tid: string, target: string): string {
  const dir = getSetting(tid, `${target}.direction`, 'left');
  const dist = getSetting(tid, `${target}.distance`, '16');

  return `<div class="anim-prop">
    <span class="anim-prop-label">Position</span>
    <div class="anim-prop-controls">
      <label class="anim-field">
        <span class="anim-field-label">Direction</span>
        ${directionSelectHTML(target, dir)}
      </label>
      <label class="anim-field">
        <span class="anim-field-label">Distance</span>
        <div class="anim-duration-wrap">
          <input type="number" class="anim-input anim-duration" data-key="${target}.distance" value="${dist}" min="0" step="1" />
          <span class="anim-duration-unit">px</span>
        </div>
      </label>
      ${durationDelayFields(tid, target, 'position')}
    </div>
  </div>`;
}

function opacityPropHTML(tid: string, target: string): string {
  return `<div class="anim-prop">
    <span class="anim-prop-label">Opacity</span>
    <div class="anim-prop-controls">${durationDelayFields(tid, target, 'opacity')}</div>
  </div>`;
}

function scalePropHTML(tid: string, target: string): string {
  const endVal = getSetting(tid, `${target}.scaleEnd`, '1');
  return `<div class="anim-prop">
    <span class="anim-prop-label">Scale</span>
    <div class="anim-prop-controls">
      <label class="anim-field">
        <span class="anim-field-label">End</span>
        <div class="anim-duration-wrap">
          <input type="number" class="anim-input anim-duration" data-key="${target}.scaleEnd" value="${endVal}" min="0" max="2" step="0.05" />
        </div>
      </label>
      ${durationDelayFields(tid, target, 'scale')}
    </div>
  </div>`;
}

function colorPropHTML(tid: string, target: string): string {
  return `<div class="anim-prop">
    <span class="anim-prop-label">Color</span>
    <div class="anim-prop-controls">${durationDelayFields(tid, target, 'color')}</div>
  </div>`;
}

const PROP_GENERATORS: Record<PropType, (tid: string, target: string) => string> = {
  position: positionPropHTML,
  opacity: opacityPropHTML,
  scale: scalePropHTML,
  color: colorPropHTML,
};

function renderPanel(tid: string): void {
  const body = document.getElementById('anim-settings-body');
  if (!body) return;
  const sections = TRANSITIONS[tid];
  if (!sections) return;

  body.innerHTML = sections
    .map((section) => {
      const propsHTML = section.props.map((p) => PROP_GENERATORS[p](tid, section.target)).join('');
      return `<details class="anim-section" open>
        <summary class="anim-section-header">${section.label}</summary>
        <div class="anim-section-body">${propsHTML}</div>
      </details>`;
    })
    .join('');

  body.querySelectorAll<HTMLInputElement | HTMLSelectElement>('.anim-input').forEach((el) => {
    const handler = (): void => {
      const key = el.dataset.key;
      if (key) setSetting(activeTransitionId, key, el.value);
    };
    el.addEventListener('change', handler);
    el.addEventListener('input', handler);
  });
}

function initTransitionMenu(): void {
  document.querySelectorAll<HTMLButtonElement>('.transition-menu-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      syncPanelToSettings();
      const tid = btn.dataset.transition;
      if (!tid) return;
      activeTransitionId = tid;
      document.querySelectorAll('.transition-menu-item').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      renderPanel(activeTransitionId);
    });
  });
}

function initSaveButton(): void {
  const btn = document.getElementById('anim-save');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    await saveAllSettings();
    btn.textContent = 'Saved';
    setTimeout(() => {
      btn.textContent = 'Save';
    }, 1200);
  });
}

export function initAnimPanel(): void {
  renderPanel(activeTransitionId);
  initTransitionMenu();
  initSaveButton();
}

// ── Animation runner ─────────────────────────

function buildTranslateEnd(direction: string, distance: number): string {
  switch (direction) {
    case 'right': return `${distance}px 0`;
    case 'up': return `0 ${-distance}px`;
    case 'down': return `0 ${distance}px`;
    case 'left':
    default: return `${-distance}px 0`;
  }
}

export function runTransitionAnimations(
  elements: AnimTarget[],
  transitionId: string,
  direction: 'in' | 'out',
): Promise<void> {
  const sections = TRANSITIONS[transitionId];
  if (!sections) return Promise.resolve();
  const animations: Animation[] = [];

  for (const { el, target } of elements) {
    const section = sections.find((s) => s.target === target);
    if (!section) continue;

    for (const prop of section.props) {
      if (prop === 'position') {
        const pos = readPositionSetting(transitionId, target);
        const end = buildTranslateEnd(pos.direction, pos.distance);
        animations.push(
          el.animate(
            direction === 'out'
              ? [{ translate: '0 0' }, { translate: end }]
              : [{ translate: end }, { translate: '0 0' }],
            { duration: pos.duration, easing: pos.easing, delay: pos.delay, fill: 'forwards' },
          ),
        );
      }

      if (prop === 'opacity') {
        const opa = readAnimSetting(transitionId, target, 'opacity');
        animations.push(
          el.animate(
            direction === 'out'
              ? [{ opacity: 1 }, { opacity: 0 }]
              : [{ opacity: 0 }, { opacity: 1 }],
            { duration: opa.duration, easing: opa.easing, delay: opa.delay, fill: 'forwards' },
          ),
        );
      }

      if (prop === 'scale') {
        const sc = readScaleSetting(transitionId, target);
        if (sc.endValue !== 1) {
          animations.push(
            el.animate(
              direction === 'out'
                ? [{ scale: 1 }, { scale: sc.endValue }]
                : [{ scale: sc.endValue }, { scale: 1 }],
              { duration: sc.duration, easing: sc.easing, delay: sc.delay, fill: 'forwards' },
            ),
          );
        }
      }

      if (prop === 'color') {
        const col = readAnimSetting(transitionId, target, 'color');
        animations.push(
          el.animate(
            direction === 'out'
              ? [{ backgroundColor: '#B6EBFF' }, { backgroundColor: '#E8FDFF' }]
              : [{ backgroundColor: '#E8FDFF' }, { backgroundColor: '#B6EBFF' }],
            { duration: col.duration, easing: col.easing, delay: col.delay, fill: 'forwards' },
          ),
        );
      }
    }
  }

  if (animations.length === 0) return Promise.resolve();
  return Promise.all(animations.map((a) => a.finished)).then(() => {});
}
