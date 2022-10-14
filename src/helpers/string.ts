export function includesIgnoreCase(left: string, right: string) {
  return left.toLowerCase().includes(right.toLowerCase());
}

export function normalize(value: string) {
  return value.trim().toLocaleLowerCase();
}
