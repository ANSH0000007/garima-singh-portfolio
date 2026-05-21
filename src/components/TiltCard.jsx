import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

const getBaseShadow = (frameStyle) => {
  switch (frameStyle) {
    case 'clean':
      return { y: 14, blur: 28, opacity: 0.22, color: '26, 10, 17' };
    case 'soft-matte':
      return { y: 19, blur: 46, opacity: 0.32, color: '34, 10, 20' };
    case 'editorial':
      return { y: 21, blur: 52, opacity: 0.30, color: '19, 6, 13' };
    default:
      return { y: 16, blur: 36, opacity: 0.28, color: '20, 6, 13' };
  }
};

export default function TiltCard({ item }) {
  const cardRef = useRef(null);
  const tiltRef = useRef(null);
  const frameRef = useRef(null);
  const glareRef = useRef(null);

  const [isReducedMotion, setIsReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  // References for GSAP quickTo setters
  const rotateXTo = useRef(null);
  const rotateYTo = useRef(null);
  const scaleTo = useRef(null);
  const glareXTo = useRef(null);
  const glareYTo = useRef(null);
  const glareOpacityTo = useRef(null);
  const shadowXTo = useRef(null);
  const shadowYTo = useRef(null);
  const shadowBlurTo = useRef(null);
  const shadowOpacityTo = useRef(null);

  const baseShadow = getBaseShadow(item.frameStyle);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (isReducedMotion) return;
    if (!tiltRef.current || !frameRef.current || !glareRef.current) return;

    // Use a spring-like smooth duration (0.55s) with power3 for luxury visual pacing
    const duration = 0.55;
    const ease = 'power3.out';

    // Set up high-performance GSAP quickTo runners targeting custom CSS variables
    rotateXTo.current = gsap.quickTo(tiltRef.current, '--tilt-rx', { duration, ease });
    rotateYTo.current = gsap.quickTo(tiltRef.current, '--tilt-ry', { duration, ease });
    scaleTo.current = gsap.quickTo(tiltRef.current, '--tilt-scale', { duration, ease });

    glareXTo.current = gsap.quickTo(glareRef.current, '--glare-x', { duration, ease });
    glareYTo.current = gsap.quickTo(glareRef.current, '--glare-y', { duration, ease });
    glareOpacityTo.current = gsap.quickTo(glareRef.current, '--glare-opacity', { duration, ease });

    shadowXTo.current = gsap.quickTo(frameRef.current, '--shadow-x', { duration, ease });
    shadowYTo.current = gsap.quickTo(frameRef.current, '--shadow-y', { duration, ease });
    shadowBlurTo.current = gsap.quickTo(frameRef.current, '--shadow-blur', { duration, ease });
    shadowOpacityTo.current = gsap.quickTo(frameRef.current, '--shadow-opacity', { duration, ease });
  }, [isReducedMotion]);

  const handleMouseMove = (e) => {
    if (isReducedMotion) return;

    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xc = rect.width / 2;
    const yc = rect.height / 2;

    const maxRotation = 7;
    const rotX = ((yc - y) / yc) * maxRotation;
    const rotY = ((x - xc) / xc) * maxRotation;

    // Translate the shadow in the opposite direction of the tilt
    const maxShift = 10;
    const shadowX = 0 - (rotY / maxRotation) * maxShift;
    const shadowY = baseShadow.y + (rotX / maxRotation) * maxShift;

    // Increase blur & opacity based on tilt angle to simulate physical elevation
    const magnitude = Math.sqrt(rotX * rotX + rotY * rotY) / maxRotation;
    const shadowBlur = baseShadow.blur + magnitude * 14;
    const shadowOpacity = baseShadow.opacity + magnitude * 0.06;

    // Calculate glare percentages
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    // Direct DOM manipulation via GSAP runners (bypasses React renders entirely)
    if (rotateXTo.current) rotateXTo.current(rotX);
    if (rotateYTo.current) rotateYTo.current(rotY);
    if (scaleTo.current) scaleTo.current(1.03);

    if (glareXTo.current) glareXTo.current(glareX);
    if (glareYTo.current) glareYTo.current(glareY);
    if (glareOpacityTo.current) glareOpacityTo.current(0.18);

    if (shadowXTo.current) shadowXTo.current(shadowX);
    if (shadowYTo.current) shadowYTo.current(shadowY);
    if (shadowBlurTo.current) shadowBlurTo.current(shadowBlur);
    if (shadowOpacityTo.current) shadowOpacityTo.current(shadowOpacity);
  };

  const handleMouseLeave = () => {
    if (isReducedMotion) return;

    // Smoothly settle back to initial resting coordinates
    if (rotateXTo.current) rotateXTo.current(0);
    if (rotateYTo.current) rotateYTo.current(0);
    if (scaleTo.current) scaleTo.current(1);

    if (glareOpacityTo.current) glareOpacityTo.current(0);

    if (shadowXTo.current) shadowXTo.current(0);
    if (shadowYTo.current) shadowYTo.current(baseShadow.y);
    if (shadowBlurTo.current) shadowBlurTo.current(baseShadow.blur);
    if (shadowOpacityTo.current) shadowOpacityTo.current(baseShadow.opacity);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full relative"
      style={{
        perspective: '1000px',
        transform: 'translate3d(0,0,0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      <div
        ref={tiltRef}
        className="w-full h-full"
        style={{
          transform: 'rotateX(calc(var(--tilt-rx, 0) * 1deg)) rotateY(calc(var(--tilt-ry, 0) * 1deg)) scale(var(--tilt-scale, 1)) translate3d(0,0,0)',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          '--tilt-rx': 0,
          '--tilt-ry': 0,
          '--tilt-scale': 1,
        }}
      >
        <div
          ref={frameRef}
          className="work-frame relative overflow-hidden"
          style={{
            transform: 'translateZ(20px) translate3d(0,0,0)',
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            boxShadow: `calc(var(--shadow-x, 0) * 1px) calc(var(--shadow-y, ${baseShadow.y}) * 1px) calc(var(--shadow-blur, ${baseShadow.blur}) * 1px) rgba(${baseShadow.color}, var(--shadow-opacity, ${baseShadow.opacity}))`,
            borderRadius: '1.05rem',
            '--shadow-x': 0,
            '--shadow-y': baseShadow.y,
            '--shadow-blur': baseShadow.blur,
            '--shadow-opacity': baseShadow.opacity,
          }}
        >
          {/* Inner 3D Content Layer (translates and scales in perfect sync to avoid border bleeding) */}
          <div
            style={{
              transform: 'translateZ(10px) scale(1.008) translate3d(0,0,0)',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              borderRadius: '1.05rem',
              overflow: 'hidden',
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >
            <img
              src={item.src}
              alt={item.title}
              className="work-image"
              loading="lazy"
              width={item.width}
              height={item.height}
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                borderRadius: '1.05rem',
              }}
            />
            {/* Custom glare reflection overlay */}
            <div
              ref={glareRef}
              className="absolute inset-0 pointer-events-none mix-blend-overlay"
              style={{
                background: 'radial-gradient(circle at calc(var(--glare-x, 50) * 1%) calc(var(--glare-y, 50) * 1%), rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 65%)',
                opacity: 'var(--glare-opacity, 0)',
                borderRadius: '1.05rem',
                '--glare-x': 50,
                '--glare-y': 50,
                '--glare-opacity': 0,
              }}
            />
            {/* Smooth 3D Border overlay */}
            <div className="work-frame-border" />
          </div>
        </div>
        <div
          className="work-card-meta"
          style={{
            transform: 'translateZ(15px) translate3d(0,0,0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <h4>{item.title}</h4>
          <p>{item.medium}</p>
        </div>
      </div>
    </div>
  );
}
