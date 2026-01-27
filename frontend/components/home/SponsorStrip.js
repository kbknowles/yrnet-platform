"use client";

export default function SponsorStrip({ sponsors = [] }) {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
        {sponsors.map((s) => (
          <div
            key={s.id}
            className="h-20 flex items-center justify-center border rounded"
          >
            {s.logoUrl ? (
              <img src={s.logoUrl} alt={s.name} className="max-h-16" />
            ) : (
              <span className="text-sm">{s.name}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
