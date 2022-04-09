import { RefObject, useEffect, useLayoutEffect } from 'react';

export const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'area[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  '[tabindex="0"]',
];

// to be used in document.querySelectorAll(...)
export const FOCUSABLE_ELEMENTS_QUERY = FOCUSABLE_ELEMENTS.join(',');

/**
 * Trap accessibility focus within the ref object.
 *
 * @param ref a reference to an HTMLElement, attach object from `useRef` to this
 * @param active conditionally enable this hook (default: true [always enabled])
 * @param extraDeps extra dependencies to rehook; do NOT include types in `active`
 */
export const useFocusTrap = (
  ref: RefObject<HTMLElement>,
  active = true,
  ...extraDeps: unknown[]
): void => {
  useEffect(() => {
    if (!active) return;

    const keyListener = (event: KeyboardEvent) => {
      // handle TAB key
      if (event.key === 'Tab') {
        const focusableNodes = ref?.current?.querySelectorAll(FOCUSABLE_ELEMENTS_QUERY);
        debugger;
        if (!focusableNodes) return;

        const firstFocusableElement = focusableNodes.item(0) as HTMLElement;
        const lastFocusableElement = focusableNodes.item(focusableNodes.length - 1) as HTMLElement;

        // was the only focusable element, keep focus
        if (firstFocusableElement === lastFocusableElement) {
          firstFocusableElement.focus();
          event.preventDefault();
          return;
        }

        // handle SHIFT + TAB on first element (reverse wrap to end)
        if (event.shiftKey && document.activeElement === firstFocusableElement) {
          event.preventDefault();
          lastFocusableElement.focus();
        }
        // handle TAB on last element (wrap to first)
        else if (document.activeElement === lastFocusableElement) {
          event.preventDefault();
          firstFocusableElement.focus();
        }
      }
    };

    document.addEventListener('keydown', keyListener);

    // destructor; called when component using this hook gets destroyed or a dependency changes
    return () => {
      if (!active) return;
      document.removeEventListener('keydown', keyListener);
    };
  }, [ref, active, ...extraDeps]);
};
