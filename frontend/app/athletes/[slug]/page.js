// filepath: frontend/app/athletes/[slug]/page.js

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SponsorZone from "../../../components/sponsorship/SponsorZone";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function resolveMedia(url) {
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
  const { slug } = await props.params;   // ← FIX
  const athlete = await getAthlete(slug);

  if (!athlete || !athlete.isActive) {
    notFound();
  }

  return (
    <main className="bg-gray-50">
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

      <section className="max-w-5xl mx-auto px-4 py-16 space-y-12">

        {/* Headshot */}
        {athlete.headshotUrl && (
          <div className="relative w-full max-w-sm aspect-square mx-auto rounded-lg bg-gray-100 shadow-sm overflow-hidden">
            <Image
              src={resolveMedia(athlete.headshotUrl)}
              alt={`${athlete.firstName} ${athlete.lastName}`}
              fill
              unoptimized
              className="object-contain p-3"
            />
          </div>
        )}

        {/* Action Photos */}
        {athlete.actionPhotos?.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">In Action</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {athlete.actionPhotos.map((photo, idx) => (
                <div
                  key={idx}
                  className="relative w-full aspect-[4/3] rounded-lg bg-gray-100 shadow-sm overflow-hidden"
                >
                  <Image
                    src={resolveMedia(photo)}
                    alt="Action photo"
                    fill
                    unoptimized
                    className="object-contain p-4"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Videos */}
        {athlete.videos?.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">
              Highlight Videos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {athlete.videos.map((video, idx) => (
                <div key={idx} className="w-full rounded-lg bg-black overflow-hidden">
                  <video
                    src={resolveMedia(video)}
                    controls
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sponsors */}
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

      </section>
    </main>
  );
}