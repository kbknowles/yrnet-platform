async function getLeadership() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/leadership`,
      { cache: "no-store" }
    );

    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function LeadershipPage() {
  const officers = await getLeadership();

  const executiveRoles = [
    "President",
    "Vice President",
    "Secretary",
    "Treasurer",
  ];

  const executives = officers.filter(o =>
    executiveRoles.includes(o.role)
  );

  const directors = officers.filter(
    o => !executiveRoles.includes(o.role)
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-16 space-y-16">
      {/* Page Header */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-ahsra-blue">
          Leadership
        </h1>
        <p className="max-w-2xl mx-auto text-gray-700">
          Dedicated volunteers serving the Alabama High School Rodeo Association
          for the current season.
        </p>
      </section>

      {/* Executive Officers */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-ahsra-blue">
          Officers
        </h2>

        {executives.length === 0 ? (
          <p className="text-gray-700">
            Officer information will be published soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {executives.map((o) => (
              <div
                key={o.id}
                className="rounded-xl border bg-white p-6 text-center space-y-2"
              >
                <div className="mx-auto h-24 w-24 rounded-full bg-gray-200" />

                <h3 className="font-semibold">{o.role}</h3>

                <p className="text-sm text-gray-700">
                  {o.name}
                </p>

                {o.emailAlias && (
                  <p className="text-sm text-gray-600">
                    {o.emailAlias}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Board / Directors */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-ahsra-blue">
          Board & Directors
        </h2>

        {directors.length === 0 ? (
          <p className="text-gray-700">
            Board and director information will be published soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {directors.map((o) => (
              <div
                key={o.id}
                className="rounded-lg bg-gray-100 p-4 text-center text-sm"
              >
                <div className="font-medium">{o.name}</div>
                <div className="text-gray-600">{o.role}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
