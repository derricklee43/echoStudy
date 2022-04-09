import { RefObject, useEffect } from 'react';
import { FOCUSABLE_ELEMENTS_QUERY } from './use-focus-trap';

/**
 * Trap accessibility focus within the ref object.
 *
 * @param ref a reference to an HTMLElement, attach object from `useRef` to this
 * @param active conditionally enable this hook (default: true [always enabled])
 * @param timeout workaround for unfocusable elements in the case of animations or ref hooking
 * @param extraDeps extra dependencies to rehook; do NOT include types in `active`
 */
export const useFocusFirst = (
  ref: RefObject<HTMLElement>,
  active = true,
  timeout = 100,
  ...extraDeps: unknown[]
): void => {
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (active) {
      const focusableNodes = ref?.current?.querySelectorAll(FOCUSABLE_ELEMENTS_QUERY);
      const firstFocusableElement = focusableNodes?.item(0) as HTMLElement;
      if (!firstFocusableElement) return;

      // workaround for ref & animation making element unfocusable immediately
      timeoutId = setTimeout(() => firstFocusableElement.focus(), timeout);
    }

    // destructor; called when component using this hook gets destroyed or a dependency changes
    return () => clearTimeout(timeoutId);
  }, [ref, active, ...extraDeps]);
};
