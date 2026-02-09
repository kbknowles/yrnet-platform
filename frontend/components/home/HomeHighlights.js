import Link from "next/link";

export default function HomeHighlights({ rodeos, announcements }) {
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

        {/* Announcements */}
        <div className="bg-gray-100 flex justify-center">
          <div className="w-full max-w-xl p-6 md:p-8 flex flex-col">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-ahsra-red">
              Announcements
            </h2>

            <ul className="space-y-4 flex-1">
              {announcements.map((item) => (
                <li
                  key={item.id}
                  className="bg-white rounded-md shadow-sm overflow-hidden"
                >
                  {item.mode === "POSTER" && item.imageUrl ? (
                    <Link href={`/announcements/${item.id}`}>
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full object-contain"
                      />
                    </Link>
                  ) : (
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        {item.publishAt && (
                          <p className="text-sm text-gray-600">
                            {new Date(item.publishAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      <Link
                        href={`/announcements/${item.id}`}
                        className="text-sm font-medium bg-ahsra-red text-white px-4 py-2 rounded-md"
                      >
                        View Details
                      </Link>
                    </div>
                  )}
                </li>
              ))}
            </ul>

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
