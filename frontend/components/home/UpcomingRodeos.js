// filepath: frontend/components/home/UpcomingRodeos.js
"use client";

export default function UpcomingRodeos({ events = [] }) {
  const visible = events.slice(0, 3);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Our Schedule</h2>

      <ul className="space-y-3">
        {visible.map((e) => (
          <li key={e.id} className="border rounded p-3 bg-white">
            <div className="font-medium">{e.name}</div>
            <div className="text-sm text-gray-600">
              {new Date(e.startDate).toLocaleDateString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
