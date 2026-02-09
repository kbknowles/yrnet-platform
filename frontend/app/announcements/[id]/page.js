"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AnnouncementDetailPage() {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    const res = await fetch(`${API_BASE}/api/announcements/${id}`);
    if (!res.ok) {
      setAnnouncement(null);
      setLoading(false);
      return;
    }

    const data = await res.json();
    setAnnouncement(data);
    setLoading(false);
  }

  useEffect(() => {
    if (id) load();
  }, [id]);

  if (loading) return <p className="p-6">Loading…</p>;
  if (!announcement)
    return <p className="p-6">Announcement not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      {/* Breadcrumbs */}
      <nav className="text-sm text-slate-600 flex items-center gap-2">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span>/</span>
        <Link href="/announcements" className="hover:underline">
          Announcements
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium truncate">
          {announcement.title}
        </span>
      </nav>

      {/* Back */}
      <Link
        href="/announcements"
        className="text-sm text-ahsra-blue hover:underline"
      >
        ← Back to Announcements
      </Link>

      {/* Content */}
      <article className="bg-white border rounded shadow-sm overflow-hidden">
        {announcement.mode === "POSTER" && announcement.imageUrl ? (
          announcement.imageUrl.endsWith(".pdf") ? (
            <div className="p-10 flex justify-center">
              <a
                href={announcement.imageUrl}
                target="_blank"
                className="text-ahsra-blue underline"
              >
                View Poster (PDF)
              </a>
            </div>
          ) : (
            <img
              src={announcement.imageUrl}
              alt={announcement.title}
              className="w-full object-contain"
            />
          )
        ) : (
          <div className="p-6 space-y-4">
            <h1 className="text-2xl font-semibold">
              {announcement.title}
            </h1>

            <div className="whitespace-pre-line text-slate-800">
              {announcement.content}
            </div>
          </div>
        )}

        {/* Meta */}
        <div className="px-6 py-4 text-xs text-slate-500 border-t flex gap-4">
          {announcement.publishAt && (
            <span>
              Posted{" "}
              {new Date(announcement.publishAt).toLocaleDateString()}
            </span>
          )}
          {announcement.eventId && (
            <span>Event #{announcement.eventId}</span>
          )}
        </div>
      </article>
    </div>
  );
}
