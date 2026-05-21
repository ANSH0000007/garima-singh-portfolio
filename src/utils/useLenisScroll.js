import { useCallback } from 'react';
import { useLenisInstance } from './LenisContext';

const HEADER_OFFSET = -90;

export function useLenisScroll() {
  const lenis = useLenisInstance();

  const scrollTo = useCallback(
    (target, options = {}) => {
      const { offset = HEADER_OFFSET, duration = 1.2, immediate = false } = options;

      let el = target;
      if (typeof target === 'string') {
        el = document.querySelector(target);
      }
      if (!el) return;

      const href = typeof target === 'string' ? target : null;
      if (href && href.startsWith('#') && window.history?.pushState) {
        window.history.pushState(null, '', href);
      }

      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(el, { offset, duration: immediate ? 0 : duration });
      } else {
        const y = el.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' });
      }
    },
    [lenis]
  );

  const getScrollY = useCallback(() => {
    if (lenis && typeof lenis.scroll === 'number') return lenis.scroll;
    return window.scrollY;
  }, [lenis]);

  return { lenis, scrollTo, getScrollY };
}
