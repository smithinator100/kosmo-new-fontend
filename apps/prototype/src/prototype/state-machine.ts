/**
 * Prototype state machine.
 *
 * Drives the multi-step onboarding flow rendered inside the `home` view's
 * `.plugin-body` surface: login → email → verification → api-key → name →
 * plugins (and within plugins, a small tab state machine for the four
 * plugin-area tabs). Page bodies are pulled from `page-cache.ts`; outro/intro
 * animations are configured by the user via the anim panel and executed by
 * `runTransitionAnimations`.
 */

import { refreshIcons } from '../icons.ts';
import { getCachedContent } from '../page-cache.ts';
import { syncPanelToSettings, runTransitionAnimations } from './anim-panel.ts';
import { initPluginsScrollbar, initFavouritesScrollbar } from '../app-shell/scrollbars.ts';
import { initSearchBehavior } from '../app-shell/search-init.ts';

type PrototypeStep = 'login' | 'email' | 'verification' | 'api-key' | 'name' | 'plugins';

type ProtoTab = 'favourites' | 'plugins' | 'tools' | 'settings';

interface AnimTarget {
  el: HTMLElement;
  target: string;
}

const PROTOTYPE_STEPS: PrototypeStep[] = [
  'login',
  'email',
  'verification',
  'api-key',
  'name',
  'plugins',
];

const TAB_STATES: Record<ProtoTab, string[]> = {
  plugins: ['proto-plugins-empty', 'proto-plugins'],
  favourites: ['proto-favourites-empty', 'proto-favourites'],
  tools: ['proto-tools'],
  settings: ['proto-settings'],
};

let currentStep: PrototypeStep = 'login';
let isTransitioning = false;
let initialPluginBodyHTML = '';
let currentTab: ProtoTab = 'plugins';
let currentTabStateIdx = 1;

function getPluginContainer(): Element | null {
  return document.querySelector('[data-barba-namespace="home"]');
}

function setPageBackground(pluginBody: Element, value: string): void {
  (pluginBody as HTMLElement).style.background = value;
}

function applyCachedContent(pluginBody: Element, cacheKey: string): void {
  pluginBody.innerHTML = getCachedContent(cacheKey) ?? '';
}

function collect(pluginBody: Element, mappings: Array<[string, string]>): AnimTarget[] {
  const out: AnimTarget[] = [];
  for (const [selector, target] of mappings) {
    const el = pluginBody.querySelector(selector) as HTMLElement | null;
    if (el) out.push({ el, target });
  }
  return out;
}

// ── Login step ───────────────────────────────

function initLoginBehavior(): void {
  const container = getPluginContainer();
  if (!container) return;

  const pluginBody = container.querySelector('.plugin-body');
  if (pluginBody && !initialPluginBodyHTML) {
    initialPluginBodyHTML = pluginBody.innerHTML;
  }

  const btn = container.querySelector('.login-btn') as HTMLButtonElement | null;
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (btn.classList.contains('is-loading') || isTransitioning) return;
    btn.classList.add('is-loading');
    isTransitioning = true;

    const face = btn.querySelector('.kosmo-btn-face');
    if (face) {
      const icon = document.createElement('i');
      icon.setAttribute('data-lucide', 'loader-circle');
      face.prepend(icon);
      refreshIcons();
    }

    setTimeout(() => {
      const body = container.querySelector('.plugin-body');
      if (!body) return;
      const loginPage = body.querySelector('.login-page') as HTMLElement | null;
      if (!loginPage) return;

      syncPanelToSettings();

      const els: AnimTarget[] = [{ el: loginPage, target: 'background' }];
      els.push(
        ...collect(loginPage, [
          ['.login-title', 'title'],
          ['.login-hedgehog-wrapper', 'hedgehog'],
          ['.login-btn', 'button'],
        ]),
      );

      runTransitionAnimations(els, 'login-outro', 'out').then(() => {
        showEmailStep(body);
      });
    }, 400);
  });
}

