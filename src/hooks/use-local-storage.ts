import { isObject, isString } from '@/helpers/validator';

/**
 * Provides a simple interface to browser local storage with added support for:
 *   - built-in serialization and deserialization
 *
 * NOTE: Local storage changes are one to the window (tab).
 * If cross-tab changes need to be detected, you can subscribe to window's 'storage' event.
 *
 */
export function useLocalStorage() {
  return {
    getObject,
    getString,
    upsert,
    remove,
  };

  function getString(key: string): string | undefined {
    return localStorage.getItem(key) ?? undefined;
  }

  function getObject<T extends object>(key: string): T | undefined {
    const data = localStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : undefined;
  }

  function upsert(key: string, value: string | object): boolean {
    try {
      // value was an object
      if (isObject(value)) {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
        return true;
      }
      // value was a string
      else if (isString(value)) {
        localStorage.setItem(key, value);
        return true;
      }
      // value was anything else
      else {
        return false;
      }
    } catch {
      // potentially QuotaExceededError (storage full)
      // or the user-agent disabled local storage
      // regardless, we discard the error and return false for now
      return false;
    }
  }

  function remove(key: string): void {
    localStorage.removeItem(key);
  }
}
