// filepath: frontend/app/athletes/[slug]/page.js

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SponsorZone from "../../../components/sponsorship/SponsorZone";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function resolveImage(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return `${API_BASE}${url}`;
  return url;
}

async function getAthlete(slug) {
  const res = await fetch(`${API_BASE}/api/athletes/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function AthleteDetailPage(props) {
  const { slug } = await props.params;
  const athlete = await getAthlete(slug);

  if (!athlete || !athlete.isActive) {
    notFound();
  }

  return (
    <main className="bg-gray-50">
      {/* HERO */}
      <section className="bg-ahsra-blue/95 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 space-y-3">
          <nav className="text-sm text-white/80">
            <Link href="/athletes" className="hover:underline">
              Athletes
            </Link>
            <span className="mx-2">/</span>
            <span>
              {athlete.firstName} {athlete.lastName}
            </span>
          </nav>

          <h1 className="text-4xl font-bold">
            {athlete.firstName} {athlete.lastName}
          </h1>

          {athlete.school && (
            <p className="text-white/90">
              {athlete.school}
              {athlete.grade && ` • Grade ${athlete.grade}`}
            </p>
          )}
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-5xl mx-auto px-4 py-16 space-y-12">
        {/* Profile Section */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {athlete.headshotUrl && (
            <div className="relative w-full aspect-square rounded-lg bg-gray-100 shadow-sm overflow-hidden">
              <Image
                src={resolveImage(athlete.headshotUrl)}
                alt={`${athlete.firstName} ${athlete.lastName}`}
                fill
                unoptimized
                className="object-contain p-3"
              />
            </div>
          )}

          <div className="md:col-span-3 space-y-4">
            {athlete.hometown && (
              <p>
                <strong>Hometown:</strong> {athlete.hometown}
              </p>
            )}

            {athlete.events?.length > 0 && (
              <p>
                <strong>Events:</strong>{" "}
                {athlete.events
                  .map((e) =>
                    e
                      .toLowerCase()
                      .split("_")
                      .map(
                        (w) => w.charAt(0).toUpperCase() + w.slice(1)
                      )
                      .join(" ")
                  )
                  .join(", ")}
              </p>
            )}
          </div>
        </section>

        {/* Athlete Sponsors */}
        <section className="bg-white border rounded-xl p-8 shadow-sm space-y-6">
          <h2 className="text-2xl font-semibold">
            Athlete Sponsors
          </h2>

          <SponsorZone
            contentType="ATHLETE"
            contentId={athlete.id}
            slots={4}
          />
        </section>

        {/* Bio */}
        {athlete.bio && (
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">
              Athlete Bio
            </h2>
            <p className="leading-relaxed">
              {athlete.bio}
            </p>
          </section>
        )}

        {/* Future Goals */}
        {athlete.futureGoals && (
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">
              Future Goals
            </h2>
            <p className="leading-relaxed">
              {athlete.futureGoals}
            </p>
          </section>
        )}

        {/* Action Photo */}
        {athlete.actionPhotoUrl && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              In Action
            </h2>

            <div className="relative w-full aspect-[16/9] rounded-lg bg-gray-100 shadow-sm overflow-hidden">
              <Image
                src={resolveImage(athlete.actionPhotoUrl)}
                alt="Action shot"
                fill
                unoptimized
                className="object-contain p-4"
              />
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
