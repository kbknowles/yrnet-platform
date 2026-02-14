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
  socialLinks: [],
  isActive: true,
  isFeatured: false,
  sortOrder: 0,
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
  const [actionFile, setActionFile] = useState(null);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  const [activeSponsors, setActiveSponsors] = useState([]);
  const [linkedSponsors, setLinkedSponsors] = useState([]);
  const [selectedSponsor, setSelectedSponsor] = useState("");

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
          isActive: data.isActive ?? true,
        });

        setLinkedSponsors(data.athleteSponsors || []);

        const sponsorRes = await fetch(
          `${API_BASE}/api/sponsors/active`
        );
        const sponsorData = await sponsorRes.json();
        setActiveSponsors(sponsorData);

        setLoading(false);
      } catch {
        alert("Failed to load athlete");
      }
    }

    loadData();
  }, [mode, slug]);

  async function attachSponsor() {
    if (!selectedSponsor || linkedSponsors.length >= 4) return;

    await fetch(
      `${API_BASE}/api/sponsors/${selectedSponsor}/attach-athlete/${form.id}`,
      { method: "POST" }
    );

    const updated = await fetch(
      `${API_BASE}/api/admin/athletes/${slug}`
    );
    const updatedData = await updated.json();
    setLinkedSponsors(updatedData.athleteSponsors || []);
    setSelectedSponsor("");
  }

  async function removeSponsor(sponsorId) {
    await fetch(
      `${API_BASE}/api/sponsors/${sponsorId}/remove-athlete/${form.id}`,
      { method: "DELETE" }
    );

    setLinkedSponsors((prev) =>
      prev.filter((s) => s.sponsorId !== sponsorId)
    );
  }

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
      if (actionFile) formData.append("actionPhoto", actionFile);

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

      {/* Core Fields (unchanged) */}
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

      {/* Sponsor Section */}
      {mode === "edit" && (
        <section className="border-t pt-8">
          <h2 className="text-xl font-semibold mb-4">
            Athlete Sponsors (Max 4)
          </h2>

          {linkedSponsors.length < 4 && (
            <div className="flex gap-4 mb-6">
              <select
                value={selectedSponsor}
                onChange={(e) => setSelectedSponsor(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="">Select Sponsor</option>
                {activeSponsors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={attachSponsor}
                className="bg-black text-white px-4 py-2"
              >
                Attach
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {linkedSponsors.map((link) => (
              <div key={link.sponsor.id}
                className="border p-3 rounded text-center space-y-2">
                {link.sponsor.logoUrl && (
                  <img
                    src={resolveImage(link.sponsor.logoUrl)}
                    className="max-h-16 mx-auto object-contain"
                  />
                )}
                <div className="text-sm font-medium">
                  {link.sponsor.name}
                </div>
                <button
                  type="button"
                  onClick={() => removeSponsor(link.sponsorId)}
                  className="text-xs text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bio */}
      <section>
        <label className="font-semibold block mb-2">Athlete Bio</label>
        <textarea className="w-full min-h-[200px]"
          value={form.bio}
          onChange={(e) => update("bio", e.target.value)} />
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
