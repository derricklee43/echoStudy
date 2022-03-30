import { RefObject, useEffect } from 'react';

/**
 * Perform an action (callback) whenever a click occurs outside of the ref object.
 * @param ref a reference to an HTMLElement, attach object from `useRef` to this
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const useOutsideClick = (ref: RefObject<HTMLElement>, action: Function): void => {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        action();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    // destructor; called when component using this hook gets destroyed
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [ref]);
};
