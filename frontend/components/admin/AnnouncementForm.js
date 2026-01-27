"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AnnouncementForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("general");

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch(`${API}/api/admin/announcements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        type,
        published: false,
      }),
    });

    setTitle("");
    setContent("");
    setType("general");

    onCreated();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded border">
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
        placeholder="Content"
        rows={4}
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

      <button
        type="submit"
        className="bg-ahsra-blue text-white px-4 py-2 rounded"
      >
        Save Announcement
      </button>
    </form>
  );
}
