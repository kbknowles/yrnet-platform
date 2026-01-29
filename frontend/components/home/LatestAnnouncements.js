// filepath: frontend/components/home/LatestAnnouncements.js
"use client";

export default function LatestAnnouncements({ announcements = [] }) {
  const visible = announcements.slice(0, 3);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Latest Announcements</h2>

      <ul className="space-y-3">
        {visible.map((a) => (
          <li key={a.id} className="border rounded p-3 bg-white">
            <div className="font-medium">{a.title}</div>
            <div className="text-sm text-gray-600">{a.content}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
