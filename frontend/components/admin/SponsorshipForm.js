"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

const ZONES = [
  "HOME_HERO",
  "HOME_STRIP",
  "SEASON",
  "EVENT",
  "ATHLETE",
  "LOCATION",
];

const LEVELS = ["PREMIER", "FEATURED", "STANDARD"];

export default function SponsorshipForm({ sponsorship, onSaved, onClose }) {
  const isEdit = Boolean(sponsorship?.id);

  const [sponsors, setSponsors] = useState([]);
  const [form, setForm] = useState({
    sponsorId: sponsorship?.sponsorId || "",
    zone: sponsorship?.zone || "HOME_STRIP",
    level: sponsorship?.level || "STANDARD",
    contentType: sponsorship?.contentType || "SEASON",
    contentId: sponsorship?.contentId || "",
    startDate: sponsorship?.startDate?.split("T")[0] || "",
    endDate: sponsorship?.endDate?.split("T")[0] || "",
    active: sponsorship?.active ?? true,
  });

  useEffect(() => {
    loadSponsors();
  }, []);

  async function loadSponsors() {
    const res = await fetch(`${API_BASE}/api/sponsors`);
    const data = await res.json();
    setSponsors(Array.isArray(data) ? data : []);
  }

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `${API_BASE}/api/sponsorships/${sponsorship.id}`
      : `${API_BASE}/api/sponsorships`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        sponsorId: Number(form.sponsorId),
        contentId: form.contentId ? Number(form.contentId) : null,
      }),
    });

    const data = await res.json();
    onSaved?.(data);
  }

  const selectedSponsor = sponsors.find(
    (s) => s.id === Number(form.sponsorId)
  );

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm max-w-4xl">
      <h2 className="text-lg font-semibold mb-4">
        {isEdit ? "Edit Sponsorship" : "Add Sponsorship"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Row 1 */}
        <div className="grid md:grid-cols-3 gap-4">
          <select
            className="border rounded p-2 text-sm"
            value={form.sponsorId}
            onChange={(e) => update("sponsorId", e.target.value)}
            required
          >
            <option value="">Select Sponsor</option>
            {sponsors.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            className="border rounded p-2 text-sm"
            value={form.zone}
            onChange={(e) => update("zone", e.target.value)}
          >
            {ZONES.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>

          <select
            className="border rounded p-2 text-sm"
            value={form.level}
            onChange={(e) => update("level", e.target.value)}
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {/* Row 2 */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="border rounded p-2 text-sm"
            placeholder="Content Type (SEASON, EVENT, etc)"
            value={form.contentType}
            onChange={(e) => update("contentType", e.target.value)}
          />

          <input
            className="border rounded p-2 text-sm"
            placeholder="Content ID (optional)"
            value={form.contentId}
            onChange={(e) => update("contentId", e.target.value)}
          />
        </div>

        {/* Dates */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="date"
            className="border rounded p-2 text-sm"
            value={form.startDate}
            onChange={(e) => update("startDate", e.target.value)}
            required
          />
          <input
            type="date"
            className="border rounded p-2 text-sm"
            value={form.endDate}
            onChange={(e) => update("endDate", e.target.value)}
            required
          />
        </div>

        {/* Active */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => update("active", e.target.checked)}
          />
          Active
        </label>

        {/* Preview */}
        {selectedSponsor?.logoUrl && (
          <div className="border-t pt-4 space-y-2">
            <div className="text-xs text-gray-600">
              Preview
            </div>
            <img
              src={`${API_BASE}${selectedSponsor.logoUrl}`}
              alt="Sponsor Preview"
              className="h-16 object-contain border rounded bg-white p-2"
            />
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-ahsra-blue text-white px-4 py-2 rounded text-sm"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="border px-4 py-2 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