function showLoginStep(pluginBody: Element): void {
  setPageBackground(pluginBody, '');
  pluginBody.innerHTML = getCachedContent('login') ?? initialPluginBodyHTML;
  refreshIcons();

  const loginPage = pluginBody.querySelector('.login-page') as HTMLElement | null;
  if (!loginPage) return;

  const els: AnimTarget[] = [{ el: loginPage, target: 'background' }];
  els.push(
    ...collect(loginPage, [
      ['.login-title', 'title'],
      ['.login-hedgehog-wrapper', 'hedgehog'],
      ['.login-btn', 'button'],
    ]),
  );

  runTransitionAnimations(els, 'login-intro', 'in').then(() => {
    currentStep = 'login';
    isTransitioning = false;
    initLoginBehavior();
  });
}

// ── Email step ───────────────────────────────

function showEmailStep(pluginBody: Element): void {
  setPageBackground(pluginBody, 'var(--ks-page-color-bg, #E8FDFF)');
  applyCachedContent(pluginBody, 'email');
  refreshIcons();

  const introElements = collect(pluginBody, [
    ['.email-title', 'email-title'],
    ['.kosmo-input', 'email-input'],
    ['.email-doodle', 'email-doodle'],
  ]);

  runTransitionAnimations(introElements, 'email-intro', 'in').then(() => {
    currentStep = 'email';
    isTransitioning = false;
    initEmailBehavior();
  });
}

function initEmailBehavior(): void {
  const container = getPluginContainer();
  if (!container) return;
  const pluginBody = container.querySelector('.plugin-body');
  if (!pluginBody) return;

  const emailInput = pluginBody.querySelector(
    '.email-page .kosmo-input-field',
  ) as HTMLInputElement | null;
  if (!emailInput) return;

  emailInput.focus();
  emailInput.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || isTransitioning) return;
    e.preventDefault();
    isTransitioning = true;
    syncPanelToSettings();

    const outroElements = collect(pluginBody, [
      ['.email-title', 'email-title'],
      ['.kosmo-input', 'email-input'],
      ['.email-doodle', 'email-doodle'],
    ]);

    runTransitionAnimations(outroElements, 'email-outro', 'out').then(() => {
      showVerificationStep(pluginBody);
    });
  });
}

// ── Verification step ────────────────────────

function showVerificationStep(pluginBody: Element): void {
  setPageBackground(pluginBody, 'var(--ks-page-color-bg, #FFFEEB)');
  applyCachedContent(pluginBody, 'verification');

  const introElements = collect(pluginBody, [
    ['.verification-title', 'verification-title'],
    ['.verification-inputs', 'verification-inputs'],
    ['.verification-resend', 'verification-resend'],
    ['.verification-doodle', 'verification-doodle'],
  ]);

  runTransitionAnimations(introElements, 'verification-intro', 'in').then(() => {
    currentStep = 'verification';
    isTransitioning = false;
  });

  const firstInput = pluginBody.querySelector(
    '.verification-inputs .kosmo-input-field',
  ) as HTMLInputElement | null;
  if (firstInput) firstInput.focus();

  initVerificationInputBehavior();
}

function initVerificationInputBehavior(): void {
  const container = getPluginContainer();
  if (!container) return;

  const inputs = container.querySelectorAll<HTMLInputElement>(
    '.verification-inputs .kosmo-input-field',
  );
  inputs.forEach((input, idx) => {
    input.addEventListener('input', () => {
      if (input.value.length === 1 && idx < inputs.length - 1) {
        inputs[idx + 1].focus();
      }
      const allFilled = Array.from(inputs).every((i) => i.value.length === 1);
      if (allFilled && !isTransitioning) {
        setTimeout(() => navigatePrototype('forward'), 400);
      }
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && input.value === '' && idx > 0) {
        inputs[idx - 1].focus();
      }
    });
  });
}

// ── API Key step ─────────────────────────────

