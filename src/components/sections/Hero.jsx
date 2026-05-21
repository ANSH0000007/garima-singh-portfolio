import { useRef, useEffect, useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Marquee from '../Marquee';
import MagneticButton from '../MagneticButton';
import portraitUrl from '../../assets/garima-portrait.jpeg';

const HeroPortrait = lazy(() => import('../canvas/HeroPortrait'));

export default function Hero() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const portraitWrapRef = useRef(null);
  const [showPortraitCanvas, setShowPortraitCanvas] = useState(false);

  useEffect(() => {
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const update = () => setShowPortraitCanvas(!reducedQuery.matches && !mobileQuery.matches);

    update();
    reducedQuery.addEventListener('change', update);
    mobileQuery.addEventListener('change', update);
    return () => {
      reducedQuery.removeEventListener('change', update);
      mobileQuery.removeEventListener('change', update);
    };
  }, []);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion || !sectionRef.current) return;

      if (titleRef.current) {
        gsap.to(titleRef.current, {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.25,
          },
        });
      }
      if (portraitWrapRef.current) {
        gsap.to(portraitWrapRef.current, {
          yPercent: -4,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.25,
          },
        });
      }
    },
    { scope: sectionRef }
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.18 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0, transition: { ease: [0.25, 1, 0.5, 1], duration: 0.9 } },
  };

  const ctaVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { ease: [0.25, 1, 0.5, 1], duration: 0.7, delay: 0.62 } },
  };

  return (
    <div className="hero-shell min-h-screen flex flex-col pt-28 pb-4 scroll-scene">
      <section
        id="hero"
        ref={sectionRef}
        className="hero-scene relative flex-1 flex flex-col items-center justify-center text-center px-page overflow-hidden z-10 [&>*]:relative"
      >
        <motion.div
          className="flex flex-col items-center z-10 w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p 
            variants={itemVariants}
            className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-tertiary mb-4"
          >
            Graphic Designer & Artist
          </motion.p>

          <motion.div ref={titleRef} variants={itemVariants} className="w-full">
            <h1 className="hidden md:block font-serif font-semibold text-cocoa leading-[0.92] text-[clamp(4.25rem,12vw,7.75rem)] mb-6">
              GARIMA SINGH
            </h1>
            <div aria-hidden="true" className="md:hidden font-serif font-semibold text-cocoa text-[clamp(2.7rem,14vw,3.65rem)] leading-none mb-6">
              Garima Singh
            </div>
          </motion.div>

          <motion.div
            ref={portraitWrapRef}
            variants={itemVariants}
            className="order-4 md:order-none relative w-56 h-[19rem] sm:w-72 sm:h-[24rem] md:w-[23rem] md:h-[30rem] mx-auto mb-6 md:mb-10 z-10"
          >
            <div className="portrait-frame relative w-full h-full overflow-hidden bg-rose shadow-[0_26px_80px_rgba(212,20,120,0.18)] pointer-events-auto min-h-[14rem] border border-white/45">
              <img src={portraitUrl} alt="Portrait of Garima Singh" className="absolute inset-0 w-full h-full object-cover object-[50%_46%]" loading="eager" />
              {showPortraitCanvas && (
                <Suspense
                  fallback={
                    <div className="absolute inset-0 bg-rose/10" aria-hidden="true" />
                  }
                >
                  <div className="absolute inset-0 opacity-55 mix-blend-soft-light" aria-hidden="true">
                    <HeroPortrait />
                  </div>
                </Suspense>
              )}
            </div>
          </motion.div>

          <motion.div variants={ctaVariants} className="hero-actions order-5 mb-2">
            <MagneticButton
              href="#work"
              className="btn-primary inline-flex items-center px-8 py-4 rounded-full bg-tertiary text-white text-xs font-semibold uppercase btn-glow hover:bg-tertiary-dim transition-colors duration-300 pointer-events-auto"
            >
              View My Work
            </MagneticButton>
          </motion.div>
        </motion.div>
      </section>

      <Marquee />
    </div>
  );
}
