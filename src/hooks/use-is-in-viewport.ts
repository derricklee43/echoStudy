import { RefObject, useEffect, useMemo, useState } from 'react';

/**
 * @param enterOnce if this flag is set, the observer will only fire once (the first time entering viewport)
 * @returns whether or not the element ref intersects with the viewport.
 */
export function useIsInViewport(ref: RefObject<HTMLElement>, enterOnce?: boolean) {
  const [inViewport, setInViewport] = useState(false);

  const observer = useMemo(() => {
    return new IntersectionObserver(([entry]) => {
      setInViewport(entry.isIntersecting);
      if (enterOnce && entry.isIntersecting) {
        observer.disconnect();
      }
    });
  }, []);

  useEffect(() => {
    ref.current && observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, observer]);

  return { inViewport };
}
