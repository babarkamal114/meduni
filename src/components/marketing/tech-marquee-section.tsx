const MARQUEE_ITEMS = [
  'CARDIOLOGY',
  'GENERAL PRACTICE',
  'PAEDIATRICS',
  'SURGERY',
  'EXPERT-LED',
  'LIVE & REPLAYS',
];

function MarqueeRow(): React.ReactElement {
  return (
    <div className="flex items-center gap-12 px-6">
      {MARQUEE_ITEMS.flatMap((item, i) => [
        <span
          key={`${item}-${i}`}
          className="text-sm font-mono text-slate-600 whitespace-nowrap"
        >
          {item}
        </span>,
        <span key={`dot-${i}`} className="text-teal-500/30 mx-2">
          &#9670;
        </span>,
      ])}
    </div>
  );
}

export function TechMarqueeSection(): React.ReactElement {
  return (
    <section className="py-6 border-y border-black/5 overflow-hidden bg-white/50">
      <div className="mq-track">
        <MarqueeRow />
        <MarqueeRow />
      </div>
    </section>
  );
}