function showApiKeyStep(pluginBody: Element): void {
  setPageBackground(pluginBody, 'var(--ks-page-color-bg, #f7ffec)');
  applyCachedContent(pluginBody, 'api-key');

  const introElements = collect(pluginBody, [
    ['.api-key-title', 'api-key-title'],
    ['.kosmo-input', 'api-key-input'],
    ['.api-key-hint', 'api-key-hint'],
    ['.api-key-doodle', 'api-key-doodle'],
  ]);

  runTransitionAnimations(introElements, 'api-key-intro', 'in').then(() => {
    currentStep = 'api-key';
    isTransitioning = false;
  });
}

// ── Name step ───────────────────────────────

function showNameStep(pluginBody: Element): void {
  setPageBackground(pluginBody, 'var(--ks-page-color-bg, #f7f7ff)');
  applyCachedContent(pluginBody, 'name');

  const introElements = collect(pluginBody, [
    ['.name-title', 'name-title'],
    ['.kosmo-input', 'name-input'],
    ['.name-doodle', 'name-doodle'],
  ]);

  runTransitionAnimations(introElements, 'name-intro', 'in').then(() => {
    currentStep = 'name';
    isTransitioning = false;
    initNameBehavior();
  });
}

function initNameBehavior(): void {
  const container = getPluginContainer();
  if (!container) return;
  const pluginBody = container.querySelector('.plugin-body');
  if (!pluginBody) return;

  const nameInput = pluginBody.querySelector(
    '.name-page .kosmo-input-field',
  ) as HTMLInputElement | null;
  if (!nameInput) return;

  nameInput.focus();
  nameInput.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || isTransitioning) return;
    e.preventDefault();
    navigatePrototype('forward');
  });
}

// ── Plugins tab system ───────────────────────

function renderProtoTab(pluginBody: Element): void {
  const states = TAB_STATES[currentTab];
  const cacheKey = states[currentTabStateIdx] ?? states[states.length - 1];
  setPageBackground(pluginBody, '');
  pluginBody.innerHTML = getCachedContent(cacheKey) ?? '';
  refreshIcons();
  initProtoTabBehavior(pluginBody);

  if (currentTab === 'plugins') {
    initPluginsScrollbar();
    initSearchBehavior();
  } else if (currentTab === 'favourites') {
    initFavouritesScrollbar();
    initSearchBehavior();
  }
}

function showPluginsStep(pluginBody: Element): void {
  currentTab = 'plugins';
  currentTabStateIdx = TAB_STATES.plugins.length - 1;
  renderProtoTab(pluginBody);
  currentStep = 'plugins';
  isTransitioning = false;
}

function switchProtoTab(pluginBody: Element, tab: ProtoTab): void {
  currentTab = tab;
  currentTabStateIdx = TAB_STATES[tab].length - 1;
  renderProtoTab(pluginBody);
}

function initProtoTabBehavior(pluginBody: Element): void {
  pluginBody.querySelectorAll<HTMLButtonElement>('[data-proto-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.protoTab as ProtoTab;
      if (tab === currentTab) return;
      switchProtoTab(pluginBody, tab);
    });
  });
}

// ── Outro / navigation ───────────────────────

