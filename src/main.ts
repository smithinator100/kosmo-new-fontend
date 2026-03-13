import './style.css';
import barba from '@barba/core';
import { createIcons, LoaderCircle, CornerDownLeft, Skull } from 'lucide';

const EASING_OPTIONS: { group: string | null; label: string; value: string }[] = [
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

const DEFAULT_EASING = 'cubic-bezier(0.645, 0.045, 0.355, 1)';

function populateEasingSelects(): void {
  document.querySelectorAll<HTMLSelectElement>('.anim-select').forEach((select) => {
    if (select.options.length > 0) return;
    let currentGroupLabel = '';
    let currentGroup: HTMLOptGroupElement | null = null;

    for (const { group, label, value } of EASING_OPTIONS) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      if (value === DEFAULT_EASING) option.selected = true;

      if (group) {
        if (group !== currentGroupLabel) {
          currentGroup = document.createElement('optgroup');
          currentGroup.label = group;
          select.appendChild(currentGroup);
          currentGroupLabel = group;
        }
        currentGroup!.appendChild(option);
      } else {
        select.appendChild(option);
        currentGroup = null;
        currentGroupLabel = '';
      }
    }
  });
}

function getAnimSetting(target: string, prop: string): { duration: number; easing: string; delay: number } {
  const easingEl = document.querySelector<HTMLSelectElement>(
    `.anim-select[data-anim-target="${target}"][data-anim-prop="${prop}"]`,
  );
  const durationEl = document.querySelector<HTMLInputElement>(
    `.anim-duration[data-anim-target="${target}"][data-anim-prop="${prop}"]`,
  );
  const delayEl = document.querySelector<HTMLInputElement>(
    `.anim-delay[data-anim-target="${target}"][data-anim-prop="${prop}"]`,
  );
  return {
    easing: easingEl?.value ?? DEFAULT_EASING,
    duration: durationEl ? parseInt(durationEl.value, 10) || 300 : 300,
    delay: delayEl ? parseInt(delayEl.value, 10) || 0 : 0,
  };
}

function getPositionSetting(target: string): { direction: string; distance: number; duration: number; easing: string } {
  const dirEl = document.querySelector<HTMLSelectElement>(`.anim-direction[data-anim-target="${target}"]`);
  const distEl = document.querySelector<HTMLInputElement>(`.anim-distance[data-anim-target="${target}"]`);
  const base = getAnimSetting(target, 'position');
  return {
    direction: dirEl?.value ?? 'left',
    distance: distEl ? parseInt(distEl.value, 10) || 16 : 16,
    ...base,
  };
}

function getScaleSetting(target: string): { endValue: number; duration: number; easing: string } {
  const valEl = document.querySelector<HTMLInputElement>(`.anim-scale-end[data-anim-target="${target}"]`);
  const base = getAnimSetting(target, 'scale');
  return {
    endValue: valEl ? parseFloat(valEl.value) : 1,
    ...base,
  };
}

function buildTranslateEnd(direction: string, distance: number): string {
  switch (direction) {
    case 'left': return `${-distance}px 0`;
    case 'right': return `${distance}px 0`;
    case 'up': return `0 ${-distance}px`;
    case 'down': return `0 ${distance}px`;
    default: return `${-distance}px 0`;
  }
}

const STORAGE_KEY = 'kosmo-anim-settings';

