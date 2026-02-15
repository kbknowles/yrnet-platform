"use client";

import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Sponsor = Vendor Record Only
 * NO tier
 * NO dates
 * NO active flag
 * Sponsorship placement handled separately
 */
export default function SponsorForm({
  sponsor = {},
  onClose,
  onSaved,
}) {
  const isEdit = Boolean(sponsor?.id);

  const [sponsorId, setSponsorId] = useState(sponsor?.id || null);

  const [form, setForm] = useState({
    name: "",
    website: "",
    description: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    internalNotes: "",
  });

  const [logoPreview, setLogoPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Load sponsor into form when editing
  useEffect(() => {
    if (!sponsor) return;

    setForm({
      name: sponsor.name || "",
      website: sponsor.website || "",
      description: sponsor.description || "",
      contactName: sponsor.contactName || "",
      contactEmail: sponsor.contactEmail || "",
      contactPhone: sponsor.contactPhone || "",
      internalNotes: sponsor.internalNotes || "",
    });

    setLogoPreview(sponsor.logoUrl || "");
    setBannerPreview(sponsor.bannerUrl || "");
    setSponsorId(sponsor.id || null);
  }, [sponsor]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const method = sponsorId ? "PUT" : "POST";
      const url = sponsorId
        ? `${API_BASE}/api/sponsors/${sponsorId}`
        : `${API_BASE}/api/sponsors`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Save failed");
      }

      const data = await res.json();

      // ensure we store ID if newly created
      if (!sponsorId && data?.id) {
        setSponsorId(data.id);
      }

      onSaved?.(data);
      onClose?.();
    } catch (err) {
      console.error("Sponsor save error:", err);
      setError("Unable to save sponsor.");
    } finally {
      setSaving(false);
    }
  }

  async function uploadFile(file, type) {
    if (!file) return;

    if (!sponsorId) {
      alert("Save sponsor before uploading images.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const endpoint =
      type === "logo"
        ? `${API_BASE}/api/sponsors/${sponsorId}/upload-logo`
        : `${API_BASE}/api/sponsors/${sponsorId}/upload-banner`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();

      if (type === "logo") setLogoPreview(data.logoUrl);
      if (type === "banner") setBannerPreview(data.bannerUrl);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed.");
    }
  }

  return (
    <div className="border rounded p-6 bg-gray-50">
      <h2 className="text-lg font-semibold mb-4">
        {isEdit ? "Edit Sponsor" : "Add Sponsor"}
      </h2>

      {error && (
        <div className="mb-4 p-3 border rounded text-red-600 bg-white">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Name */}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Sponsor Name"
          className="w-full border p-2 rounded"
          required
        />

        {/* Logo */}
        <div>
          <label className="block font-medium mb-1">Logo</label>

          {logoPreview && (
            <img
              src={logoPreview}
              alt="Logo Preview"
              className="h-24 mb-2 object-contain"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => uploadFile(e.target.files?.[0], "logo")}
          />
        </div>

        {/* Banner */}
        <div>
          <label className="block font-medium mb-1">Banner</label>

          {bannerPreview && (
            <img
              src={bannerPreview}
              alt="Banner Preview"
              className="h-24 mb-2 object-contain"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => uploadFile(e.target.files?.[0], "banner")}
          />
        </div>

        {/* Website */}
        <input
          name="website"
          value={form.website}
          onChange={handleChange}
          placeholder="Website"
          className="w-full border p-2 rounded"
        />

        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Short Description"
          className="w-full border p-2 rounded"
        />

        {/* Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="contactName"
            value={form.contactName}
            onChange={handleChange}
            placeholder="Contact Name"
            className="border p-2 rounded"
          />
          <input
            name="contactEmail"
            value={form.contactEmail}
            onChange={handleChange}
            placeholder="Contact Email"
            className="border p-2 rounded"
          />
          <input
            name="contactPhone"
            value={form.contactPhone}
            onChange={handleChange}
            placeholder="Contact Phone"
            className="border p-2 rounded"
          />
        </div>

        {/* Internal Notes */}
        <textarea
          name="internalNotes"
          value={form.internalNotes}
          onChange={handleChange}
          placeholder="Internal Notes"
          className="w-full border p-2 rounded"
        />

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
