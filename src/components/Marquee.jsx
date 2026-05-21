const TICKER_ITEMS = [
  { label: 'GARIMA', tone: 'solid' },
  { label: 'POSTERS', tone: 'solid' },
  { label: 'SOCIAL MEDIA', tone: 'solid' },
  { label: 'DIGITAL DESIGN', tone: 'outline' },
  { label: 'ARTWORK', tone: 'outline' },
  { label: 'CONTENT CREATION', tone: 'outline' },
];

export default function Marquee() {
  return (
    <section className="brand-marquee ticker-wrap w-full z-10" aria-label="Design disciplines">
      <div className="ticker" aria-hidden="true">
        <div className="ticker-line">
          {TICKER_ITEMS.map((item, index) => (
            <span
              key={`a-${item.label}-${index}`}
              className={`ticker-item ${item.tone === 'outline' ? 'ticker-item-outline' : 'ticker-item-solid'}`}
            >
              {item.label}
            </span>
          ))}
        </div>
        <div className="ticker-line" aria-hidden="true">
          {TICKER_ITEMS.map((item, index) => (
            <span
              key={`b-${item.label}-${index}`}
              className={`ticker-item ${item.tone === 'outline' ? 'ticker-item-outline' : 'ticker-item-solid'}`}
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
