export function includesIgnoreCase(left: string, right: string) {
  return left.toLowerCase().includes(right.toLowerCase());
}

/**
 * @param fallback a fallback value to return if subject is not a boolean; if not supplied, returns false.
 * @returns the boolean representation of `subject`; if subject is not a boolean, return fallback.
 */
export function stringToBoolean(subject: string | undefined, fallback?: boolean): boolean {
  if (!subject) return fallback ?? false;

  const predicate = subject.toLowerCase();
  switch (predicate) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      if (fallback) return fallback;
      throw new Error(`stringToBoolean tried to convert non-boolean: ${subject}`);
  }
}
