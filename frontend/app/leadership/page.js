// filepath: frontend/app/leadership/page.js

import {
  ROLE_LABELS,
  publicEmailForRole,
} from "../../lib/officerDisplay";

import {
  RevealEmail,
  RevealPhone,
} from "../../components/OfficerContact";

async function getOfficers() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/officers`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function LeadershipPage() {
  const officers = await getOfficers();

  const executives = officers.filter(o => o.type === "EXECUTIVE");
  const directors = officers.filter(o => o.type === "DIRECTOR");
  const students = officers.filter(o => o.type === "STUDENT");

  return (
    <main className="bg-gray-50">
      {/* HERO */}
      <section className="bg-ahsra-blue/95 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center space-y-4">
          <h1 className="text-4xl font-bold">
            Leadership
          </h1>
          <p className="max-w-2xl mx-auto text-white/90">
            Dedicated volunteers serving the Alabama High School Rodeo Association
            for the current season.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-4 py-16 space-y-20">
        {/* Executives */}
        <Section title="Executive Officers">
          {executives.map(o => (
            <OfficerCard key={o.id} officer={o} />
          ))}
        </Section>

        {/* Directors */}
        <Section title="Board & Directors" compact>
          {directors.map(o => (
            <OfficerCompact key={o.id} officer={o} />
          ))}
        </Section>

        {/* Students */}
        <Section title="Student Leadership" compact>
          {students.map(o => (
            <OfficerCompact key={o.id} officer={o} />
          ))}
        </Section>
      </section>
    </main>
  );
}

/* ---------------- Server-safe components ---------------- */

function Section({ title, children, compact }) {
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-semibold text-ahsra-blue text-center">
        {title}
      </h2>

      <div
        className={
          compact
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
            : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        }
      >
        {children}
      </div>
    </section>
  );
}

function OfficerCard({ officer }) {
  const email = publicEmailForRole(officer.role);

  return (
    <div className="rounded-xl border bg-white p-6 text-center space-y-3 shadow-sm">
      <div className="mx-auto h-24 w-24 rounded-full bg-gray-200" />

      <h3 className="font-semibold">
        {ROLE_LABELS[officer.role]}
      </h3>

      <p className="text-sm text-gray-700">
        {officer.name}
      </p>

      <RevealEmail email={email} />
      <RevealPhone phone={officer.phone} />
    </div>
  );
}

function OfficerCompact({ officer }) {
  return (
    <div className="rounded-lg bg-white border p-4 text-center text-sm shadow-sm">
      <div className="font-medium">
        {officer.name}
      </div>
      <div className="text-gray-600">
        {ROLE_LABELS[officer.role]}
      </div>
    </div>
  );
}