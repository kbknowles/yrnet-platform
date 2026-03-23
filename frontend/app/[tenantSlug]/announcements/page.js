// filepath: frontend/app/[tenantSlug]/announcements/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SponsorZone from "components/sponsorship/SponsorZone";
import { useTenantSlug } from "hooks/useTenantSlug";
import { resolveTenantMedia } from "lib/media";
import { getBasePath } from "../../../utils/getBasePath";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AnnouncementsPage() {
  const tenantSlug = useTenantSlug();
  const basePath = getBasePath(tenantSlug);

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenantSlug) return;

    fetch(`${API_BASE}/${tenantSlug}/announcements`)
      .then((r) => r.json())
      .then((data) => {
        const safeData = Array.isArray(data) ? data : [];

        const sorted = [...safeData].sort((a, b) => {
          const aDate = new Date(a.publishAt || a.createdAt);
          const bDate = new Date(b.publishAt || b.createdAt);
          return bDate - aDate;
        });

        setAnnouncements(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tenantSlug]);

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <main className="bg-gray-50">
      {/* HERO */}
      <section className="hero bg-secondary text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center space-y-6">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            Announcements
          </h1>

          <div className="w-24 h-1 bg-accent mx-auto" />

          <p className="mx-auto text-white/90 mb-6 text-lg font-normal text-body lg:text-xl sm:px-16 xl:px-48">
            Stay up to date with rodeo news, event updates, important notices,
            and special announcements.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((a) => {
            const imageSrc = a.imageUrl
              ? resolveTenantMedia({
                  tenantSlug,
                  folder: "announcements",
                  filename: a.imageUrl,
                  recordId: a.id,
                })
              : null;

            const eventHref = a.rodeo?.slug
              ? `${basePath}/rodeos/${a.rodeo.slug}`
              : a.event?.slug
              ? `${basePath}/rodeos/${a.event.slug}`
              : null;

            const Wrapper = ({ children }) =>
              eventHref ? (
                <Link
                  href={eventHref}
                  className="border rounded shadow-sm overflow-hidden flex flex-col hover:shadow-md transition bg-white"
                >
                  {children}
                </Link>
              ) : (
                <div className="border rounded shadow-sm overflow-hidden flex flex-col bg-white">
                  {children}
                </div>
              );

            return (
              <Wrapper key={a.id}>
                <div className="p-3 border-b font-medium text-sm truncate">
                  {a.title}
                </div>

                {a.mode === "POSTER" && imageSrc && (
                  <img
                    src={imageSrc}
                    alt={a.title}
                    className="w-full h-[240px] object-contain"
                  />
                )}

                {a.content && (
                  <div
                    className="p-4 text-sm text-slate-800 flex-1"
                    dangerouslySetInnerHTML={{ __html: a.content }}
                  />
                )}

                {eventHref && (
                  <div className="p-3 text-sm text-primary underline">
                    View rodeo details →
                  </div>
                )}
              </Wrapper>
            );
          })}
        </div>
      </section>

      {/* SPONSORS */}
      <section className="bg-white/90 py-4">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl font-semibold text-center">
            Thank You to Our Sponsors
          </h2>

          <div className="border-t-2 border-rose-700 w-20 mx-auto" />

          <SponsorZone
            tenantSlug={tenantSlug}
            contentType="ANNOUNCEMENT"
            contentId={null}
            levels={["PREMIER", "FEATURED"]}
            slots={4}
          />
        </div>
      </section>
    </main>
  );
}