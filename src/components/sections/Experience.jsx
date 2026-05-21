import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export default function Experience() {
  const sectionRef = useRef(null);
  const lineRefs = useRef([]);

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) return;

      lineRefs.current.forEach((line) => {
        if (!line) return;
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: line,
              start: 'top 85%',
              end: 'top 55%',
              scrub: 0.25,
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  const listVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section id="experience" ref={sectionRef} className="experience-scene scroll-scene px-page py-24 md:py-36 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        className="scene-panel max-w-6xl mx-auto rounded-[1.75rem] p-8 md:p-12"
      >
        <div className="max-w-2xl mb-10 md:mb-12">
          <p className="text-xs font-semibold uppercase text-tertiary mb-3">Credentials</p>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cocoa leading-tight">A concise practice, carefully shaped.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="credential-card p-6 md:p-8">
            <h3 className="font-serif text-3xl font-semibold text-tertiary mb-8">Experience & Exhibitions</h3>
            <motion.ul
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="space-y-10 pl-6 relative"
            >
              <div
                ref={(el) => (lineRefs.current[0] = el)}
                className="timeline-line absolute left-0 top-0 bottom-0 w-px bg-outline origin-top"
                aria-hidden="true"
              />
              <motion.li variants={itemVariants} className="relative">
                <span className="absolute -left-[1.65rem] top-1.5 w-3 h-3 rounded-full bg-tertiary" />
                <h3 className="font-serif text-xl font-semibold text-cocoa">Freelance Graphic Designer</h3>
                <p className="skill-chip text-tertiary mt-1 mb-2">2025 — Present</p>
                <p className="text-muted text-sm leading-relaxed">Designed posters, social media graphics, and digital artwork for various clients.</p>
              </motion.li>
              <motion.li variants={itemVariants} className="relative">
                <span className="absolute -left-[1.65rem] top-1.5 w-3 h-3 rounded-full bg-rose border-2 border-blush" />
                <h3 className="font-serif text-xl font-semibold text-cocoa">Lalit Kala Akademi Exhibition</h3>
                <p className="skill-chip text-muted mt-1 mb-2">Project / Exhibition</p>
                <p className="text-muted text-sm leading-relaxed">Exhibited original artwork and creative designs at a prestigious national academy.</p>
              </motion.li>
              <motion.li variants={itemVariants} className="relative">
                <span className="absolute -left-[1.65rem] top-1.5 w-3 h-3 rounded-full bg-rose border-2 border-blush" />
                <h3 className="font-serif text-xl font-semibold text-cocoa">Local Company Branding</h3>
                <p className="skill-chip text-muted mt-1 mb-2">Project / Freelance</p>
                <p className="text-muted text-sm leading-relaxed">Received official appreciation for designing a creative and impactful company logo.</p>
              </motion.li>
            </motion.ul>
          </div>

          <div className="credential-card p-6 md:p-8">
            <h3 className="font-serif text-3xl font-semibold text-tertiary mb-8">Education</h3>
            <motion.ul
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="space-y-10 pl-6 relative"
            >
              <div
                ref={(el) => (lineRefs.current[1] = el)}
                className="timeline-line absolute left-0 top-0 bottom-0 w-px bg-outline origin-top"
                aria-hidden="true"
              />
              <motion.li variants={itemVariants} className="relative">
                <span className="absolute -left-[1.65rem] top-1.5 w-3 h-3 rounded-full bg-tertiary" />
                <h3 className="font-serif text-xl font-semibold text-cocoa">Bachelor of Visual Arts (BVA)</h3>
                <p className="skill-chip text-tertiary mt-1 mb-2">Techno Group of Institutions · 2023 — 2027</p>
                <p className="text-muted text-sm leading-relaxed">Currently pursuing degree in Visual Arts.</p>
              </motion.li>
              <motion.li variants={itemVariants} className="relative">
                <span className="absolute -left-[1.65rem] top-1.5 w-3 h-3 rounded-full bg-rose border-2 border-blush" />
                <h3 className="font-serif text-xl font-semibold text-cocoa">12th Standard</h3>
                <p className="skill-chip text-muted mt-1 mb-2">Lokbandhu Rajnarayan Memorial Inter College · 2021 — 2022</p>
                <p className="text-muted text-sm leading-relaxed">Completed high school education.</p>
              </motion.li>
            </motion.ul>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
