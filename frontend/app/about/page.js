export default function AboutPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-16 space-y-16">
      {/* Page Header */}
      <section className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-ahsra-blue">
          About AHSRA
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-gray-700">
          The Alabama High School Rodeo Association is dedicated to promoting
          youth rodeo, leadership, and sportsmanship across the state of Alabama.
        </p>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-ahsra-blue mb-4">
          Our Mission
        </h2>
        <p className="text-gray-700 leading-relaxed">
          AHSRA provides student athletes the opportunity to compete in
          professional-style rodeo events while developing responsibility,
          discipline, and respect for the western way of life. Through
          competition, education, and community involvement, AHSRA prepares
          youth for success both inside and outside the arena.
        </p>
      </section>

      {/* Divisions */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-ahsra-blue mb-6">
          Divisions
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border bg-white p-6">
            <h3 className="font-semibold text-lg mb-2">
              Junior High Division
            </h3>
            <p className="text-gray-700 text-sm">
              Designed for younger competitors to learn rodeo fundamentals,
              sportsmanship, and competition in a supportive environment.
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <h3 className="font-semibold text-lg mb-2">
              High School Division
            </h3>
            <p className="text-gray-700 text-sm">
              Competitive rodeo events for high school athletes, serving as a
              pathway to state finals, national competition, and scholarship
              opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Governance */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-ahsra-blue mb-4">
          Governance & Leadership
        </h2>
        <p className="text-gray-700 leading-relaxed">
          AHSRA is governed by elected officers, board members, and volunteers
          who work together to uphold the association’s bylaws, manage events,
          and ensure a fair and positive experience for all members.
        </p>
      </section>
    </main>
  );
}
