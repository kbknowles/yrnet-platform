"use client";

import { useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "";

export default function SponsorForm({ onCreated }) {
  const [form, setForm] = useState({
    name: "",
    website: "",
    tier: "BRONZE",
    startDate: "",
    endDate: "",
    active: true,
  });

  const [logoFile, setLogoFile] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    // 1️⃣ Create sponsor first
    const res = await fetch(`${API_BASE}/api/sponsors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const created = await res.json();

    // 2️⃣ Upload logo if selected
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
      tier: "BRONZE",
      startDate: "",
      endDate: "",
      active: true,
    });
    setLogoFile(null);

    onCreated?.(created);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 max-w-xl">

      <input
        className="border rounded p-2"
        placeholder="Sponsor Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
        required
      />

      <select
        className="border rounded p-2"
        value={form.tier}
        onChange={(e) =>
          setForm({ ...form, tier: e.target.value })
        }
      >
        <option value="TITLE">TITLE</option>
        <option value="GOLD">GOLD</option>
        <option value="SILVER">SILVER</option>
        <option value="BRONZE">BRONZE</option>
        <option value="ATHLETE">ATHLETE</option>
      </select>

      <input
        type="date"
        className="border rounded p-2"
        value={form.startDate}
        onChange={(e) =>
          setForm({ ...form, startDate: e.target.value })
        }
        required
      />

      <input
        type="date"
        className="border rounded p-2"
        value={form.endDate}
        onChange={(e) =>
          setForm({ ...form, endDate: e.target.value })
        }
        required
      />

      <input
        className="border rounded p-2"
        placeholder="Website"
        value={form.website}
        onChange={(e) =>
          setForm({ ...form, website: e.target.value })
        }
      />

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

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) =>
            setForm({ ...form, active: e.target.checked })
          }
        />
        Active
      </label>

      <button className="bg-ahsra-blue text-white rounded px-4 py-2">
        Add Sponsor
      </button>
    </form>
  );
}
