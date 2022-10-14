import { useEffect, useRef } from 'react';

/**
 * @returns a `MutableRefObject<boolean>` that returns whether the component is mounted or not
 */
export function useMountedRef() {
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return mountedRef;
}
