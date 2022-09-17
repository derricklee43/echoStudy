/**
 * Creates a user-type guard for objects provided a simple key-to-type schema.
 * Optional (?) types should not be provided in the simple schema.
 *
 * @param schema - (e.g.) { 'message': 'string', 'id': 'number' }
 */
export function objectSchemaSimple<T extends object>(schema: Record<string, string>) {
  return (subject: unknown): subject is T => {
    if (!isObject(subject)) {
      return false;
    }

    return Object.entries(schema).every(([key, expectedType]) => {
      const value = subject[key];
      return value && typeof value === expectedType;
    });
  };
}

export function isObject(subject: unknown): subject is Record<string, unknown> {
  return subject !== null && typeof subject === 'object' && !Array.isArray(subject);
}

export function isEmptyObject(subject: unknown): subject is Record<string, never> {
  return isObject(subject) && Object.keys(subject).length === 0;
}

export function isString(subject: unknown): subject is string {
  return typeof subject === 'string';
}
