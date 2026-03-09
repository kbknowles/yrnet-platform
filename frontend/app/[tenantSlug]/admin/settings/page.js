"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function TenantSettingsPage() {
  const params = useParams();

  const tenantSlug = Array.isArray(params?.tenantSlug)
    ? params.tenantSlug[0]
    : params?.tenantSlug;

  const [settings, setSettings] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!tenantSlug) return;

    try {
      const res = await fetch(`${API_BASE}/${tenantSlug}/admin/settings`, {
        cache: "no-store",
      });

      if (!res.ok) return;

      const data = await res.json();

      setSettings(data);

      if (data.logoUrl) {
        const url = data.logoUrl.startsWith("http")
          ? data.logoUrl
          : `${API_BASE}${data.logoUrl}`;

        setLogoPreview(url);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [tenantSlug]);

  function updateField(field, value) {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function save() {
    await fetch(`${API_BASE}/${tenantSlug}/admin/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    alert("Settings saved");
  }

  async function uploadLogo() {
    if (!logoFile) return;

    const formData = new FormData();
    formData.append("logo", logoFile);

    const res = await fetch(
      `${API_BASE}/${tenantSlug}/admin/settings/logo`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      alert("Upload failed");
      return;
    }

    const data = await res.json();

    if (data.logoUrl) {
      const url = data.logoUrl.startsWith("http")
        ? data.logoUrl
        : `${API_BASE}${data.logoUrl}`;

      setLogoPreview(url);

      setSettings((prev) => ({
        ...prev,
        logoUrl: data.logoUrl,
      }));
    }

    setLogoFile(null);
  }

  if (loading) return <div className="p-6">Loading…</div>;
  if (!settings) return <div className="p-6">Unable to load settings.</div>;

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Tenant Settings</h1>

      {/* BASIC */}
      <div className="space-y-4 border rounded p-6">
        <h2 className="font-semibold">Basic Information</h2>

        <div>
          <label className="text-sm font-medium">Name</label>
          <input
            className="border rounded p-2 w-full"
            value={settings.name || ""}
            onChange={(e) => updateField("name", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Slug</label>
          <input
            className="border rounded p-2 w-full bg-gray-100"
            value={settings.slug || ""}
            disabled
          />
        </div>

        <div>
          <label className="text-sm font-medium">Domain</label>
          <input
            className="border rounded p-2 w-full"
            value={settings.domain || ""}
            onChange={(e) => updateField("domain", e.target.value)}
          />
        </div>
      </div>

      {/* COLORS */}
      <div className="space-y-4 border rounded p-6">
        <h2 className="font-semibold">Colors</h2>

        <ColorRow
          label="Primary"
          value={settings.primaryColor}
          onChange={(v) => updateField("primaryColor", v)}
        />

        <ColorRow
          label="Secondary"
          value={settings.secondaryColor}
          onChange={(v) => updateField("secondaryColor", v)}
        />

        <ColorRow
          label="Accent"
          value={settings.accentColor}
          onChange={(v) => updateField("accentColor", v)}
        />
      </div>

      {/* LOGO */}
      <div className="space-y-4 border rounded p-6">
        <h2 className="font-semibold">Logo</h2>

        {logoPreview && (
          <img
            src={logoPreview}
            alt="Logo preview"
            className="h-20 object-contain"
          />
        )}

        <input
          type="file"
          onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
        />

        <p className="text-xs text-gray-500">
          Recommended size: 512×512 PNG
        </p>

        <button
          onClick={uploadLogo}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Upload Logo
        </button>
      </div>

      <div>
        <button
          onClick={save}
          className="bg-primary text-white px-6 py-2 rounded"
        >
          Save Settings
        </button>
      </div>
    </main>
  );
}

function ColorRow({ label, value, onChange }) {
  const color = value || "#000000";

  return (
    <div className="flex items-center gap-4">
      <label className="w-28 text-sm">{label}</label>

      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
      />

      <input
        className="border rounded p-1 text-sm w-28"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
      />
    </div>
  );
}