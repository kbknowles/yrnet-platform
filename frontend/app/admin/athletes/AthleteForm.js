// filepath: frontend/components/admin/AthleteForm.js

"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const EVENT_OPTIONS = [
  "BAREBACK",
  "SADDLE_BRONC",
  "BULL_RIDING",
  "BARREL_RACING",
  "POLE_BENDING",
  "GOAT_TYING",
  "BREAKAWAY_ROPING",
  "TIE_DOWN_ROPING",
  "TEAM_ROPING",
  "STEER_WRESTLING",
  "RANCH_SADDLE_BRONC",
];

const EMPTY_FORM = {
  id: null,
  firstName: "",
  lastName: "",
  school: "",
  grade: "",
  hometown: "",
  bio: "",
  events: [],
  futureGoals: "",
  socialLinks: [],
  isActive: true,
  isFeatured: false,
  sortOrder: 0,
  headshotUrl: "",
  actionPhotos: [],
  videos: [],
};

function resolveMedia(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return `${API_BASE}${url}`;
  return url;
}

export default function AthleteForm({ slug, mode = "create" }) {
  const [form, setForm] = useState(EMPTY_FORM);

  const [headshotFile, setHeadshotFile] = useState(null);
  const [actionFiles, setActionFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);

  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  useEffect(() => {
    if (mode !== "edit" || !slug) return;

    async function load() {
      const res = await fetch(`${API_BASE}/api/admin/athletes/${slug}`);
      if (!res.ok) {
        alert("Failed to load athlete");
        return;
      }

      const data = await res.json();

      setForm({
        ...EMPTY_FORM,
        ...data,
        events: data.events || [],
        actionPhotos: data.actionPhotos || [],
        videos: data.videos || [],
      });

      setLoading(false);
    }

    load();
  }, [mode, slug]);

  function removeExistingActionPhoto(index) {
    update(
      "actionPhotos",
      form.actionPhotos.filter((_, i) => i !== index)
    );
  }

  function removeExistingVideo(index) {
    update(
      "videos",
      form.videos.filter((_, i) => i !== index)
    );
  }

  function removeNewActionFile(index) {
    setActionFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function removeNewVideoFile(index) {
    setVideoFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value ?? "");
      }
    });

    if (headshotFile) formData.append("headshot", headshotFile);

    actionFiles.forEach((file) => {
      formData.append("actionPhotos", file);
    });

    videoFiles.forEach((file) => {
      formData.append("videos", file);
    });

    const res = await fetch(
      `${API_BASE}/api/admin/athletes${mode === "edit" ? `/${slug}` : ""}`,
      {
        method: mode === "edit" ? "PUT" : "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      alert("Save failed");
      setSaving(false);
      return;
    }

    window.location.href = "/admin/athletes";
  }

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-10 p-6 max-w-6xl mx-auto">

      {/* BASIC INFO */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input required placeholder="First Name"
          value={form.firstName}
          onChange={(e) => update("firstName", e.target.value)} />
        <input required placeholder="Last Name"
          value={form.lastName}
          onChange={(e) => update("lastName", e.target.value)} />
        <input placeholder="School"
          value={form.school}
          onChange={(e) => update("school", e.target.value)} />
        <input placeholder="Grade"
          value={form.grade}
          onChange={(e) => update("grade", e.target.value)} />
        <input placeholder="Hometown"
          value={form.hometown}
          onChange={(e) => update("hometown", e.target.value)} />
      </section>

      {/* MEDIA */}
      <section className="space-y-10">

        {/* HEADSHOT */}
        <div>
          <label className="font-semibold block mb-2">Headshot</label>

          {form.headshotUrl && (
            <div className="relative inline-block mb-3">
              <img
                src={resolveMedia(form.headshotUrl)}
                className="max-h-40 object-contain border rounded"
              />
              <button
                type="button"
                onClick={() => update("headshotUrl", "")}
                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          )}

          {headshotFile && (
            <div className="relative inline-block mb-3">
              <img
                src={URL.createObjectURL(headshotFile)}
                className="max-h-40 object-contain border rounded"
              />
              <button
                type="button"
                onClick={() => setHeadshotFile(null)}
                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          )}

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setHeadshotFile(e.target.files?.[0])}
          />
        </div>

        {/* ACTION PHOTOS */}
        <div>
          <label className="font-semibold block mb-2">
            Action Photos (Max 4)
          </label>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {form.actionPhotos.map((photo, idx) => (
              <div key={idx} className="relative">
                <img
                  src={resolveMedia(photo)}
                  className="h-32 w-full object-contain border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeExistingActionPhoto(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}

            {actionFiles.map((file, idx) => (
              <div key={`new-${idx}`} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  className="h-32 w-full object-contain border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeNewActionFile(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {(form.actionPhotos.length + actionFiles.length) < 4 && (
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) =>
                setActionFiles([...actionFiles, ...e.target.files])
              }
            />
          )}
        </div>

        {/* VIDEOS */}
        <div>
          <label className="font-semibold block mb-2">
            Videos (Max 4)
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {form.videos.map((video, idx) => (
              <div key={idx} className="relative">
                <video
                  src={resolveMedia(video)}
                  controls
                  className="w-full border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeExistingVideo(idx)}
                  className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}

            {videoFiles.map((file, idx) => (
              <div key={`new-video-${idx}`} className="relative">
                <video
                  src={URL.createObjectURL(file)}
                  controls
                  className="w-full border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeNewVideoFile(idx)}
                  className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {(form.videos.length + videoFiles.length) < 4 && (
            <input
              type="file"
              multiple
              accept="video/mp4,video/quicktime,video/webm"
              onChange={(e) =>
                setVideoFiles([...videoFiles, ...e.target.files])
              }
            />
          )}
        </div>

      </section>

      {/* EVENTS */}
      <section>
        <label className="font-semibold block mb-2">Events</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {EVENT_OPTIONS.map((event) => (
            <label key={event} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.events.includes(event)}
                onChange={(e) =>
                  update(
                    "events",
                    e.target.checked
                      ? [...form.events, event]
                      : form.events.filter((v) => v !== event)
                  )
                }
              />
              {event.replaceAll("_", " ")}
            </label>
          ))}
        </div>
      </section>

      <button
        type="submit"
        disabled={saving}
        className="bg-black text-white px-6 py-2"
      >
        {saving ? "Saving…" : "Save Athlete"}
      </button>

    </form>
  );
}