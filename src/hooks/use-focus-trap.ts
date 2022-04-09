import { RefObject, useEffect } from 'react';

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
        event.preventDefault();

        const focusableNodes = ref?.current?.querySelectorAll(FOCUSABLE_ELEMENTS_QUERY);
        if (!focusableNodes) return;

        const firstFocusableElement = focusableNodes.item(0) as HTMLElement;
        const lastFocusableElement = focusableNodes.item(focusableNodes.length - 1) as HTMLElement;

        // was the only focusable element, keep focus
        if (firstFocusableElement === lastFocusableElement) {
          firstFocusableElement.focus();
          return;
        }

        // handle SHIFT + TAB on first element (reverse wrap to end)
        if (event.shiftKey && document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          return;
        }
        // handle TAB on last element (wrap to first)
        else if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          return;
        }

        // handle cycling through the focus in the trap
        // (focusableNodes.length >= 2 at this point)
        let currFocusedIndex = -1;
        const focusedInTrap = Array.from(focusableNodes).some((element, idx) => {
          if (document.activeElement !== element) {
            return false;
          }
          currFocusedIndex = idx;
          return true;
        });

        // focus was outside ref, focus first
        if (!focusedInTrap) {
          firstFocusableElement.focus();
        }
        // otherwise, focus prev/next element in trap
        else {
          const offset = event.shiftKey ? -1 : 1;
          const elementToFocus = focusableNodes.item(currFocusedIndex + offset) as HTMLElement;
          elementToFocus.focus();
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
