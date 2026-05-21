import { motion } from 'framer-motion';

export default function Footer() {
  const holdPlaceholder = (event) => event.preventDefault();

  return (
    <footer id="contact" className="finale-scene scroll-scene px-page py-24 md:py-32 text-center border-t border-tertiary/15 relative z-10">
      <p className="text-xs font-semibold uppercase text-rose-deep mb-4">Contact</p>

      <motion.h2
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        className="font-serif text-4xl md:text-6xl font-semibold text-ivory leading-tight mb-6 max-w-3xl mx-auto"
      >
        Let&apos;s shape something with feeling.
      </motion.h2>

      <p className="text-rose-deep/80 text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-8">
        Brand, editorial, and digital work with a soft cinematic eye.
      </p>

      <a
        href="mailto:singhgarima2894@gmail.com"
        className="btn-primary inline-flex items-center px-10 py-4 rounded-full bg-tertiary text-white text-sm font-semibold uppercase btn-glow btn-glow-pulse-once hover:bg-tertiary-dim transition-colors duration-300 mb-12 pointer-events-auto"
      >
        Let&apos;s Chat
      </a>

      <nav className="flex flex-wrap justify-center gap-x-9 gap-y-3 mb-10" aria-label="Social">
        <a href="#" onClick={holdPlaceholder} className="skill-chip social-link pointer-events-auto">
          Instagram
        </a>
        <a href="#" onClick={holdPlaceholder} className="skill-chip social-link pointer-events-auto">
          LinkedIn
        </a>
        <a href="https://www.behance.net/garimasingh110" target="_blank" rel="noopener noreferrer" className="skill-chip social-link pointer-events-auto">
          Behance
        </a>
        <a
          href="mailto:singhgarima2894@gmail.com"
          className="skill-chip social-link pointer-events-auto"
        >
          Email
        </a>
      </nav>

      <p className="text-sm text-rose-deep/65 mb-2">Lucknow, Uttar Pradesh</p>
      <p className="text-sm text-rose-deep/65">© 2026 Garima Singh</p>
    </footer>
  );
}
