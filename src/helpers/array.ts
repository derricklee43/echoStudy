export function getIntersection<T>(arr1: T[], arr2: T[]) {
  const set1 = Array.from(new Set(arr1));
  const set2 = Array.from(new Set(arr2));
  const intersection = new Set([...set1].filter((i) => set2.includes(i)));
  return Array.from(intersection);
}
