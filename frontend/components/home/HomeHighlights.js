import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function HomeHighlights({ rodeos, announcements }) {
  const sorted = [...announcements].sort((a, b) => {
    const aDate = new Date(a.publishAt || a.createdAt);
    const bDate = new Date(b.publishAt || b.createdAt);
    return bDate - aDate;
  });

  const featured = sorted[0];

  const featuredHref = featured?.event?.slug
    ? `/schedule/${featured.event.slug}`
    : "/announcements";

  return (
    <section className="w-full mt-1">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Upcoming Rodeos */}
        <div className="bg-gray-900 text-white flex justify-center">
          <div className="w-full max-w-xl p-6 md:p-8 flex flex-col">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">
              Upcoming Rodeos
            </h2>

            <ul className="space-y-4 flex-1">
              {rodeos.map((rodeo) => (
                <li
                  key={rodeo.id}
                  className="bg-white/10 rounded-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div>
                    <p className="font-medium">{rodeo.name}</p>
                    <p className="text-sm text-white/80">
                      {new Date(rodeo.startDate).toLocaleDateString()}
                      {rodeo.location && ` · ${rodeo.location.name}`}
                    </p>
                  </div>

                  <Link
                    href={`/schedule/${rodeo.slug}`}
                    className="text-sm font-medium bg-white text-ahsra-blue px-4 py-2 rounded-md"
                  >
                    View Details
                  </Link>
                </li>
              ))}
            </ul>

            <div className="pt-6">
              <Link
                href="/schedule"
                className="text-sm font-medium underline underline-offset-4"
              >
                View Full Schedule →
              </Link>
            </div>
          </div>
        </div>

        {/* Featured Announcement */}
        <div className="bg-gray-100 flex justify-center">
          <div className="w-full max-w-xl p-6 md:p-8 flex flex-col">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-ahsra-red">
              Announcements
            </h2>

            {featured ? (
              <div className="bg-white rounded-md shadow-sm overflow-hidden">
                {featured.mode === "POSTER" && featured.imageUrl ? (
                  <Link href={featuredHref}>
                    <img
                      src={`${API_BASE}${featured.imageUrl}`}
                      alt={featured.title}
                      className="w-full max-h-[420px] object-contain"
                    />
                  </Link>
                ) : (
                  <div className="p-4 space-y-2">
                    <p className="font-medium">{featured.title}</p>

                    {(featured.publishAt || featured.createdAt) && (
                      <p className="text-sm text-gray-600">
                        {new Date(
                          featured.publishAt || featured.createdAt
                        ).toLocaleDateString()}
                      </p>
                    )}

                    <Link
                      href={featuredHref}
                      className="inline-block text-sm font-medium bg-ahsra-red text-white px-4 py-2 rounded-md"
                    >
                      View Details
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                No current announcements.
              </p>
            )}

            <div className="pt-6">
              <Link
                href="/announcements"
                className="text-sm font-medium text-ahsra-red underline underline-offset-4"
              >
                View All Announcements →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
