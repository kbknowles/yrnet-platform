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
  const { slug } = props.params;
  const athlete = await getAthlete(slug);

  if (!athlete || !athlete.isActive) {
    notFound();
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-12">
      
      {/* Breadcrumb */}
      <nav className="text-sm">
        <Link href="/athletes" className="text-blue-600 hover:underline">
          Athletes
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">
          {athlete.firstName} {athlete.lastName}
        </span>
      </nav>

      {/* Header Section */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {athlete.headshotUrl && (
          <div className="relative w-full aspect-square border rounded bg-gray-100 overflow-hidden">
            <Image
              src={resolveImage(athlete.headshotUrl)}
              alt={`${athlete.firstName} ${athlete.lastName}`}
              fill
              unoptimized
              className="object-contain p-2"
            />
          </div>
        )}

        <div className="md:col-span-3 space-y-3">
          <h1 className="text-3xl font-bold">
            {athlete.firstName} {athlete.lastName}
          </h1>

          {athlete.school && (
            <p><strong>School:</strong> {athlete.school}</p>
          )}
          {athlete.grade && (
            <p><strong>Grade:</strong> {athlete.grade}</p>
          )}
          {athlete.hometown && (
            <p><strong>Hometown:</strong> {athlete.hometown}</p>
          )}

          {athlete.events?.length > 0 && (
            <p>
              <strong>Events:</strong>{" "}
              {athlete.events
                .map((e) => e.replaceAll("_", " "))
                .join(", ")}
            </p>
          )}
        </div>
      </section>

      {/* Athlete Sponsorship Zone */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
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
        <section>
          <h2 className="text-xl font-semibold mb-2">Athlete Bio</h2>
          <p>{athlete.bio}</p>
        </section>
      )}

      {/* Future Goals */}
      {athlete.futureGoals && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Future Goals</h2>
          <p>{athlete.futureGoals}</p>
        </section>
      )}

      {/* Action Photo */}
      {athlete.actionPhotoUrl && (
        <section>
          <h2 className="text-xl font-semibold mb-3">In Action</h2>
          <div className="relative w-full aspect-[16/9] border rounded bg-gray-100 overflow-hidden">
            <Image
              src={resolveImage(athlete.actionPhotoUrl)}
              alt="Action shot"
              fill
              unoptimized
              className="object-contain p-2"
            />
          </div>
        </section>
      )}
    </main>
  );
}
