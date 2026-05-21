import clsx from 'clsx';

export default function TiltCard({ proj, imageRef, isActive }) {
  return (
    <div className="block group h-full w-full">
      <div
        className={clsx(
          'tilt-inner rounded-[1.5rem] p-5 md:p-6 border transition-[box-shadow,transform,border-color] duration-500 h-full',
          isActive
            ? 'border-tertiary/40 bg-[linear-gradient(150deg,rgba(255,250,247,0.96),rgba(255,241,245,0.86))] shadow-[0_28px_80px_rgba(212,20,120,0.2)]'
            : 'border-white/50 bg-[linear-gradient(150deg,rgba(255,250,247,0.9),rgba(255,241,245,0.78))] shadow-[0_24px_70px_rgba(0,0,0,0.2)]',
          'group-hover:-translate-y-1 group-hover:border-tertiary/35 group-hover:shadow-[0_28px_70px_rgba(212,20,120,0.16)]'
        )}
      >
        <div
          className={clsx(
            'aspect-[4/5] md:aspect-[16/13] rounded-[1.15rem] overflow-hidden mb-5',
            proj.blend ? 'bg-[linear-gradient(135deg,var(--color-blush),var(--color-rose))]' : 'bg-rose'
          )}
        >
          <img
            ref={imageRef}
            src={proj.image}
            alt={proj.title}
            className={clsx(
              'w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700',
              proj.blend && 'opacity-90 mix-blend-multiply'
            )}
            loading="lazy"
          />
        </div>
        <div className="flex flex-wrap justify-between items-baseline gap-2 px-1">
          <h3 className="font-serif text-2xl md:text-3xl font-semibold text-cocoa">{proj.title}</h3>
          <span className="skill-chip text-tertiary">{proj.tags}</span>
        </div>
        <p className="text-muted text-sm mt-2 px-1">{proj.desc}</p>
      </div>
    </div>
  );
}
