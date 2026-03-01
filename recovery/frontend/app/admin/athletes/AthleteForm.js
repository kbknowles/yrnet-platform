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
  "REINED_COW",
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

function resolveImage(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return `${API_BASE}${url}`;
  return url;
}

export default function AthleteForm({ slug, mode = "create" }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [headshotFile, setHeadshotFile] = useState(null);
  const [actionFiles, setActionFiles] = useState([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  useEffect(() => {
    if (mode !== "edit" || !slug) return;

    async function loadData() {
      try {
        const res = await fetch(
          `${API_BASE}/api/admin/athletes/${slug}`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error();
        const data = await res.json();

        setForm({
          ...EMPTY_FORM,
          ...data,
          events: data.events || [],
          actionPhotos: data.actionPhotos || [],
          videos: data.videos || [],
          isActive: data.isActive ?? true,
        });

        setLoading(false);
      } catch {
        alert("Failed to load athlete");
      }
    }

    loadData();
  }, [mode, slug]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
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

      const res = await fetch(
        `${API_BASE}/api/admin/athletes${mode === "edit" ? `/${slug}` : ""}`,
        {
          method: mode === "edit" ? "PUT" : "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error();

      window.location.href = "/admin/athletes";
    } catch {
      alert("Save failed");
      setSaving(false);
    }
  }

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-10 p-6 max-w-6xl mx-auto">

      {/* Core Fields */}
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

      {/* Headshot */}
      <section>
        <label className="font-semibold block mb-2">Headshot</label>
        {form.headshotUrl && (
          <img
            src={resolveImage(form.headshotUrl)}
            className="max-h-40 mb-3 object-contain border rounded"
          />
        )}
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => setHeadshotFile(e.target.files?.[0])}
        />
      </section>

      {/* Action Photos */}
      <section>
        <label className="font-semibold block mb-2">
          Action Photos (Multiple)
        </label>

        {form.actionPhotos?.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {form.actionPhotos.map((url, idx) => (
              <img
                key={idx}
                src={resolveImage(url)}
                className="max-h-32 object-cover border rounded"
              />
            ))}
          </div>
        )}

        <input
          type="file"
          multiple
          accept="image/jpeg,image/png"
          onChange={(e) =>
            setActionFiles(Array.from(e.target.files || []))
          }
        />
      </section>

      {/* Videos */}
      <section>
        <label className="font-semibold block mb-2">
          Videos (YouTube/Vimeo URLs)
        </label>

        <textarea
          className="w-full min-h-[120px]"
          placeholder="Enter one video URL per line"
          value={form.videos.join("\n")}
          onChange={(e) =>
            update(
              "videos",
              e.target.value
                .split("\n")
                .map((v) => v.trim())
                .filter(Boolean)
            )
          }
        />
      </section>

      {/* Bio */}
      <section>
        <label className="font-semibold block mb-2">Athlete Bio</label>
        <textarea
          className="w-full min-h-[200px]"
          value={form.bio}
          onChange={(e) => update("bio", e.target.value)}
        />
      </section>

      {/* Events */}
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

      <button type="submit" disabled={saving}
        className="bg-black text-white px-6 py-2">
        {saving ? "Saving…" : "Save Athlete"}
      </button>
    </form>
  );
}