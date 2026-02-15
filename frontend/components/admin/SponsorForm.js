"use client";

import { useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Sponsor = Vendor Record Only
 * No tier, no dates, no active flag
 * Sponsorship logic handled separately
 */
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

  const [logoFile, setLogoFile] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    // 1️⃣ Create sponsor (vendor only)
    const res = await fetch(`${API_BASE}/api/sponsors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const created = await res.json();

    // 2️⃣ Upload logo if selected (requires sponsor ID)
    if (logoFile && created?.id) {
      const formData = new FormData();
      formData.append("file", logoFile);

      await fetch(
        `${API_BASE}/api/sponsors/${created.id}/upload-logo`,
        {
          method: "POST",
          body: formData,
        }
      );
    }

    // Reset form
    setForm({
      name: "",
      website: "",
      description: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      internalNotes: "",
    });

    setLogoFile(null);

    onCreated?.(created);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 max-w-xl">

      {/* Sponsor Name */}
      <input
        className="border rounded p-2"
        placeholder="Sponsor Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
        required
      />

      {/* Website */}
      <input
        className="border rounded p-2"
        placeholder="Website"
        value={form.website}
        onChange={(e) =>
          setForm({ ...form, website: e.target.value })
        }
      />

      {/* Description */}
      <textarea
        className="border rounded p-2"
        placeholder="Short Description"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      {/* Contact Info */}
      <input
        className="border rounded p-2"
        placeholder="Contact Name"
        value={form.contactName}
        onChange={(e) =>
          setForm({ ...form, contactName: e.target.value })
        }
      />

      <input
        className="border rounded p-2"
        placeholder="Contact Email"
        value={form.contactEmail}
        onChange={(e) =>
          setForm({ ...form, contactEmail: e.target.value })
        }
      />

      <input
        className="border rounded p-2"
        placeholder="Contact Phone"
        value={form.contactPhone}
        onChange={(e) =>
          setForm({ ...form, contactPhone: e.target.value })
        }
      />

      {/* Internal Notes (Admin Only) */}
      <textarea
        className="border rounded p-2"
        placeholder="Internal Notes"
        value={form.internalNotes}
        onChange={(e) =>
          setForm({ ...form, internalNotes: e.target.value })
        }
      />

      {/* Logo Upload */}
      <div>
        <label className="block text-sm mb-1">
          Logo (800x800 PNG recommended)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogoFile(e.target.files[0])}
        />
      </div>

      <button className="bg-ahsra-blue text-white rounded px-4 py-2">
        Add Sponsor
      </button>
    </form>
  );
}
