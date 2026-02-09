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
    const data = await res.json();
    setAnnouncement(data);
    setLoading(false);
  }

  useEffect(() => {
    if (id) load();
  }, [id]);

  if (loading) return <p className="p-6">Loading…</p>;
  if (!announcement) return <p className="p-6">Announcement not found.</p>;

  const isPdf =
    announcement.imageUrl && announcement.imageUrl.endsWith(".pdf");

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
          <div className="w-full">
            {isPdf ? (
              <iframe
                src={announcement.imageUrl}
                className="w-full h-[80vh]"
                title={announcement.title}
              />
            ) : (
              <img
                src={announcement.imageUrl}
                alt={announcement.title}
                className="w-full object-contain"
              />
            )}
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-semibold">
                {announcement.title}
              </h1>
              {announcement.type && (
                <span className="text-xs uppercase tracking-wide bg-slate-100 px-2 py-1 rounded">
                  {announcement.type}
                </span>
              )}
            </div>

            <div className="whitespace-pre-line text-slate-800">
              {announcement.content}
            </div>
          </div>
        )}

        {/* Meta */}
        <div className="text-xs text-slate-500 flex flex-wrap gap-4 p-6 border-t">
          {announcement.publishAt && (
            <span>
              Posted{" "}
              {new Date(announcement.publishAt).toLocaleDateString()}
            </span>
          )}
          {announcement.event && (
            <span>Event: {announcement.event.name}</span>
          )}
          {announcement.season && (
            <span>Season: {announcement.season.name}</span>
          )}
        </div>
      </article>
    </div>
  );
}
