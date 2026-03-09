// filepath: frontend/components/AnnouncementForm.js
"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AnnouncementForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("general");
  const [published, setPublished] = useState(false);
  const [eventId, setEventId] = useState("");
  const [seasonId, setSeasonId] = useState("");

  const [events, setEvents] = useState([]);
  const [seasons, setSeasons] = useState([]);

  useEffect(() => {
    async function load() {
      const [eRes, sRes] = await Promise.all([
        fetch(`${API_BASE}/${tenantSlug}/admin/rodeos`),
        fetch(`${API_BASE}/api/admin/seasons`),
      ]);

      const [eData, sData] = await Promise.all([
        eRes.json(),
        sRes.json(),
      ]);

      setEvents(eData || []);
      setSeasons(sData || []);
    }

    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch(`${API_BASE}/${tenantSlug}/admin/announcements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        type,
        published,
        eventId: eventId || null,
        seasonId: seasonId || null,
      }),
    });

    setTitle("");
    setContent("");
    setType("general");
    setPublished(false);
    setEventId("");
    setSeasonId("");

    onCreated?.();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 rounded border"
    >
      <h2 className="font-semibold">New Announcement</h2>

      <input
        className="w-full border rounded p-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        className="w-full border rounded p-2"
        placeholder="Content (HTML allowed — use <a href=''> links)"
        rows={6}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />

      <select
        className="w-full border rounded p-2"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="general">General</option>
        <option value="entry">Entry</option>
        <option value="stall">Stall</option>
        <option value="reminder">Reminder</option>
      </select>

      <select
        className="w-full border rounded p-2"
        value={eventId}
        onChange={(e) => setEventId(e.target.value)}
      >
        <option value="">All Events</option>
        {events.map((e) => (
          <option key={e.id} value={e.id}>
            {e.name || e.title}
          </option>
        ))}
      </select>

      <select
        className="w-full border rounded p-2"
        value={seasonId}
        onChange={(e) => setSeasonId(e.target.value)}
      >
        <option value="">All Seasons</option>
        {seasons.map((s) => (
          <option key={s.id} value={s.id}>
            {s.year ?? `${s.startDate?.slice(0,4)}-${s.endDate?.slice(0,4)}`}
          </option>
        ))}
      </select>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        Published
      </label>

      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded"
      >
        Save Announcement
      </button>
    </form>
  );
}