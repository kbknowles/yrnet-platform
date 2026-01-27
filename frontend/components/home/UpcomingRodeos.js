"use client";

export default function UpcomingRodeos({ events = [] }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Upcoming Rodeos</h2>

      <ul className="space-y-3">
        {events.map((e) => (
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
