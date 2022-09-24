import { useEffect } from 'react';

/**
 * Perform an action (callback) whenever a key press occurs.
 *
 * @param key the key string pressed (e.g. 'Tab' or 'Escape')
 * @param action callback handler after a click outside occurs
 * @param active conditionally enable this hook (default: true [always enabled])
 * @param extraDeps extra dependencies to rehook; do NOT include types in `active`
 */
export const useKeyPress = (
  key: string,
  action: (event: KeyboardEvent) => void,
  active = true,
  ...extraDeps: unknown[]
): void => {
  useEffect(() => {
    if (!active) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === key) {
        action(event);
      }
    };
    document.addEventListener('keydown', handleKeyPress);

    // destructor; called when component using this hook gets destroyed or a dependency changes
    return () => {
      if (!active) return;
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [key, action, active, ...extraDeps]);
};

/**
 * Convenience case for pressing the `Escape` key.
 */
export const useEscapePress = (
  action: (event: KeyboardEvent) => void,
  active = true,
  ...extraDeps: unknown[]
) => {
  return useKeyPress('Escape', action, active, extraDeps);
};
