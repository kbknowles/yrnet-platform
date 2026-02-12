"use client";

import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const TIERS = ["TITLE", "GOLD", "SILVER", "BRONZE", "ATHLETE"];

export default function SponsorForm({ sponsor, onClose, onSaved }) {
  const isEdit = Boolean(sponsor.id);

  const [form, setForm] = useState({
    name: sponsor.name || "",
    tier: sponsor.tier || "BRONZE",
    website: sponsor.website || "",
    description: sponsor.description || "",
    contactName: sponsor.contactName || "",
    contactEmail: sponsor.contactEmail || "",
    contactPhone: sponsor.contactPhone || "",
    startDate: sponsor.startDate
      ? sponsor.startDate.split("T")[0]
      : "",
    endDate: sponsor.endDate
      ? sponsor.endDate.split("T")[0]
      : "",
    active: sponsor.active ?? true,
    internalNotes: sponsor.internalNotes || "",
  });

  const [logoPreview, setLogoPreview] = useState(sponsor.logoUrl || "");
  const [bannerPreview, setBannerPreview] = useState(sponsor.bannerUrl || "");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `${API_BASE}/api/sponsors/${sponsor.id}`
      : `${API_BASE}/api/sponsors`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    onSaved(data);
  }

  async function uploadFile(file, type) {
    if (!sponsor.id) {
      alert("Save sponsor before uploading images.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const endpoint =
      type === "logo"
        ? `${API_BASE}/api/sponsors/${sponsor.id}/upload-logo`
        : `${API_BASE}/api/sponsors/${sponsor.id}/upload-banner`;

    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (type === "logo") setLogoPreview(data.logoUrl);
    if (type === "banner") setBannerPreview(data.bannerUrl);
  }

  function bannerRequirement(tier) {
    switch (tier) {
      case "TITLE":
        return "Required: 1200 × 300";
      case "GOLD":
        return "Required: 1000 × 250";
      case "SILVER":
        return "Required: 800 × 200";
      default:
        return "Banner not required for this tier.";
    }
  }

  return (
    <div className="border rounded p-6 bg-gray-50">
      <h2 className="text-lg font-semibold mb-4">
        {isEdit ? "Edit Sponsor" : "Add Sponsor"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Sponsor Name */}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Sponsor Name"
          className="w-full border p-2 rounded"
          required
        />

        {/* Tier */}
        <div>
          <label className="block mb-1 font-medium">Tier</label>
          <select
            name="tier"
            value={form.tier}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            {TIERS.map((tier) => (
              <option key={tier} value={tier}>
                {tier}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-600 mt-1">
            {bannerRequirement(form.tier)}
          </p>
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block font-medium mb-1">Logo</label>
          <p className="text-sm text-gray-600 mb-2">
            Required. 800 × 800 PNG. Transparent background recommended.
          </p>

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
            onChange={(e) => uploadFile(e.target.files[0], "logo")}
            className="w-full"
          />
        </div>

        {/* Banner Upload */}
        <div>
          <label className="block font-medium mb-1">Banner</label>
          <p className="text-sm text-gray-600 mb-2">
            {bannerRequirement(form.tier)}
          </p>

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
            onChange={(e) => uploadFile(e.target.files[0], "banner")}
            className="w-full"
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

        {/* Contact Info */}
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

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </div>

        {/* Active */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleChange}
          />
          Active
        </label>

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
            className="bg-black text-white px-4 py-2 rounded"
          >
            Save
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
