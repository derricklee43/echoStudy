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

/**
 * @returns a string only with alphanumeric symbols kept (works for most languages)
 */
export function replaceNonAlphanumeric(text: string) {
  // \p{L} matches any kind of letter from any language
  // \d matches a digit zero-nine in any non ideographic scripts
  // <space> matches a space character
  // gu - regex flags (g) matches globally and (u) in unicode
  return text.replace(/[^\p{L}\d ]/gu, '');
}
