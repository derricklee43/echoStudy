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

export function pop<T>(arrayRef: [T[], React.Dispatch<React.SetStateAction<T[]>>]) {
  const [array, setArray] = arrayRef;
  if (array.length === 0) {
    throw Error('unable to pop empty array');
  }
  const top = array[0];
  setArray(array.slice(1));
  return top;
}

export function push<T>(arrayRef: [T[], React.Dispatch<React.SetStateAction<T[]>>], item: T) {
  const [array, setArray] = arrayRef;
  setArray([item, ...array]);
}

// export function pop<T>(arrayRef: React.MutableRefObject<T[]>) {
//   if (arrayRef.current.length === 0) {
//     throw Error('unable to pop empty array');
//   }
//   const top = arrayRef.current[0];
//   arrayRef.current = arrayRef.current.slice(1);
//   return top;
// }

// export function push<T>(arrayRef: React.MutableRefObject<T[]>, item: T) {
//   arrayRef.current = [item, ...arrayRef.current];
// }
