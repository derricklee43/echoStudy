/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */

/**
 * Delay the invokation of a function until at least `ms`
 * milliseconds have occured since the last invokation.
 */
export function debounce(func: Function, delayMs: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: unknown, ...args: unknown[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delayMs);
  };
}

/**
 * Eagerly throttles the invokation of a function to at most `ms`
 * milliseconds since the last invokation.
 */
export function throttle(func: Function, delayMs: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  let lastInvoked: number;
  return function (this: unknown, ...args: unknown[]) {
    // eagerly invoke if never called yet
    if (!lastInvoked) {
      func.apply(this, args);
      lastInvoked = Date.now();
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (Date.now() - lastInvoked >= delayMs) {
          func.apply(this, args);
          lastInvoked = Date.now();
        }
      }, delayMs - (Date.now() - lastInvoked));
    }
  };
}

export function noop() {
  return () => {};
}

/**
 * clamps the number to the range specified
 * @param num - The number to be clamped
 * @param min - The minimum possible value
 * @param max - The maximum possible value
 */
export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}
