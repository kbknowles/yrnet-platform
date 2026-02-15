"use client";

import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export default function SponsorForm({ onCreated }) {
  const [form, setForm] = useState({
    name: "",
    website: "",
    description: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    internalNotes: "",
  });

  const [sponsorId, setSponsorId] = useState(null);

  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`${API_BASE}/api/sponsors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Create failed");

      const created = await res.json();
      setSponsorId(created.id);

      if (logoFile) await uploadFile(created.id, logoFile, "logo");
      if (bannerFile) await uploadFile(created.id, bannerFile, "banner");

      onCreated?.(created);
    } catch (err) {
      console.error("Sponsor create error:", err);
    } finally {
      setSaving(false);
    }
  }

  async function uploadFile(id, file, type) {
    const formData = new FormData();
    formData.append("file", file);

    const endpoint =
      type === "logo"
        ? `${API_BASE}/api/sponsors/${id}/upload-logo`
        : `${API_BASE}/api/sponsors/${id}/upload-banner`;

    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) return;

    const updated = await res.json();

    if (type === "logo") setLogoUrl(updated.logoUrl);
    if (type === "banner") setBannerUrl(updated.bannerUrl);
  }

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm max-w-5xl">
      <h2 className="text-lg font-semibold mb-4">Add Sponsor</h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Basic Info */}
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
          placeholder="Short Description"
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

        {/* Images Section — Bottom Row */}
        <div className="border-t pt-6">
          <div className="grid md:grid-cols-2 gap-6">

            {/* LOGO */}
            <div className="space-y-3">
              <div className="text-sm font-semibold">Logo</div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0])}
                className="text-sm"
              />

              {logoFile && (
                <img
                  src={URL.createObjectURL(logoFile)}
                  alt="Logo Preview"
                  className="h-20 object-contain border rounded bg-white p-2"
                />
              )}

              {logoUrl && (
                <>
                  <div className="text-xs text-gray-600 break-all">
                    {API_BASE}{logoUrl}
                  </div>
                  <img
                    src={`${API_BASE}${logoUrl}`}
                    alt="Saved Logo"
                    className="h-20 object-contain border rounded bg-white p-2"
                  />
                </>
              )}
            </div>

            {/* BANNER */}
            <div className="space-y-3">
              <div className="text-sm font-semibold">Banner</div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBannerFile(e.target.files?.[0])}
                className="text-sm"
              />

              {bannerFile && (
                <img
                  src={URL.createObjectURL(bannerFile)}
                  alt="Banner Preview"
                  className="h-20 object-contain border rounded bg-white p-2"
                />
              )}

              {bannerUrl && (
                <>
                  <div className="text-xs text-gray-600 break-all">
                    {API_BASE}{bannerUrl}
                  </div>
                  <img
                    src={`${API_BASE}${bannerUrl}`}
                    alt="Saved Banner"
                    className="h-20 object-contain border rounded bg-white p-2"
                  />
                </>
              )}
            </div>

          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-ahsra-blue text-white px-5 py-2 rounded text-sm"
        >
          {saving ? "Saving..." : "Create Sponsor"}
        </button>
      </form>
    </div>
  );
}
