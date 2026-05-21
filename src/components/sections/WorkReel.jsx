import { useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import clsx from 'clsx';
import WorkLightbox from '../WorkLightbox';
import TiltCard from '../TiltCard';
import { workCatalog, workReelConfig } from '../../data/workCatalog';

const WorkDepthField = lazy(() => import('../canvas/WorkDepthField'));

function hashToUnit(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 1000) / 1000;
}

function normValue(seed, magnitude) {
  return (seed - 0.5) * 2 * magnitude;
}

function normalizeCatalog(catalog, config) {
  const maxGlobal = config.maxGlobalPeaks ?? 4;
  const minGap = config.minQuietGapBetweenPeaks ?? 1;
  const maxConsecutive = config.maxConsecutivePeaks ?? 1;

  let globalPeaks = 0;
  let sequence = 0;
  let lastPeakSequence = -999;
  let consecutivePeaks = 0;

  return catalog.map((chapter) => {
    if (chapter.chapterKind === 'bridge') return chapter;
    let chapterHasPeak = false;

    const items = chapter.items.map((item) => {
      const wantsPeak = item.confidenceLevel === 'peak';
      const hasGap = sequence - lastPeakSequence > minGap;
      const canUsePeak =
        wantsPeak &&
        !chapterHasPeak &&
        globalPeaks < maxGlobal &&
        hasGap &&
        consecutivePeaks < maxConsecutive;

      const confidenceLevel = canUsePeak ? 'peak' : wantsPeak ? 'support' : item.confidenceLevel;

      if (canUsePeak) {
        chapterHasPeak = true;
        globalPeaks += 1;
        lastPeakSequence = sequence;
        consecutivePeaks += 1;
      } else {
        consecutivePeaks = 0;
      }

      sequence += 1;
      return { ...item, confidenceLevel };
    });

    const peakIndex = items.findIndex((item) => item.confidenceLevel === 'peak');
    if (peakIndex > -1 && items[peakIndex + 1] && items[peakIndex + 1].confidenceLevel !== 'peak') {
      items[peakIndex + 1] = { ...items[peakIndex + 1], isDecompression: true };
    }

    return { ...chapter, items };
  });
}

function getBreathCurve(profile) {
  if (profile === 'quiet') {
    return { entry: 0.9, flow: 0.78, settle: 0.86 };
  }
  if (profile === 'soft') {
    return { entry: 0.82, flow: 0.74, settle: 0.8 };
  }
  return { entry: 0.76, flow: 0.7, settle: 0.74 };
}

