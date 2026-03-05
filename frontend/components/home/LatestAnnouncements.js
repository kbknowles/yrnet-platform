export default function LatestAnnouncements({ announcements }) {
  const sorted = [...announcements].sort((a, b) => {
    if (a.priority === "important" && b.priority !== "important") return -1;
    if (a.priority !== "important" && b.priority === "important") return 1;
    return new Date(b.publishAt) - new Date(a.publishAt);
  });

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Announcements</h2>

      <div className="space-y-3">
        {sorted.map(a => (
          <div
            key={a.id}
            className={`rounded border p-4
              ${a.priority === "important"
                ? "border-red-700 bg-red-50"
                : "bg-white"
              }`}
          >
            <div className="font-semibold">{a.title}</div>
            <div className="text-sm text-gray-600 mt-1">
              {a.content}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
