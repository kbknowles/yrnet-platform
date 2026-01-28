// frontend/app/admin/announcements/page.js

"use client";

import { useEffect, useState } from "react";
import AnnouncementForm from "../../../components/admin/AnnouncementForm";



export default function AdminAnnouncementsPage() {
const API = process.env.NEXT_PUBLIC_API_URL;

const [announcements, setAnnouncements] = useState([]);

  async function loadAnnouncements() {
    const res = await fetch(`${API}/api/admin/announcements`);
    const data = await res.json();
    setAnnouncements(data);
  }

  useEffect(() => {
    loadAnnouncements();
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-2xl font-bold">Announcements</h1>

      <AnnouncementForm onCreated={loadAnnouncements} />

      <section className="space-y-3">
        {announcements.map((a) => (
          <div key={a.id} className="border rounded p-3 bg-white text-sm">
            <div className="font-medium">{a.title}</div>
            <div className="text-gray-600">{a.type || "general"}</div>
            {!a.published && (
              <div className="text-red-600 font-medium">Draft</div>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}