export default function WorkReel() {
  const sectionRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showDepthField, setShowDepthField] = useState(false);
  const [isMobileView, setIsMobileView] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(max-width: 767px)').matches;
    }
    return false;
  });

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 767px)');
    const update = () => {
      setShowDepthField(!reduced.matches && !mobile.matches);
      setIsMobileView(mobile.matches);
    };
    update();
    reduced.addEventListener('change', update);
    mobile.addEventListener('change', update);
    return () => {
      reduced.removeEventListener('change', update);
      mobile.removeEventListener('change', update);
    };
  }, []);

  const chapters = useMemo(() => normalizeCatalog(workCatalog, workReelConfig), []);
  const coreChapters = useMemo(() => chapters.filter((chapter) => chapter.chapterKind !== 'bridge'), [chapters]);
  const bridgeChapter = useMemo(() => chapters.find((chapter) => chapter.chapterKind === 'bridge'), [chapters]);

  const flatItems = useMemo(
    () =>
      coreChapters.flatMap((chapter) =>
        chapter.items.map((item) => ({
          ...item,
          chapter: chapter.label,
        }))
      ),
    [coreChapters]
  );

  const itemIndexById = useMemo(() => {
    const map = new Map();
    flatItems.forEach((item, index) => map.set(item.id, index));
    return map;
  }, [flatItems]);

  const chapterStyles = useMemo(
    () =>
      coreChapters.reduce((acc, chapter) => {
        const variance = chapter.microVariance || { spacing: 0.06, timing: 0.06, transition: 0.06, dwell: 0.06 };
        const seedA = hashToUnit(`${chapter.id}:a`);
        const seedB = hashToUnit(`${chapter.id}:b`);
        const seedC = hashToUnit(`${chapter.id}:c`);

        acc[chapter.id] = {
          '--nv-spacing-jitter': `${normValue(seedA, variance.spacing).toFixed(4)}rem`,
          '--nv-timing-drift': `${normValue(seedB, variance.timing).toFixed(4)}s`,
          '--nv-softness': `${(0.46 + normValue(seedC, variance.transition)).toFixed(4)}`,
        };
        return acc;
      }, {}),
    [coreChapters]
  );

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const chapterEls = gsap.utils.toArray('.work-chapter-core');
      const cardEls = gsap.utils.toArray('.work-card');

      if (prefersReducedMotion) {
        gsap.set(cardEls, { clearProps: 'all' });
        gsap.set(chapterEls, { clearProps: 'all' });
        return;
      }

      chapterEls.forEach((chapterEl, chapterIndex) => {
        const chapterId = chapterEl.getAttribute('data-chapter-id');
        const chapter = coreChapters.find((item) => item.id === chapterId);
        if (!chapter) return;
        const variance = chapter.microVariance || { spacing: 0.06, timing: 0.06, transition: 0.06, dwell: 0.06 };
        const breath = getBreathCurve(chapter.breathProfile);
        const intro = chapterEl.querySelector('.chapter-intro');
        const title = chapterEl.querySelector('.chapter-mood');
        const cards = gsap.utils.toArray('.work-card', chapterEl);

        if (intro) {
          gsap.fromTo(
            intro,
            { opacity: 0, y: 24 + chapterIndex * 1.6 },
            {
              opacity: 1,
              y: 0,
              duration: breath.entry + variance.timing * 0.4,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: intro,
                start: 'top 84%',
                toggleActions: 'play none none none',
              },
            }
          );
        }

        if (title) {
          gsap.fromTo(
            title,
            { letterSpacing: '0.01em', opacity: 0.85 },
            {
              letterSpacing: '0em',
              opacity: 1,
              duration: breath.settle + variance.timing * 0.2,
              ease: 'power1.out',
              scrollTrigger: {
                trigger: title,
                start: 'top 86%',
                toggleActions: 'play none none none',
              },
            }
          );
        }

        if (!isMobile) {
          gsap.to(chapterEl, {
            yPercent: -1.2 + chapterIndex * 0.2,
            rotationX: normValue(hashToUnit(`${chapter.id}:depth`), 0.24),
            ease: 'none',
            scrollTrigger: {
              trigger: chapterEl,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.24,
            },
          });
        }

        cards.forEach((card, cardIndex) => {
          const confidence = card.dataset.confidence || 'quiet';
          const peakType = card.dataset.peakType || '';
          const isPeak = confidence === 'peak';
          const isQuiet = confidence === 'quiet';
          const jitterSeed = hashToUnit(`${chapter.id}:${cardIndex}:j`);
          const timingSeed = hashToUnit(`${chapter.id}:${cardIndex}:t`);
          const yOffset = 20 + normValue(jitterSeed, variance.spacing * 110);
          const delayDrift = normValue(timingSeed, variance.timing * 0.14);
          const durationBase = isPeak ? breath.flow + 0.2 : isQuiet ? breath.flow - 0.1 : breath.flow;
          const duration = durationBase + delayDrift;

          gsap.fromTo(
            card,
            { opacity: 0, y: yOffset, scale: isPeak ? 0.982 : 0.993 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: Math.max(0.5, duration),
              delay: Math.max(0, cardIndex * 0.04 + delayDrift),
              ease: peakType === 'linger' ? 'power1.out' : 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                toggleActions: 'play none none none',
              },
            }
          );

          if (isPeak && !isMobile) {
            gsap.to(card, {
              yPercent: peakType === 'linger' ? -1.8 : -0.95,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top 74%',
                end: 'bottom top',
                scrub: 0.14,
              },
            });
          }

          if (card.classList.contains('is-decompression')) {
            gsap.fromTo(
              card,
              { filter: 'saturate(0.9)', opacity: 0.95 },
              {
                filter: 'saturate(0.98)',
                opacity: 1,
                duration: breath.settle + variance.dwell,
                ease: 'power1.out',
                scrollTrigger: {
                  trigger: card,
                  start: 'top 88%',
                  toggleActions: 'play none none none',
                },
              }
            );
          }
        });
      });
    },
    { scope: sectionRef, dependencies: [coreChapters, isMobileView] }
  );

  const lightboxItem = selectedIndex == null ? null : flatItems[selectedIndex];

  const renderCard = (item) => (
    <button
      key={item.id}
      type="button"
      data-confidence={item.confidenceLevel}
      data-peak-type={item.peakType || ''}
      className={clsx(
        'work-card',
        `confidence-${item.confidenceLevel}`,
        `frame-${item.frameStyle}`,
        item.isDecompression && 'is-decompression'
      )}
      onClick={() => setSelectedIndex(itemIndexById.get(item.id))}
    >
      <TiltCard item={item} />
    </button>
  );

  return (
    <>
      <section id="work" ref={sectionRef} className="work-reel-section scroll-scene px-page relative z-10">
        {showDepthField && (
          <div className="work-depth-layer" aria-hidden="true">
            <Suspense fallback={<div className="work-depth-fallback" />}>
              <WorkDepthField />
            </Suspense>
          </div>
        )}

        <div className="max-w-6xl mx-auto w-full py-20 md:py-28">
          <div className="text-center mb-14 md:mb-16 work-reel-head">
            <p className="text-xs font-semibold uppercase text-rose-deep md:text-rose mb-3">Work Reel</p>
            <h2 className="font-serif text-4xl md:text-6xl font-semibold text-cocoa md:text-ivory">Selected Work</h2>
            <p className="text-muted md:text-rose-deep/80 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mt-4">
              A chaptered flow aligned with Behance categories, shaped to feel human, soft, and cinematic.
            </p>
          </div>

          <div className="work-journey">
            {coreChapters.map((chapter) => (
              <article
                key={chapter.id}
                data-chapter-id={chapter.id}
                style={chapterStyles[chapter.id]}
                className={clsx('work-chapter work-chapter-core', `chapter-${chapter.id}`, `template-${chapter.template}`)}
              >
                <header className="chapter-intro">
                  <p className="chapter-label">{chapter.behanceCategory || chapter.label}</p>
                  <h3 className="chapter-mood">{chapter.mood}</h3>
                  <p className="chapter-note">{chapter.chapterNote}</p>
                </header>

                <div className="chapter-grid">
                  {isMobileView || chapter.template === 'quiet-editorial' ? (
                    chapter.items.map(renderCard)
                  ) : (
                    <>
                      <div className="masonry-column" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 1.45vw, 1.15rem)' }}>
                        {chapter.items.filter((_, i) => i % 2 === 0).map(renderCard)}
                      </div>
                      <div className="masonry-column" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 1.45vw, 1.15rem)' }}>
                        {chapter.items.filter((_, i) => i % 2 !== 0).map(renderCard)}
                      </div>
                    </>
                  )}
                </div>
              </article>
            ))}

            {bridgeChapter && (
              <article className="work-chapter work-chapter-bridge chapter-bridge">
                <header className="chapter-intro">
                  <p className="chapter-label">{bridgeChapter.label}</p>
                  <h3 className="chapter-mood">{bridgeChapter.mood}</h3>
                  <p className="chapter-note">{bridgeChapter.chapterNote}</p>
                </header>
                <div className="bridge-grid">
                  {bridgeChapter.items.map((item) => (
                    <a
                      key={item.id}
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bridge-card"
                    >
                      <h4>{item.title}</h4>
                      <p>{item.medium}</p>
                      <span>View on Behance</span>
                    </a>
                  ))}
                </div>
              </article>
            )}
          </div>
        </div>
      </section>

      <WorkLightbox
        isOpen={selectedIndex != null}
        item={lightboxItem}
        canPrev={selectedIndex > 0}
        canNext={selectedIndex != null && selectedIndex < flatItems.length - 1}
        onPrev={() => setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))}
        onNext={() => setSelectedIndex((prev) => (prev < flatItems.length - 1 ? prev + 1 : prev))}
        onClose={() => setSelectedIndex(null)}
      />
    </>
  );
}
