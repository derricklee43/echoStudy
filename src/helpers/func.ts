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

export function noop() {
  return () => {};
}
