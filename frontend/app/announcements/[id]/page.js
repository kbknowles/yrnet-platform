"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AnnouncementDetailPage() {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`${API_BASE}/api/announcements/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setAnnouncement(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="p-6">Loading…</p>;
  if (!announcement) return <p className="p-6">Not found.</p>;

  const posterSrc =
    announcement.imageUrl &&
    `${API_BASE}${announcement.imageUrl}`;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      <nav className="text-sm text-slate-600 flex gap-2">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/announcements">Announcements</Link>
        <span>/</span>
        <span>{announcement.title}</span>
      </nav>

      <article className="bg-white border rounded shadow-sm overflow-hidden">
        {announcement.mode === "POSTER" && posterSrc ? (
          announcement.imageUrl.endsWith(".pdf") ? (
            <div className="p-10 text-center">
              <a
                href={posterSrc}
                target="_blank"
                className="text-ahsra-blue underline"
              >
                View Poster (PDF)
              </a>
            </div>
          ) : (
            <img
              src={posterSrc}
              alt={announcement.title}
              className="w-full object-contain"
            />
          )
        ) : (
          <div className="p-6">
            <h1 className="text-2xl font-semibold">
              {announcement.title}
            </h1>
            <div className="mt-4 whitespace-pre-line">
              {announcement.content}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
