"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

const LEVELS = ["PREMIER", "FEATURED", "STANDARD", "SUPPORTER"];
const CONTENT_TYPES = [
  "SEASON",
  "EVENT",
  "ATHLETE",
  "LOCATION",
  "GALLERY",
  "ANNOUNCEMENT",
];

export default function SponsorshipForm({
  sponsorship,
  onSaved,
  onClose,
}) {
  const isEdit = Boolean(sponsorship?.id);

  const emptyForm = {
    sponsorId: "",
    level: "STANDARD",
    contentType: "SEASON",
    contentId: "",
    startDate: "",
    endDate: "",
    priority: 0,
    active: true,
  };

  const [form, setForm] = useState(emptyForm);
  const [sponsors, setSponsors] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  /* -------------------------
     LOAD SPONSORS (ADMIN)
  ------------------------- */
  useEffect(() => {
    async function loadSponsors() {
      try {
        const res = await fetch(`${API_BASE}/api/admin/sponsors`);
        if (!res.ok) return;
        const data = await res.json();
        setSponsors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Sponsor load error:", err);
      }
    }

    loadSponsors();
  }, []);

  /* -------------------------
     RESET FORM WHEN EDITING
  ------------------------- */
  useEffect(() => {
    if (isEdit && sponsorship) {
      setForm({
        sponsorId: sponsorship.sponsorId || "",
        level: sponsorship.level || "STANDARD",
        contentType: sponsorship.contentType || "SEASON",
        contentId: sponsorship.contentId || "",
        startDate: sponsorship.startDate
          ? sponsorship.startDate.split("T")[0]
          : "",
        endDate: sponsorship.endDate
          ? sponsorship.endDate.split("T")[0]
          : "",
        priority: sponsorship.priority ?? 0,
        active: sponsorship.active ?? true,
      });
    } else {
      setForm(emptyForm);
    }
  }, [sponsorship]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  /* -------------------------
     SUBMIT (ADMIN ENDPOINT)
  ------------------------- */
  async function handleSubmit(e) {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setError(null);

    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `${API_BASE}/api/admin/sponsorships/${sponsorship.id}`
        : `${API_BASE}/api/admin/sponsorships`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sponsorId: Number(form.sponsorId),
          level: form.level,
          contentType: form.contentType || null,
          contentId: form.contentId
            ? Number(form.contentId)
            : null,
          startDate: form.startDate,
          endDate: form.endDate,
          priority: Number(form.priority),
          active: form.active,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("SAVE ERROR:", errText);
        setError("Failed to save sponsorship.");
        return;
      }

      const data = await res.json();

      if (!isEdit) setForm(emptyForm);

      onSaved?.(data);
    } catch (err) {
      console.error("Submit error:", err);
      setError("Unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  }

  const selectedSponsor = sponsors.find(
    (s) => String(s.id) === String(form.sponsorId)
  );

  function resolveLogo(url) {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${API_BASE}${url}`;
  }

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm max-w-4xl">
      <h2 className="text-lg font-semibold mb-4">
        {isEdit ? "Edit Sponsorship" : "Add Sponsorship"}
      </h2>

      {error && (
        <div className="mb-4 text-sm text-red-600 border border-red-300 p-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

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
            value={form.level}
            onChange={(e) => update("level", e.target.value)}
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          <input
            type="number"
            className="border rounded p-2 text-sm"
            placeholder="Priority"
            value={form.priority}
            onChange={(e) => update("priority", e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <select
            className="border rounded p-2 text-sm"
            value={form.contentType}
            onChange={(e) => update("contentType", e.target.value)}
          >
            {CONTENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <input
            type="number"
            className="border rounded p-2 text-sm"
            placeholder="Content ID (optional)"
            value={form.contentId}
            onChange={(e) => update("contentId", e.target.value)}
          />
        </div>

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

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => update("active", e.target.checked)}
          />
          Active
        </label>

        {selectedSponsor?.logoUrl && (
          <div className="border-t pt-4 space-y-2">
            <div className="text-xs text-gray-600">Preview</div>
            <img
              src={resolveLogo(selectedSponsor.logoUrl)}
              alt="Sponsor Preview"
              className="h-16 object-contain border rounded bg-white p-2"
            />
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-ahsra-blue text-white px-4 py-2 rounded text-sm"
          >
            {saving ? "Saving..." : "Save"}
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
