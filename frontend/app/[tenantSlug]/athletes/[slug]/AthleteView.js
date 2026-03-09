// filepath: frontend/app/athletes/[slug]/AthleteView.js

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SponsorZone from "components/sponsorship/SponsorZone";
import AlbumSlideshow from "components/gallery/AlbumSlideshow";

export default function AthleteView({ athlete, API_BASE, tenantSlug }) {
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  const actionImages = athlete.actionPhotos || [];
  const videos = athlete.videos?.slice(0, 4) || [];

  const awards =
    athlete.awards?.filter((a) => a && a.trim() !== "") || [];

  const socialLinks =
    athlete.socialLinks?.filter((s) => s && s.trim() !== "") || [];

  function resolveImage(src) {
    if (!src) return null;
    if (src.startsWith("http")) return src;

    const clean = src.replace(/^\/+/, "");

    return `${API_BASE}/uploads/tenants/${tenantSlug}/images/${clean}`;
  }

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") {
        setOpen(false);
        setVideoOpen(false);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <main className="bg-gray-50">
      {/* HERO */}
      <section className="bg-secondary text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 space-y-3">
          <nav className="text-sm text-white/80">
            <Link href={`/${tenantSlug}/athletes`} className="hover:underline">
              Athletes
            </Link>
            <span className="text-white mx-2">/</span>
            <span className="text-white">
              {athlete.firstName} {athlete.lastName}
            </span>
          </nav>

          <h1 className="hero text-4xl font-bold">
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

        {/* Profile */}
        <section className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {athlete.headshotUrl && (
            <div className="relative w-full aspect-square rounded-xl bg-gray-100 shadow-md overflow-hidden md:col-span-2 flex items-center justify-center p-4">
              <Image
                src={resolveImage(athlete.headshotUrl)}
                alt={`${athlete.firstName} ${athlete.lastName}`}
                fill
                unoptimized
                className="object-contain"
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
              <div>
                <p>
                  <strong>Events:</strong>{" "}
                  {athlete.events
                    .map((e) =>
                      e
                        .toLowerCase()
                        .split("_")
                        .map(
                          (w) =>
                            w.charAt(0).toUpperCase() +
                            w.slice(1)
                        )
                        .join(" ")
                    )
                    .join(", ")}
                </p>

                {awards.length > 0 && (
                  <p className="mt-2">
                    <strong>Awards:</strong> {awards.join(", ")}
                  </p>
                )}

                {socialLinks.length > 0 && (
                  <div className="mt-2">
                    <strong>Connect:</strong>{" "}
                    {socialLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline mr-3"
                      >
                        Link {idx + 1}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
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

        {/* Action Photos */}
        {actionImages.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              In Action
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {actionImages.map((photo, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setStartIndex(idx);
                    setOpen(true);
                  }}
                  className="relative w-full aspect-[16/9] rounded-lg bg-gray-100 shadow-sm overflow-hidden cursor-pointer"
                >
                  <Image
                    src={resolveImage(photo)}
                    alt="Action shot"
                    fill
                    unoptimized
                    className="object-contain p-4"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

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

        {/* Videos */}
        {videos.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              Highlight Videos
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((video, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveVideo(resolveImage(video));
                    setVideoOpen(true);
                  }}
                  className="relative aspect-[16/9] rounded-lg overflow-hidden cursor-pointer group bg-black"
                >
                  <video
                    src={resolveImage(video)}
                    preload="metadata"
                    muted
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-black text-2xl shadow">
                      ▶
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </section>

      {/* PHOTO MODAL */}
      {open && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 text-white text-3xl"
          >
            ✕
          </button>

          <div
            className="w-[90vw] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <AlbumSlideshow
              images={actionImages.map((url) => ({
                imageUrl: resolveImage(url),
              }))}
              initialIndex={startIndex}
            />
          </div>
        </div>
      )}

      {/* VIDEO MODAL */}
      {videoOpen && activeVideo && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
          onClick={() => setVideoOpen(false)}
        >
          <button
            onClick={() => setVideoOpen(false)}
            className="absolute top-6 right-6 text-white text-3xl"
          >
            ✕
          </button>

          <div
            className="w-[95vw] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={activeVideo}
              controls
              autoPlay
              className="w-full h-auto rounded"
            />
          </div>
        </div>
      )}

      {/* SEASON SPONSORS */}
      <section className="bg-white/90 py-4">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl font-semibold text-center">
            Thank You to Our Association Sponsors
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