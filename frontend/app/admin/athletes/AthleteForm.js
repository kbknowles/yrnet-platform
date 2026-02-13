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
  futureGoals: "",
  sponsors: [],
  socialLinks: [],
  isActive: true,
  isFeatured: false,
  sortOrder: 0,
};

export default function AthleteForm({ slug, mode = "create" }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [headshotFile, setHeadshotFile] = useState(null);
  const [actionFile, setActionFile] = useState(null);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  useEffect(() => {
    if (mode !== "edit" || !slug) return;

    async function loadAthlete() {
      const res = await fetch(
        `${API_BASE}/api/admin/athletes/${slug}`,
        { cache: "no-store" }
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
        isActive: data.isActive ?? true,
      });

      setLoading(false);
    }

    loadAthlete();
  }, [mode, slug]);

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

    if (headshotFile) {
      formData.append("headshot", headshotFile);
    }

    if (actionFile) {
      formData.append("actionPhoto", actionFile);
    }

    const res = await fetch(
      `${API_BASE}/api/admin/athletes${mode === "edit" ? `/${slug}` : ""}`,
      {
        method: mode === "edit" ? "PUT" : "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error(err);
      alert("Save failed");
      setSaving(false);
      return;
    }

    window.location.href = "/admin/athletes";
  }

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-10 p-6 max-w-6xl mx-auto">

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

      <section>
        <label className="flex items-center gap-2 font-semibold">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => update("isActive", e.target.checked)}
          />
          Athlete is Active
        </label>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="font-semibold block mb-2">Headshot</label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => setHeadshotFile(e.target.files?.[0])}
          />
        </div>

        <div>
          <label className="font-semibold block mb-2">Action Photo</label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => setActionFile(e.target.files?.[0])}
          />
        </div>
      </section>

      <section>
        <label className="font-semibold block mb-2">Athlete Bio</label>
        <textarea
          className="w-full min-h-[200px]"
          value={form.bio}
          onChange={(e) => update("bio", e.target.value)}
        />
      </section>

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
