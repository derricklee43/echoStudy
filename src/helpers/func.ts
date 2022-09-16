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

/**
 * clamps the number to the range specified
 * @param num - The number to be clamped
 * @param min - The minimum possible value
 * @param max - The maximum possible value
 */
export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

/**
 * Returns the absolute (floating) number of days between two dates.
 */
export function daysBetween(date1: Date, date2: Date): number {
  const dayMs = 86400000;
  const timeDiff = Math.abs(dateToUtcMs(date1) - dateToUtcMs(date2));
  return Math.floor(timeDiff / dayMs);
}

/**
 * Returns the date in UTC milliseconds.
 */
export function dateToUtcMs(date: Date): number {
  return Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes()
  );
}
