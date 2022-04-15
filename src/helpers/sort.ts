/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Compares the two items and returns:
 *  -  1 if a > b
 *  -  0 if a == b
 *  - -1 if a < b
 *
 * Both parameters must be 'comparable' using =, <, >, <=, >=, operators.
 */
export function compare(a: any, b: any): number {
  return Number(a > b) - Number(b > a);
}

/**
 * Shuffle the array using Durstenfeld shuffle, an optimized version of Fisher-Yates.
 * @param arr any array to be shuffled
 */
export function shuffle<T>(arr: T[]): T[] {
  const newArr = [...arr];

  for (let i = newArr.length - 1; i >= 1; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]]; // swap
  }

  return newArr;
}