function outroCurrentStep(pluginBody: Element): Promise<void> {
  syncPanelToSettings();

  const stepOutros: Record<Exclude<PrototypeStep, 'plugins'>, () => Promise<void>> = {
    login: () => {
      const loginPage = pluginBody.querySelector('.login-page') as HTMLElement | null;
      if (!loginPage) return Promise.resolve();
      const els: AnimTarget[] = [{ el: loginPage, target: 'background' }];
      els.push(
        ...collect(loginPage, [
          ['.login-title', 'title'],
          ['.login-hedgehog-wrapper', 'hedgehog'],
          ['.login-btn', 'button'],
        ]),
      );
      return runTransitionAnimations(els, 'login-outro', 'out');
    },
    email: () =>
      runTransitionAnimations(
        collect(pluginBody, [
          ['.email-title', 'email-title'],
          ['.kosmo-input', 'email-input'],
          ['.email-doodle', 'email-doodle'],
        ]),
        'email-outro',
        'out',
      ),
    verification: () =>
      runTransitionAnimations(
        collect(pluginBody, [
          ['.verification-title', 'verification-title'],
          ['.verification-inputs', 'verification-inputs'],
          ['.verification-resend', 'verification-resend'],
          ['.verification-doodle', 'verification-doodle'],
        ]),
        'verification-outro',
        'out',
      ),
    'api-key': () =>
      runTransitionAnimations(
        collect(pluginBody, [
          ['.api-key-title', 'api-key-title'],
          ['.kosmo-input', 'api-key-input'],
          ['.api-key-hint', 'api-key-hint'],
          ['.api-key-doodle', 'api-key-doodle'],
        ]),
        'api-key-outro',
        'out',
      ),
    name: () =>
      runTransitionAnimations(
        collect(pluginBody, [
          ['.name-title', 'name-title'],
          ['.kosmo-input', 'name-input'],
          ['.name-doodle', 'name-doodle'],
        ]),
        'name-outro',
        'out',
      ),
  };

  if (currentStep === 'plugins') {
    const frame = pluginBody.firstElementChild as HTMLElement | null;
    if (!frame) return Promise.resolve();
    const anim = frame.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 200, easing: 'ease-out', fill: 'forwards' },
    );
    return anim.finished.then(() => {});
  }

  return stepOutros[currentStep]?.() ?? Promise.resolve();
}

const stepRenderers: Record<PrototypeStep, (pluginBody: Element) => void> = {
  login: showLoginStep,
  email: showEmailStep,
  verification: showVerificationStep,
  'api-key': showApiKeyStep,
  name: showNameStep,
  plugins: showPluginsStep,
};

export function navigatePrototype(direction: 'forward' | 'back'): void {
  if (isTransitioning) return;
  const container = getPluginContainer();
  if (!container) return;
  const pluginBody = container.querySelector('.plugin-body');
  if (!pluginBody) return;

  const idx = PROTOTYPE_STEPS.indexOf(currentStep);
  const nextIdx = direction === 'forward' ? idx + 1 : idx - 1;
  if (nextIdx < 0 || nextIdx >= PROTOTYPE_STEPS.length) return;

  const nextStep = PROTOTYPE_STEPS[nextIdx];
  isTransitioning = true;

  outroCurrentStep(pluginBody).then(() => {
    stepRenderers[nextStep]?.(pluginBody);
  });
}

// ── Public lifecycle hooks ───────────────────

export function initPrototype(): void {
  initLoginBehavior();
}

export function resetPrototype(): void {
  const container = getPluginContainer();
  if (!container || !initialPluginBodyHTML) return;
  const pluginBody = container.querySelector('.plugin-body');
  if (!pluginBody) return;

  setPageBackground(pluginBody, '');
  pluginBody.innerHTML = initialPluginBodyHTML;
  currentStep = 'login';
  isTransitioning = false;
  currentTab = 'plugins';
  currentTabStateIdx = TAB_STATES.plugins.length - 1;
  refreshIcons();
  initLoginBehavior();
}

export function isAtPluginsStep(): boolean {
  return currentStep === 'plugins';
}

export function handleProtoStateArrowKey(e: KeyboardEvent): boolean {
  if (currentStep !== 'plugins') return false;

  const states = TAB_STATES[currentTab];
  if (states.length < 2) return false;

  e.preventDefault();

  const newIdx =
    e.key === 'ArrowDown'
      ? Math.min(currentTabStateIdx + 1, states.length - 1)
      : Math.max(currentTabStateIdx - 1, 0);

  if (newIdx === currentTabStateIdx) return true;
  currentTabStateIdx = newIdx;

  const container = getPluginContainer();
  if (!container) return true;
  const pluginBody = container.querySelector('.plugin-body');
  if (!pluginBody) return true;

  renderProtoTab(pluginBody);
  return true;
}
