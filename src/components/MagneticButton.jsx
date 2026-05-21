import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function MagneticButton({ children, className, href, onClick }) {
  const ref = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 190, damping: 26 });
  const springY = useSpring(y, { stiffness: 190, damping: 26 });

  useEffect(() => {
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const touchQuery = window.matchMedia('(hover: none), (pointer: coarse)');
    const update = () => setEnabled(!reducedQuery.matches && !touchQuery.matches);

    update();
    reducedQuery.addEventListener('change', update);
    touchQuery.addEventListener('change', update);
    return () => {
      reducedQuery.removeEventListener('change', update);
      touchQuery.removeEventListener('change', update);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist < 72) {
      x.set(dx * 0.12);
      y.set(dy * 0.12);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Tag = href ? 'a' : 'button';
  const props = href ? { href, ...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {}) } : { type: 'button', onClick };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <Tag {...props} className={className}>
        {children}
      </Tag>
    </motion.div>
  );
}
