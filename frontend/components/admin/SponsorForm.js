"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

function resolveImage(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;

  const clean = url.replace(/^\/+/, "");
  return `${API_BASE}/${clean}`;
}

export default function SponsorForm({
  sponsor,
  onSaved,
  onClose,
}) {
  const isEdit = Boolean(sponsor?.id);

  const [form, setForm] = useState({
    name: "",
    website: "",
    description: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    internalNotes: "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  /* ----------------------------
     Load existing sponsor data
  -----------------------------*/
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

      setLogoUrl(sponsor.logoUrl || "");
      setBannerUrl(sponsor.bannerUrl || "");
    }
  }, [sponsor, isEdit]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  /* ----------------------------
     Upload helper
  -----------------------------*/
  async function uploadFile(id, file, type) {
    const formData = new FormData();
    formData.append("file", file);

    const endpoint =
      type === "logo"
        ? `${API_BASE}/${tenantSlug}/admin/sponsors/${id}/upload-logo`
        : `${API_BASE}/${tenantSlug}/admin/sponsors/${id}/upload-banner`;

    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) return;

    const updated = await res.json();

    if (type === "logo") setLogoUrl(updated.logoUrl);
    if (type === "banner") setBannerUrl(updated.bannerUrl);
  }

  /* ----------------------------
     Submit
  -----------------------------*/
  async function handleSubmit(e) {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setError(null);

    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `${API_BASE}/${tenantSlug}/admin/sponsors/${sponsor.id}`
        : `${API_BASE}/${tenantSlug}/admin/sponsors`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("SAVE ERROR:", errText);
        setError("Failed to save sponsor.");
        setSaving(false);
        return;
      }

      const saved = await res.json();

      if (logoFile) await uploadFile(saved.id, logoFile, "logo");
      if (bannerFile) await uploadFile(saved.id, bannerFile, "banner");

      onSaved?.(saved);
    } catch (err) {
      console.error(err);
      setError("Unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-4">
        {isEdit ? "Edit Sponsor" : "Add Sponsor"}
      </h2>

      {error && (
        <div className="mb-4 text-sm text-red-600 border p-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* BASIC INFO */}
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

        {/* IMAGES */}
        <div className="border-t pt-6 grid md:grid-cols-2 gap-6">

          {/* LOGO */}
          <div className="space-y-3">
            <div className="font-medium text-sm">Logo</div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0])}
            />

            {logoUrl && (
              <>
                <div className="text-xs break-all text-gray-600">
                  {resolveImage(logoUrl)}
                </div>
                <img
                  src={resolveImage(logoUrl)}
                  alt="Logo"
                  className="h-20 object-contain border rounded p-2 bg-white"
                />
              </>
            )}
          </div>

          {/* BANNER */}
          <div className="space-y-3">
            <div className="font-medium text-sm">Banner</div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBannerFile(e.target.files?.[0])}
            />

            {bannerUrl && (
              <>
                <div className="text-xs break-all text-gray-600">
                  {resolveImage(bannerUrl)}
                </div>
                <img
                  src={resolveImage(bannerUrl)}
                  alt="Banner"
                  className="h-20 object-contain border rounded p-2 bg-white"
                />
              </>
            )}
          </div>

        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-black text-white px-4 py-2 rounded text-sm"
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