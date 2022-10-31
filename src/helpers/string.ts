export function includesIgnoreCase(left: string, right: string) {
  return left.toLowerCase().includes(right.toLowerCase());
}

export function stringToBoolean(subject: string | undefined): boolean {
  if (!subject) return false;

  const predicate = subject.toLowerCase();
  switch (predicate) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      throw new Error(`stringToBoolean tried to convert non-boolean: ${subject}`);
  }
}
