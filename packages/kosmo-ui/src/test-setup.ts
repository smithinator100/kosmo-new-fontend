/**
 * Vitest setup for happy-dom environment.
 *
 * Polyfills `Element.animate` so components can call WAAPI in tests without
 * blowing up. Only the bare minimum surface used by Kosmo components.
 */

if (typeof Element !== 'undefined' && !Element.prototype.animate) {
  type AnimateArgs = [Keyframe[] | PropertyIndexedKeyframes | null, number | KeyframeAnimationOptions | undefined];

  Element.prototype.animate = function animateStub(
    this: Element,
    ..._args: AnimateArgs
  ): Animation {
    const finished = Promise.resolve();
    const stub = {
      finished,
      cancel() {},
      finish() {},
      pause() {},
      play() {},
      reverse() {},
    } as unknown as Animation;
    return stub;
  };
}
