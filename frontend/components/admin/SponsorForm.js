"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export default function SponsorForm({ sponsor, onSaved, onClose }) {
  const isEdit = Boolean(sponsor?.id);

  const emptyForm = {
    name: "",
    website: "",
    description: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    internalNotes: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  /* -------------------------
     LOAD DATA FOR EDIT
  ------------------------- */
  useEffect(() => {
    if (isEdit && sponsor) {
      setForm({
        name: sponsor.name || "",
        website: sponsor.website || "",
        description: sponsor.description || "",
        contactName: sponsor.contactName || "",
        contactEmail: sponsor.contactEmail || "",
        contactPhone: sponsor.contactPhone || "",
        internalNotes: sponsor.internalNotes || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [sponsor]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  /* -------------------------
     SUBMIT
  ------------------------- */
  async function handleSubmit(e) {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setError(null);

    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `${API_BASE}/api/admin/sponsors/${sponsor.id}`
        : `${API_BASE}/api/admin/sponsors`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("SAVE ERROR:", errText);
        setError("Failed to save sponsor.");
        return;
      }

      const data = await res.json();
      onSaved?.(data);
    } catch (err) {
      console.error("Submit error:", err);
      setError("Unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
      <h2 className="text-lg font-semibold mb-4">
        {isEdit ? "Edit Sponsor" : "Add Sponsor"}
      </h2>

      {error && (
        <div className="mb-4 text-sm text-red-600 border border-red-300 p-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="border rounded p-2 text-sm"
            placeholder="Sponsor Name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />
          <input
            className="border rounded p-2 text-sm"
            placeholder="Website"
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <input
            className="border rounded p-2 text-sm"
            placeholder="Contact Name"
            value={form.contactName}
            onChange={(e) => update("contactName", e.target.value)}
          />
          <input
            className="border rounded p-2 text-sm"
            placeholder="Contact Email"
            value={form.contactEmail}
            onChange={(e) => update("contactEmail", e.target.value)}
          />
          <input
            className="border rounded p-2 text-sm"
            placeholder="Contact Phone"
            value={form.contactPhone}
            onChange={(e) => update("contactPhone", e.target.value)}
          />
        </div>

        <textarea
          className="border rounded p-2 text-sm w-full"
          rows={2}
          placeholder="Description"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />

        <textarea
          className="border rounded p-2 text-sm w-full"
          rows={2}
          placeholder="Internal Notes"
          value={form.internalNotes}
          onChange={(e) => update("internalNotes", e.target.value)}
        />

        {/* BUTTONS */}
        <div className="flex gap-3 pt-2">
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
