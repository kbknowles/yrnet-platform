// filepath: frontend/components/admin/AthleteForm.js

"use client";

import { useEffect, useState } from "react";
import { resolveTenantMedia } from "lib/media";

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
  futureGoals: "",
  events: [],
  socialLinks: [],
  isActive: true,
  isFeatured: false,
  sortOrder: 0,
  headshotUrl: "",
  actionPhotos: [],
  videos: [],
};

function resolveMedia(filename, tenantSlug) {
  if (!filename) return null;

  return resolveTenantMedia({
    tenantSlug,
    folder: "images",
    filename,
  });
}

export default function AthleteForm({ slug, tenantSlug, mode = "create" }) {
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
    if (mode !== "edit" || !slug || !tenantSlug) return;

    async function load() {
      const res = await fetch(
        `${API_BASE}/${tenantSlug}/admin/athletes/${slug}`
      );

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
  }, [mode, slug, tenantSlug]);

  /* ---------------- REMOVE EXISTING ---------------- */

  function removeExistingHeadshot() {
    update("headshotUrl", "");
  }

  function removeExistingActionPhoto(index) {
    update("actionPhotos", form.actionPhotos.filter((_, i) => i !== index));
  }

  function removeExistingVideo(index) {
    update("videos", form.videos.filter((_, i) => i !== index));
  }

  /* ---------------- REMOVE NEW ---------------- */

  function removeNewHeadshot() {
    setHeadshotFile(null);
  }

  function removeNewActionFile(index) {
    setActionFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function removeNewVideoFile(index) {
    setVideoFiles((prev) => prev.filter((_, i) => i !== index));
  }

  /* ---------------- SUBMIT ---------------- */

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
    actionFiles.forEach((file) => formData.append("actionPhotos", file));
    videoFiles.forEach((file) => formData.append("videos", file));

    const res = await fetch(
      `${API_BASE}/${tenantSlug}/admin/athletes${
        mode === "edit" ? `/${slug}` : ""
      }`,
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

    window.location.href = `/${tenantSlug}/admin/athletes`;
  }

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-10 p-6 max-w-6xl mx-auto">

      {/* BASIC INFO */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            required
            className="w-full border rounded p-2"
            value={form.firstName}
            onChange={(e) => update("firstName", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            required
            className="w-full border rounded p-2"
            value={form.lastName}
            onChange={(e) => update("lastName", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">School</label>
          <input
            className="w-full border rounded p-2"
            value={form.school}
            onChange={(e) => update("school", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Grade</label>
          <input
            className="w-full border rounded p-2"
            value={form.grade}
            onChange={(e) => update("grade", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Hometown</label>
          <input
            className="w-full border rounded p-2"
            value={form.hometown}
            onChange={(e) => update("hometown", e.target.value)}
          />
        </div>
      </section>

      {/* BIO */}
      <section>
        <label className="block text-sm font-medium mb-2">Bio</label>
        <textarea
          className="w-full border rounded p-2 min-h-[120px]"
          value={form.bio}
          onChange={(e) => update("bio", e.target.value)}
        />
      </section>

      {/* FUTURE GOALS */}
      <section>
        <label className="block text-sm font-medium mb-2">Future Goals</label>
        <textarea
          className="w-full border rounded p-2 min-h-[120px]"
          value={form.futureGoals}
          onChange={(e) => update("futureGoals", e.target.value)}
        />
      </section>

      {/* MEDIA */}
      <section className="space-y-8">

        {/* HEADSHOT */}
        <div>
          <label className="block text-sm font-medium mb-2">Headshot</label>

          {form.headshotUrl && !headshotFile && (
            <div className="relative inline-block mb-3">
              <img
                src={resolveMedia(form.headshotUrl, tenantSlug)}
                className="max-h-40 border rounded"
              />
              <button
                type="button"
                onClick={removeExistingHeadshot}
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
                className="max-h-40 border rounded"
              />
              <button
                type="button"
                onClick={removeNewHeadshot}
                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          )}

          <input type="file" accept="image/*" onChange={(e) => setHeadshotFile(e.target.files?.[0])} />
        </div>

        {/* ACTION PHOTOS */}
        <div>
          <label className="block text-sm font-medium mb-2">Action Photos</label>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {form.actionPhotos.map((photo, idx) => (
              <div key={`existing-${idx}`} className="relative">
                <img src={resolveMedia(photo, tenantSlug)} className="h-32 w-full object-contain border rounded" />
                <button type="button" onClick={() => removeExistingActionPhoto(idx)} className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded">
                  Delete
                </button>
              </div>
            ))}

            {actionFiles.map((file, idx) => (
              <div key={`new-${idx}`} className="relative">
                <img src={URL.createObjectURL(file)} className="h-32 w-full object-contain border rounded" />
                <button type="button" onClick={() => removeNewActionFile(idx)} className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded">
                  Remove
                </button>
              </div>
            ))}
          </div>

          <input type="file" multiple accept="image/*" onChange={(e) => setActionFiles([...e.target.files])} />
        </div>

        {/* VIDEOS */}
        <div>
          <label className="block text-sm font-medium mb-2">Videos</label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {form.videos.map((video, idx) => (
              <div key={`existing-${idx}`} className="relative">
                <video src={resolveMedia(video, tenantSlug)} controls className="w-full border rounded" />
                <button type="button" onClick={() => removeExistingVideo(idx)} className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                  Delete
                </button>
              </div>
            ))}

            {videoFiles.map((file, idx) => (
              <div key={`new-${idx}`} className="relative">
                <video src={URL.createObjectURL(file)} controls className="w-full border rounded" />
                <button type="button" onClick={() => removeNewVideoFile(idx)} className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                  Remove
                </button>
              </div>
            ))}
          </div>

          <input type="file" multiple accept="video/*" onChange={(e) => setVideoFiles([...e.target.files])} />
        </div>

      </section>

      {/* EVENTS */}
      <section>
        <label className="block text-sm font-medium mb-2">Events</label>
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

      <button type="submit" disabled={saving} className="bg-black text-white px-6 py-2">
        {saving ? "Saving…" : "Save Athlete"}
      </button>

    </form>
  );
}