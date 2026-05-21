import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function WorkLightbox({
  isOpen,
  item,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onClose,
}) {
  const closeRef = useRef(null);
  const returnFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    returnFocusRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft' && canPrev) onPrev();
      if (event.key === 'ArrowRight' && canNext) onNext();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      returnFocusRef.current?.focus?.();
    };
  }, [isOpen, onClose, onPrev, onNext, canPrev, canNext]);

  if (!item) return null;

  return (
    <div
      className={clsx('work-lightbox', isOpen && 'is-open')}
      aria-hidden={!isOpen}
      onClick={onClose}
    >
      <div
        className={clsx('work-lightbox-panel', item.confidenceLevel === 'peak' && 'is-peak')}
        role="dialog"
        aria-modal="true"
        aria-label={`${item.title} preview`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="work-lightbox-close"
          aria-label="Close preview"
        >
          <X size={18} />
        </button>

        <div className="work-lightbox-image-wrap">
          <img src={item.src} alt={item.title} className="work-lightbox-image" width={item.width} height={item.height} />
        </div>

        <div className="work-lightbox-meta">
          <p className="work-lightbox-label">{item.chapter}</p>
          <h3 className="work-lightbox-title">{item.title}</h3>
          <p className="work-lightbox-medium">{item.medium}</p>
        </div>

        <div className="work-lightbox-nav">
          <button
            type="button"
            className="work-lightbox-arrow"
            onClick={onPrev}
            disabled={!canPrev}
            aria-label="Previous work"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="work-lightbox-arrow"
            onClick={onNext}
            disabled={!canNext}
            aria-label="Next work"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
