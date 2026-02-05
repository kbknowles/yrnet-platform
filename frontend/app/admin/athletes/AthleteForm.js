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
  isActive: true,
  isFeatured: false,
};

export default function AthleteForm({ athleteId }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  /* ----------------------------
     LOAD ATHLETE (EDIT MODE)
  ----------------------------- */
  useEffect(() => {
    if (!athleteId) return;

    fetch(`${API_BASE}/api/admin/athletes/${athleteId}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          ...EMPTY_FORM,
          ...data,
          events: data.events || [],
        });
      });
  }, [athleteId]);

  /* ----------------------------
     HELPERS
  ----------------------------- */
  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleEvent(event) {
    setForm((f) => ({
      ...f,
      events: f.events.includes(event)
        ? f.events.filter((e) => e !== event)
        : [...f.events, event],
    }));
  }

  async function uploadImage(file, field) {
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    const res = await fetch(`${API_BASE}/api/admin/uploads/image`, {
      method: "POST",
      body: data,
    });

    const result = await res.json();
    update(field, result.url);
  }

  async function save() {
    setSaving(true);

    await fetch(
      `${API_BASE}/api/admin/athletes${athleteId ? `/${athleteId}` : ""}`,
      {
        method: athleteId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    setSaving(false);
  }

  /* ----------------------------
     RENDER
  ----------------------------- */
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        {athleteId ? "Edit Athlete" : "New Athlete"}
      </h1>

      <input
        placeholder="First Name"
        value={form.firstName}
        onChange={(e) => update("firstName", e.target.value)}
      />

      <input
        placeholder="Last Name"
        value={form.lastName}
        onChange={(e) => update("lastName", e.target.value)}
      />

      <input
        placeholder="School"
        value={form.school}
        onChange={(e) => update("school", e.target.value)}
      />

      <input
        placeholder="Grade"
        value={form.grade}
        onChange={(e) => update("grade", e.target.value)}
      />

      <input
        placeholder="Hometown"
        value={form.hometown}
        onChange={(e) => update("hometown", e.target.value)}
      />

      <textarea
        placeholder="Athlete Bio"
        value={form.bio}
        onChange={(e) => update("bio", e.target.value)}
        rows={4}
      />

      {/* EVENTS */}
      <div>
        <label className="font-semibold block mb-2">Events</label>
        <div className="grid grid-cols-2 gap-2">
          {EVENT_OPTIONS.map((e) => (
            <label key={e} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.events.includes(e)}
                onChange={() => toggleEvent(e)}
              />
              {e.replaceAll("_", " ")}
            </label>
          ))}
        </div>
      </div>

      {/* IMAGES */}
      <div>
        <label className="font-semibold block mb-1">Headshot</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => uploadImage(e.target.files[0], "headshotUrl")}
        />
        {form.headshotUrl && (
          <img src={form.headshotUrl} className="h-32 mt-2 object-cover" />
        )}
      </div>

      <div>
        <label className="font-semibold block mb-1">Action Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => uploadImage(e.target.files[0], "actionPhotoUrl")}
        />
        {form.actionPhotoUrl && (
          <img src={form.actionPhotoUrl} className="h-32 mt-2 object-cover" />
        )}
      </div>

      {/* ADMIN FLAGS */}
      <div className="flex gap-6">
        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => update("isActive", e.target.checked)}
          />
          Active
        </label>

        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => update("isFeatured", e.target.checked)}
          />
          Featured
        </label>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="btn-primary"
      >
        {saving ? "Saving..." : "Save Athlete"}
      </button>
    </main>
  );
}
