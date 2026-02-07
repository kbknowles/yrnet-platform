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
  seasonId: null,
  standings: null,
  awards: null,
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

      if (res.ok) {
        const data = await res.json();
        setForm({
          ...EMPTY_FORM,
          ...data,
          sponsors: data.sponsors || [],
          events: data.events || [],
        });
      }

      setLoading(false);
    }

    loadAthlete();
  }, [slug, mode]);

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

    setSaving(false);

    if (res.ok) {
      window.location.href = "/admin/athletes";
    }
  }

  if (loading) {
    return <p className="p-6">Loading athlete…</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-7xl mx-auto px-4 py-6 space-y-10"
    >
      {/* BASIC INFO */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </section>

      {/* BIO */}
      <section>
        <label className="font-semibold block mb-2">Athlete Bio</label>
        <textarea
          className="w-full min-h-[260px]"
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

      {/* FUTURE GOALS */}
      <section>
        <label className="font-semibold block mb-2">Future Goals</label>
        <textarea
          className="w-full min-h-[180px]"
          value={form.futureGoals}
          onChange={(e) => update("futureGoals", e.target.value)}
        />
      </section>

      {/* SPONSORS */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <label className="font-semibold">Sponsors</label>
          <button
            type="button"
            onClick={() =>
              update("sponsors", [
                ...form.sponsors,
                { name: "", logoUrl: "", link: "" },
              ])
            }
            className="text-sm underline"
          >
            + Add Sponsor
          </button>
        </div>

        {form.sponsors.length === 0 && (
          <p className="text-sm text-gray-500">No sponsors added.</p>
        )}

        <div className="space-y-4">
          {form.sponsors.map((sponsor, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center"
            >
              <input
                placeholder="Sponsor Name"
                value={sponsor.name}
                onChange={(e) => {
                  const sponsors = [...form.sponsors];
                  sponsors[index] = {
                    ...sponsors[index],
                    name: e.target.value,
                  };
                  update("sponsors", sponsors);
                }}
              />

              <input
                placeholder="Website URL"
                value={sponsor.link}
                onChange={(e) => {
                  const sponsors = [...form.sponsors];
                  sponsors[index] = {
                    ...sponsors[index],
                    link: e.target.value,
                  };
                  update("sponsors", sponsors);
                }}
              />

              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const data = new FormData();
                  data.append("file", file);

                  const res = await fetch(
                    `${API_BASE}/api/admin/uploads/image`,
                    { method: "POST", body: data }
                  );

                  const result = await res.json();

                  const sponsors = [...form.sponsors];
                  sponsors[index] = {
                    ...sponsors[index],
                    logoUrl: result.url,
                  };
                  update("sponsors", sponsors);
                }}
              />

              <button
                type="button"
                onClick={() =>
                  update(
                    "sponsors",
                    form.sponsors.filter((_, i) => i !== index)
                  )
                }
                className="text-sm text-red-600"
              >
                Remove
              </button>

              {sponsor.logoUrl && (
                <img
                  src={sponsor.logoUrl}
                  className="h-16 col-span-full object-contain"
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ACTIONS */}
      <div className="pt-6">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-black text-white"
        >
          {saving ? "Saving…" : "Save Athlete"}
        </button>
      </div>
    </form>
  );
}
