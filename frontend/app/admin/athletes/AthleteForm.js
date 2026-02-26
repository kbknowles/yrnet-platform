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
  const [videoFiles, setVideoFiles] = useState([]);

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

      const sponsorRes = await fetch(`${API_BASE}/api/sponsors`);
      const sponsorData = await sponsorRes.json();
      setActiveSponsors(sponsorData);

      setLoading(false);
    }

    loadData();
  }, [mode, slug]);

  async function attachSponsor() {
    const sponsorId = parseInt(selectedSponsor, 10);
    if (!sponsorId || isNaN(sponsorId)) return;

    if (linkedSponsors.length >= 4) return;

    const res = await fetch(
      `${API_BASE}/api/sponsors/${sponsorId}/attach-athlete/${form.id}`,
      { method: "POST" }
    );

    if (!res.ok) {
      alert("Attach failed");
      return;
    }

    const sponsor = activeSponsors.find((s) => s.id === sponsorId);
    setLinkedSponsors((prev) => [
      ...prev,
      { sponsorId: sponsor.id, sponsor },
    ]);

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
    <form onSubmit={handleSubmit} className="space-y-8 p-6 max-w-6xl mx-auto">

      {/* Basic Info */}
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

      {/* Media */}
      <section className="space-y-6">

        <div>
          <label className="font-semibold block mb-2">Headshot</label>
          {form.headshotUrl && (
            <img
              src={resolveImage(form.headshotUrl)}
              className="max-h-40 mb-3 object-contain border rounded"
            />
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setHeadshotFile(e.target.files?.[0])}
          />
        </div>

        <div>
          <label className="font-semibold block mb-2">
            Action Photos (Max 4)
          </label>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setActionFiles([...e.target.files])}
          />
        </div>

        <div>
          <label className="font-semibold block mb-2">
            Videos (Max 4)
          </label>
          <input
            type="file"
            multiple
            accept="video/mp4,video/quicktime,video/webm"
            onChange={(e) => setVideoFiles([...e.target.files])}
          />
        </div>

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