function saveAnimSettings(): void {
  const data: Record<string, string> = {};

  document.querySelectorAll<HTMLSelectElement>('.anim-select').forEach((el) => {
    const target = el.dataset.animTarget;
    const prop = el.dataset.animProp;
    if (target && prop) data[`${target}.${prop}.easing`] = el.value;
  });

  document.querySelectorAll<HTMLInputElement>('.anim-duration').forEach((el) => {
    const target = el.dataset.animTarget;
    const prop = el.dataset.animProp;
    if (target && prop) data[`${target}.${prop}.duration`] = el.value;
  });

  document.querySelectorAll<HTMLInputElement>('.anim-delay').forEach((el) => {
    const target = el.dataset.animTarget;
    const prop = el.dataset.animProp;
    if (target && prop) data[`${target}.${prop}.delay`] = el.value;
  });

  document.querySelectorAll<HTMLSelectElement>('.anim-direction').forEach((el) => {
    const target = el.dataset.animTarget;
    if (target) data[`${target}.direction`] = el.value;
  });

  document.querySelectorAll<HTMLInputElement>('.anim-distance').forEach((el) => {
    const target = el.dataset.animTarget;
    if (target) data[`${target}.distance`] = el.value;
  });

  document.querySelectorAll<HTMLInputElement>('.anim-scale-end').forEach((el) => {
    const target = el.dataset.animTarget;
    if (target) data[`${target}.scaleEnd`] = el.value;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadAnimSettings(): void {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  let data: Record<string, string>;
  try { data = JSON.parse(raw); } catch { return; }

  document.querySelectorAll<HTMLSelectElement>('.anim-select').forEach((el) => {
    const key = `${el.dataset.animTarget}.${el.dataset.animProp}.easing`;
    if (data[key]) el.value = data[key];
  });

  document.querySelectorAll<HTMLInputElement>('.anim-duration').forEach((el) => {
    const key = `${el.dataset.animTarget}.${el.dataset.animProp}.duration`;
    if (data[key]) el.value = data[key];
  });

  document.querySelectorAll<HTMLInputElement>('.anim-delay').forEach((el) => {
    const key = `${el.dataset.animTarget}.${el.dataset.animProp}.delay`;
    if (data[key]) el.value = data[key];
  });

  document.querySelectorAll<HTMLSelectElement>('.anim-direction').forEach((el) => {
    const key = `${el.dataset.animTarget}.direction`;
    if (data[key]) el.value = data[key];
  });

  document.querySelectorAll<HTMLInputElement>('.anim-distance').forEach((el) => {
    const key = `${el.dataset.animTarget}.distance`;
    if (data[key]) el.value = data[key];
  });

  document.querySelectorAll<HTMLInputElement>('.anim-scale-end').forEach((el) => {
    const key = `${el.dataset.animTarget}.scaleEnd`;
    if (data[key]) el.value = data[key];
  });
}

function initSaveButton(): void {
  const btn = document.getElementById('anim-save');
  if (!btn) return;
  btn.addEventListener('click', () => {
    saveAnimSettings();
    btn.textContent = 'Saved';
    setTimeout(() => { btn.textContent = 'Save'; }, 1200);
  });
}

function updateSidebarActive(): void {
  const path = window.location.pathname;
  document.querySelectorAll('.sidebar-nav .sidebar-item').forEach((el) => {
    const anchor = el as HTMLAnchorElement;
    const match =
      anchor.pathname === path ||
      (path === '/' && anchor.pathname === '/index.html') ||
      (path === '/index.html' && anchor.pathname === '/');
    anchor.classList.toggle('active', match);
  });
}

barba.hooks.before(() => {
  document.body.classList.add('is-transitioning');
});
let initialPluginBodyHTML = '';

function resetPrototype(): void {
  const container = document.querySelector('[data-barba-namespace="home"]');
  if (!container || !initialPluginBodyHTML) return;
  const pluginBody = container.querySelector('.plugin-body');
  if (!pluginBody) return;

  (pluginBody as HTMLElement).style.background = '';
  pluginBody.innerHTML = initialPluginBodyHTML;
  createIcons({ icons: { LoaderCircle }, attrs: { 'stroke-width': 1.5 } });
  initLoginBehavior();
}

function initLoginBehavior(): void {
  const container = document.querySelector('[data-barba-namespace="home"]');
  if (!container) return;

  const pluginBody = container.querySelector('.plugin-body');
  if (pluginBody && !initialPluginBodyHTML) {
    initialPluginBodyHTML = pluginBody.innerHTML;
  }

  const btn = container.querySelector('.login-btn') as HTMLButtonElement | null;
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (btn.classList.contains('is-loading')) return;
    btn.classList.add('is-loading');

    const face = btn.querySelector('.kosmo-btn-face');
    if (face) {
      const icon = document.createElement('i');
      icon.setAttribute('data-lucide', 'loader-circle');
      face.prepend(icon);
      createIcons({ icons: { LoaderCircle }, attrs: { 'stroke-width': 1.5 } });
    }

    setTimeout(() => {
      const pluginBody = container.querySelector('.plugin-body');
      if (!pluginBody) return;

      const loginPage = pluginBody.querySelector('.login-page') as HTMLElement | null;
      if (loginPage) {
        const title = loginPage.querySelector('.login-title') as HTMLElement | null;
        const hedgehog = loginPage.querySelector('.login-hedgehog-wrapper') as HTMLElement | null;
        const loginBtn = loginPage.querySelector('.login-btn') as HTMLElement | null;

        const bgSetting = getAnimSetting('background', 'color');
        const titlePos = getPositionSetting('title');
        const titleOpacity = getAnimSetting('title', 'opacity');
        const titleScale = getScaleSetting('title');
        const hedgehogPos = getPositionSetting('hedgehog');
        const hedgehogOpacity = getAnimSetting('hedgehog', 'opacity');
        const hedgehogScale = getScaleSetting('hedgehog');
        const buttonOpacity = getAnimSetting('button', 'opacity');
        const buttonScale = getScaleSetting('button');

        const animations: Animation[] = [];

        animations.push(loginPage.animate(
          [{ backgroundColor: '#B6EBFF' }, { backgroundColor: '#E8FDFF' }],
          { duration: bgSetting.duration, easing: bgSetting.easing, delay: bgSetting.delay, fill: 'forwards' },
        ));

        if (title) {
          const translateEnd = buildTranslateEnd(titlePos.direction, titlePos.distance);
          animations.push(title.animate(
            [{ translate: '0 0' }, { translate: translateEnd }],
            { duration: titlePos.duration, easing: titlePos.easing, delay: titlePos.delay, fill: 'forwards' },
          ));
          animations.push(title.animate(
            [{ opacity: 1 }, { opacity: 0 }],
            { duration: titleOpacity.duration, easing: titleOpacity.easing, delay: titleOpacity.delay, fill: 'forwards' },
          ));
          if (titleScale.endValue !== 1) {
            animations.push(title.animate(
              [{ scale: 1 }, { scale: titleScale.endValue }],
              { duration: titleScale.duration, easing: titleScale.easing, delay: titleScale.delay, fill: 'forwards' },
            ));
          }
        }
        if (hedgehog) {
          const translateEnd = buildTranslateEnd(hedgehogPos.direction, hedgehogPos.distance);
          animations.push(hedgehog.animate(
            [{ translate: '0 0' }, { translate: translateEnd }],
            { duration: hedgehogPos.duration, easing: hedgehogPos.easing, delay: hedgehogPos.delay, fill: 'forwards' },
          ));
          animations.push(hedgehog.animate(
            [{ opacity: 1 }, { opacity: 0 }],
            { duration: hedgehogOpacity.duration, easing: hedgehogOpacity.easing, delay: hedgehogOpacity.delay, fill: 'forwards' },
          ));
          if (hedgehogScale.endValue !== 1) {
            animations.push(hedgehog.animate(
              [{ scale: 1 }, { scale: hedgehogScale.endValue }],
              { duration: hedgehogScale.duration, easing: hedgehogScale.easing, delay: hedgehogScale.delay, fill: 'forwards' },
            ));
          }
        }
        if (loginBtn) {
          animations.push(loginBtn.animate(
            [{ opacity: 1 }, { opacity: 0 }],
            { duration: buttonOpacity.duration, easing: buttonOpacity.easing, delay: buttonOpacity.delay, fill: 'forwards' },
          ));
          if (buttonScale.endValue !== 1) {
            animations.push(loginBtn.animate(
              [{ scale: 1 }, { scale: buttonScale.endValue }],
              { duration: buttonScale.duration, easing: buttonScale.easing, delay: buttonScale.delay, fill: 'forwards' },
            ));
          }
        }

        Promise.all(animations.map((a) => a.finished)).then(() => {
          (pluginBody as HTMLElement).style.background = '#E8FDFF';

          pluginBody.innerHTML = `
            <div class="email-page">
              <p class="email-title">email address?</p>
              <div class="kosmo-input">
                <label class="kosmo-input-face">
                  <input type="email" class="kosmo-input-field" />
                  <i data-lucide="corner-down-left" class="kosmo-input-arrow" aria-hidden="true"></i>
                </label>
              </div>
              <img class="email-doodle" src="/src/assets/doodle-28.svg" alt="" />
            </div>`;

          createIcons({ icons: { CornerDownLeft }, attrs: { 'stroke-width': 1.5 } });

          const emailTitle = pluginBody.querySelector('.email-title') as HTMLElement;
          const emailInput = pluginBody.querySelector('.kosmo-input') as HTMLElement;
          const emailDoodle = pluginBody.querySelector('.email-doodle') as HTMLElement;

          [emailTitle, emailInput, emailDoodle].filter(Boolean).forEach((el) => {
            el.animate([{ opacity: 0 }, { opacity: 1 }], {
              duration: 200,
              easing: 'ease-in',
              fill: 'forwards',
            });
          });
        });
      }
    }, 400);
  });
}

function initInputArrowBehavior(): void {
  const container = document.querySelector('[data-barba-namespace="input"]');
  if (!container) return;
  const kosmoInput = container.querySelector('.kosmo-input:not(.is-focused):not(.is-error)');
  if (!kosmoInput) return;
  const input = kosmoInput.querySelector('.kosmo-input-field') as HTMLInputElement;
  const arrow = kosmoInput.querySelector('.kosmo-input-arrow');
  if (!input || !arrow) return;

  const update = (): void => {
    kosmoInput.classList.toggle('kosmo-input-has-text', input.value.trim().length > 0);
  };
  update();
  input.addEventListener('input', update);
  input.addEventListener('change', update);
}

barba.hooks.after((_data) => {
  document.body.classList.remove('is-transitioning');
  updateSidebarActive();
  populateEasingSelects();
  loadAnimSettings();
  initSaveButton();
  createIcons({ icons: { LoaderCircle, CornerDownLeft, Skull }, attrs: { 'stroke-width': 1.5 } });
  if (document.querySelector('[data-barba-namespace="input"]')) {
    initInputArrowBehavior();
  }
  if (document.querySelector('[data-barba-namespace="home"]')) {
    initLoginBehavior();
  }
});

barba.init({
  transitions: [
    {
      name: 'fade',
      leave(data) {
        return new Promise<void>((resolve) => {
          const animation = data.current.container.animate(
            [{ opacity: 1 }, { opacity: 0 }],
            { duration: 150, easing: 'ease-out', fill: 'forwards' },
          );
          animation.onfinish = () => resolve();
        });
      },
      enter(data) {
        return new Promise<void>((resolve) => {
          data.next.container.animate(
            [{ opacity: 0 }, { opacity: 1 }],
            { duration: 150, easing: 'ease-in', fill: 'forwards' },
          );
          setTimeout(resolve, 150);
        });
      },
    },
  ],
  views: [
    {
      namespace: 'home',
      beforeEnter() {
        document.title = 'KOSMO';
      },
    },
    {
      namespace: 'about',
      beforeEnter() {
        document.title = 'About - KOSMO';
      },
    },
    {
      namespace: 'button',
      beforeEnter() {
        document.title = 'Button - KOSMO';
      },
    },
    {
      namespace: 'login',
      beforeEnter() {
        document.title = 'Login - KOSMO';
      },
    },
    {
      namespace: 'input',
      beforeEnter() {
        document.title = 'Input - KOSMO';
      },
    },
  ],
});

updateSidebarActive();
populateEasingSelects();
loadAnimSettings();
initSaveButton();
createIcons({ icons: { LoaderCircle, CornerDownLeft, Skull }, attrs: { 'stroke-width': 1.5 } });
if (document.querySelector('[data-barba-namespace="input"]')) {
  initInputArrowBehavior();
}
if (document.querySelector('[data-barba-namespace="home"]')) {
  initLoginBehavior();
}

document.addEventListener('keydown', (e) => {
  if (e.key !== 'r' || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
  if (!document.querySelector('[data-barba-namespace="home"]')) return;
  resetPrototype();
});
