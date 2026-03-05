// filepath: frontend/components/home/UpcomingRodeos.js
"use client";

export default function UpcomingRodeos({ rodeos = [] }) {
  const visible = rodeos.slice(0, 3);

  return (
    <div className="hero">
      <h2 className="hero text-xl font-semibold mb-4">Our Schedule</h2>

      <ul className="space-y-3">
        {visible.map((rodeo) => (
          <li key={rodeo.id} className="border rounded p-3 bg-white">
            <div className="hero font-medium">{rodeo.name}</div>
            <div className="hero text-sm">
              {rodeo.startDate
                ? new Date(rodeo.startDate).toLocaleDateString()
                : ""}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}