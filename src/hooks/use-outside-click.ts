import { RefObject, useEffect } from 'react';

/**
 * Perform an action (callback) whenever a click occurs outside of the ref object.
 *
 * @param ref a reference to an HTMLElement, attach object from `useRef` to this
 * @param action callback handler after a click outside occurs
 * @param active conditionally enable this hook (default: true [always enabled])
 * @param extraDeps extra dependencies to rehook; do NOT include types in `active`
 */
export const useOutsideClick = (
  ref: RefObject<HTMLElement>,
  action: (event: MouseEvent) => void,
  active = true,
  ...extraDeps: unknown[]
): void => {
  useEffect(() => {
    if (!active) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        action(event);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    // destructor; called when component using this hook gets destroyed or a dependency changes
    return () => {
      if (!active) return;
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [ref, action, active, ...extraDeps]);
};
