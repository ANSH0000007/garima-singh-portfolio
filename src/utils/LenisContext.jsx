import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext(null);

export function LenisProvider({ children }) {
  const lenisRef = useRef(null);
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let active = true;

    if (prefersReducedMotion) {
      document.documentElement.classList.add('reduce-motion');
      return;
    }

    const instance = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
    });

    lenisRef.current = instance;
    queueMicrotask(() => {
      if (active) setLenis(instance);
    });

    instance.on('scroll', ScrollTrigger.update);

    const raf = (time) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      instance.scrollTo(target, { offset: -90, duration: 1.1 });
      if (href.length > 1 && window.history?.pushState) {
        window.history.pushState(null, '', href);
      }
    };
    document.addEventListener('click', onClick);

    return () => {
      active = false;
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(raf);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}

export function useLenisInstance() {
  return useContext(LenisContext);
}
