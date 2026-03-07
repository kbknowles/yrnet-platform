// filepath: frontend/app/[tenantSlug]/leadership/page.js

import SponsorZone from "components/sponsorship/SponsorZone";
import { ROLE_LABELS, publicEmailForRole } from "lib/officerDisplay";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function getOfficers(tenantSlug) {
  try {
    const res = await fetch(`${API_BASE}/${tenantSlug}/officers`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function maskEmail(email) {
  if (!email) return null;
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;
  return `${name.charAt(0)}***@${domain}`;
}

function maskPhone(phone) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return phone;
  return `***-***-${digits.slice(-4)}`;
}

export default async function LeadershipPage({ params }) {
  const { tenantSlug } = await params;

  const officers = await getOfficers(tenantSlug);

  const executives = officers.filter((o) => o.type === "EXECUTIVE");
  const directors = officers.filter((o) => o.type === "DIRECTOR");
  const students = officers.filter((o) => o.type === "STUDENT");

  return (
    <main className="bg-gray-50">
      {/* HERO */}
      <section className="hero bg-secondary text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center space-y-6">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-heading md:text-5xl lg:text-6xl">
            Leadership
          </h1>

          <div className="w-24 h-1 bg-accent mx-auto" />

          <p className="mx-auto text-white/90 mb-6 text-lg font-normal text-body lg:text-xl sm:px-16 xl:px-48">
            <span className="block">
              Dedicated volunteers serving the association.
            </span>
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-4 py-16 space-y-20">
        <Section title="Executive Officers">
          {executives.map((o) => (
            <OfficerCard key={o.id} officer={o} />
          ))}
        </Section>

        <Section title="Board & Directors" compact>
          {directors.map((o) => (
            <OfficerCompact key={o.id} officer={o} />
          ))}
        </Section>

        <Section title="Student Leadership" compact>
          {students.map((o) => (
            <OfficerCompact key={o.id} officer={o} />
          ))}
        </Section>
      </section>

      {/* SPONSORS */}
      <section className="bg-white/90 py-4">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl font-semibold text-center">
            Thank You to Our Sponsors
          </h2>

          <div className="border-t-2 border-rose-700 w-20 mx-auto" />

          <SponsorZone
            contentType="SEASON"
            contentId={null}
            levels={["PREMIER", "FEATURED"]}
            slots={4}
          />
        </div>
      </section>
    </main>
  );
}

/* ---------------- Server-safe components ---------------- */

function Section({ title, children, compact }) {
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-semibold text-primary text-center">
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
  const maskedEmail = maskEmail(email);
  const maskedPhone = maskPhone(officer.phone);

  return (
    <div className="rounded-xl border bg-white p-6 text-center space-y-3 shadow-sm">
      <div className="mx-auto h-24 w-24 rounded-full bg-gray-200" />

      <h3 className="font-semibold">{ROLE_LABELS[officer.role]}</h3>

      <p className="text-sm text-gray-700">{officer.name}</p>

      <div className="text-sm space-y-1">
        {email && (
          <div>
            <span className="font-medium">Email: </span>
            <a
              href={`mailto:${email}`}
              className="text-primary hover:underline"
            >
              {maskedEmail}
            </a>
          </div>
        )}

        {officer.phone && (
          <div>
            <span className="font-medium">Phone: </span>
            <a
              href={`tel:${officer.phone}`}
              className="text-primary hover:underline"
            >
              {maskedPhone}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function OfficerCompact({ officer }) {
  return (
    <div className="rounded-lg bg-white border p-4 text-center text-sm shadow-sm">
      <div className="font-medium">{officer.name}</div>
      <div className="text-gray-600">{ROLE_LABELS[officer.role]}</div>
    </div>
  );
}