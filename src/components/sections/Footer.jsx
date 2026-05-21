import { motion } from 'framer-motion';
import MagneticButton from '../MagneticButton';

export default function Footer() {
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

      <MagneticButton
        href="mailto:singhgarima2894@gmail.com"
        className="btn-primary inline-flex items-center px-8 py-4 rounded-full bg-tertiary text-white text-xs font-semibold uppercase btn-glow hover:bg-tertiary-dim transition-colors duration-300 mb-12 pointer-events-auto"
      >
        Let&apos;s Chat
      </MagneticButton>

      <nav className="flex flex-wrap justify-center gap-x-9 gap-y-3 mb-10" aria-label="Social">
        <a href="https://www.instagram.com/creative_garimaa?igsh=dDZudm9nam44Nzcx" target="_blank" rel="noopener noreferrer" className="skill-chip social-link pointer-events-auto">
          Instagram
        </a>
        <a href="https://www.linkedin.com/in/garima-singh-6a34883a1?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="skill-chip social-link pointer-events-auto">
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
      <p className="text-sm text-rose-deep/65">© {new Date().getFullYear()} Garima Singh</p>
    </footer>
  );
}
