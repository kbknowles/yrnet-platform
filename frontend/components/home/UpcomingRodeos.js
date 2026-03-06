// filepath: frontend/components/home/UpcomingRodeos.js
"use client";

export default function UpcomingRodeos({ rodeos = [] }) {
  const visible = rodeos.slice(0, 3);

  return (
    <section className="hero">
      <h2 className="text-xl font-semibold mb-4">Our Schedule</h2>

      <ul className="space-y-3">
        {visible.map((rodeo) => (
          <li key={rodeo.id} className="border rounded p-3 bg-transparent">
            <div className="font-medium">{rodeo.name}</div>
            <div className="text-sm">
              {rodeo.startDate
                ? new Date(rodeo.startDate).toLocaleDateString()
                : ""}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}