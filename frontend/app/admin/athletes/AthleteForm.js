// filepath: frontend/app/admin/athletes/AthleteForm.js

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
  firstName: "",
  lastName: "",
  school: "",
  grade: "",
  hometown: "",
  bio: "",
  events: [],
  headshotUrl: "",
  actionPhotoUrl: "",
  futureGoals: "",
  sponsors: [],
  socialLinks: [],
  isActive: true,
  isFeatured: false,
  sortOrder: 0,
};

export default function AthleteForm({ slug, mode = "create" }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  /* ----------------------------
     LOAD ATHLETE (EDIT MODE)
  ----------------------------- */
  useEffect(() => {
    if (mode !== "edit" || !slug) return;

    async function loadAthlete() {
      setLoading(true);

      const res = await fetch(
        `${API_BASE}/api/admin/athletes/${slug}`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        alert("Failed to load athlete");
        setLoading(false);
        return;
      }

      const data = await res.json();

      setForm({
        ...EMPTY_FORM,
        ...data,
        events: data.events || [],
        isActive: data.isActive ?? true,
      });

      setLoading(false);
    }

    loadAthlete();
  }, [mode, slug]);

  /* ----------------------------
     IMAGE UPLOAD
  ----------------------------- */
  async function uploadImage(file, field) {
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      alert("Only JPEG and PNG images allowed");
      return;
    }

    const data = new FormData();
    data.append("file", file);

    const res = await fetch(`${API_BASE}/api/admin/uploads/image`, {
      method: "POST",
      body: data,
    });

    if (!res.ok) {
      alert("Image upload failed");
      return;
    }

    const { url } = await res.json();
    update(field, url);
  }

  /* ----------------------------
     SAVE
  ----------------------------- */
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch(
      `${API_BASE}/api/admin/athletes${mode === "edit" ? `/${slug}` : ""}`,
      {
        method: mode === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("Save failed:", err);
      alert("Failed to save athlete. See console.");
      setSaving(false);
      return;
    }

    window.location.href = "/admin/athletes";
  }

  if (loading) {
    return <p className="p-6">Loading athlete…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 p-6 max-w-6xl mx-auto">
      {/* BASIC */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input required placeholder="First Name"
          value={form.firstName}
          onChange={(e) => update("firstName", e.target.value)}
        />
        <input required placeholder="Last Name"
          value={form.lastName}
          onChange={(e) => update("lastName", e.target.value)}
        />
        <input placeholder="School"
          value={form.school}
          onChange={(e) => update("school", e.target.value)}
        />
        <input placeholder="Grade"
          value={form.grade}
          onChange={(e) => update("grade", e.target.value)}
        />
        <input placeholder="Hometown"
          value={form.hometown}
          onChange={(e) => update("hometown", e.target.value)}
        />
      </section>

      {/* STATUS */}
      <section>
        <label className="flex items-center gap-2 font-semibold">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => update("isActive", e.target.checked)}
          />
          Athlete is Active
        </label>
        <p className="text-sm text-gray-500 mt-1">
          Inactive athletes will not appear on public pages.
        </p>
      </section>

      {/* IMAGES */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="font-semibold block mb-2">Headshot</label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) =>
              uploadImage(e.target.files?.[0], "headshotUrl")
            }
          />
          <div className="mt-3 w-40 aspect-square border rounded overflow-hidden bg-gray-100 flex items-center justify-center">
            {form.headshotUrl && (
              <img
                src={form.headshotUrl}
                className="max-w-full max-h-full object-contain"
                alt="Headshot preview"
              />
            )}
          </div>
        </div>

        <div>
          <label className="font-semibold block mb-2">Action Photo</label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) =>
              uploadImage(e.target.files?.[0], "actionPhotoUrl")
            }
          />
          <div className="mt-3 w-full max-w-md aspect-[16/9] border rounded overflow-hidden bg-gray-100 flex items-center justify-center">
            {form.actionPhotoUrl && (
              <img
                src={form.actionPhotoUrl}
                className="max-w-full max-h-full object-contain"
                alt="Action preview"
              />
            )}
          </div>
        </div>
      </section>

      {/* BIO */}
      <section>
        <label className="font-semibold block mb-2">Athlete Bio</label>
        <textarea
          className="w-full min-h-[200px]"
          value={form.bio}
          onChange={(e) => update("bio", e.target.value)}
        />
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
