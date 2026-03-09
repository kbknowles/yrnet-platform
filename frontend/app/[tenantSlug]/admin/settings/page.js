// filepath: frontend/app/[tenantSlug]/admin/settings/page.js

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
    } catch {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [tenantSlug]);

  async function save() {
    if (!tenantSlug) return;

    await fetch(`${API_BASE}/${tenantSlug}/admin/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    alert("Settings updated");
  }

  async function uploadLogo() {
    if (!logoFile || !tenantSlug) return;

    const formData = new FormData();
    formData.append("logo", logoFile);

    const res = await fetch(
      `${API_BASE}/${tenantSlug}/admin/settings/logo`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) return;

    load();
  }

  if (loading) return <div className="p-6">Loading…</div>;
  if (!settings) return <div className="p-6">Unable to load settings.</div>;

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Tenant Settings</h1>

      {/* BASIC INFO */}
      <div className="space-y-4 border rounded p-6">
        <h2 className="font-semibold">Basic Information</h2>

        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            className="border rounded p-2 w-full"
            value={settings.name || ""}
            onChange={(e) =>
              setSettings({ ...settings, name: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Slug</label>
          <input
            className="border rounded p-2 w-full bg-gray-100"
            value={settings.slug || ""}
            disabled
          />
          <p className="text-xs text-gray-500 mt-1">
            Slug cannot be changed after creation.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium">Domain</label>
          <input
            className="border rounded p-2 w-full"
            value={settings.domain || ""}
            onChange={(e) =>
              setSettings({ ...settings, domain: e.target.value })
            }
          />
        </div>
      </div>

      {/* BRANDING */}
      <div className="space-y-4 border rounded p-6">
        <h2 className="font-semibold">Branding</h2>

        <div>
          <label className="block text-sm font-medium">
            Primary Color
          </label>
          <input
            type="color"
            value={settings.primaryColor || "#000000"}
            onChange={(e) =>
              setSettings({ ...settings, primaryColor: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Secondary Color
          </label>
          <input
            type="color"
            value={settings.secondaryColor || "#000000"}
            onChange={(e) =>
              setSettings({ ...settings, secondaryColor: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Accent Color
          </label>
          <input
            type="color"
            value={settings.accentColor || "#000000"}
            onChange={(e) =>
              setSettings({ ...settings, accentColor: e.target.value })
            }
          />
        </div>
      </div>

      {/* LOGO */}
      <div className="space-y-4 border rounded p-6">
        <h2 className="font-semibold">Logo</h2>

        {settings.logoUrl && (
          <img
            src={
              settings.logoUrl.startsWith("http")
                ? settings.logoUrl
                : `${API_BASE}${settings.logoUrl}`
            }
            alt="Logo"
            className="h-16"
          />
        )}

        <input
          type="file"
          onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
        />

        <p className="text-xs text-gray-500">
          Recommended size: 512×512 PNG. This logo will also be used
          for the favicon.
        </p>

        <button
          onClick={uploadLogo}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Upload Logo
        </button>
      </div>

      {/* SAVE */}
      <div className="pt-4">
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