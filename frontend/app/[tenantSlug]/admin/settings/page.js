// filepath: frontend/app/[tenantSlug]/admin/settings/page.js

"use client";

/*
  Tenant Settings Page
  -------------------------------------------------------
  Allows tenant administrators to manage:

  - Basic tenant info
  - Brand colors
  - Logo upload
  - Hero section configuration
  - Hero image upload

  Images are stored on the Render disk at:

  /uploads/tenants/{tenantSlug}/images/{filename}

  Only the filename is stored in the database.
*/

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { resolveTenantMedia } from "lib/media";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function TenantSettingsPage() {
  const params = useParams();

  const tenantSlug = Array.isArray(params?.tenantSlug)
    ? params.tenantSlug[0]
    : params?.tenantSlug;

  const [settings, setSettings] = useState(null);

  const [logoFile, setLogoFile] = useState(null);
  const [heroFile, setHeroFile] = useState(null);

  const [logoPreview, setLogoPreview] = useState(null);
  const [heroPreview, setHeroPreview] = useState(null);

  const [loading, setLoading] = useState(true);

  /* ---------------- */
  /* LOAD SETTINGS */
  /* ---------------- */

  async function load() {
    if (!tenantSlug) return;

    try {
      const res = await fetch(`${API_BASE}/${tenantSlug}/admin/settings`, {
        cache: "no-store",
      });

      if (!res.ok) return;

      const data = await res.json();

      setSettings(data);

      /* Logo preview */

      if (data.logoUrl) {
        const url = resolveTenantMedia({
          tenantSlug,
          folder: "images",
          filename: data.logoUrl,
        });

        setLogoPreview(url);
      }

      /* Hero preview */

      if (data.heroImageUrl) {
        const url = resolveTenantMedia({
          tenantSlug,
          folder: "images",
          filename: data.heroImageUrl,
        });

        setHeroPreview(url);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [tenantSlug]);

  /* ---------------- */
  /* UPDATE FORM FIELD */
  /* ---------------- */

  function updateField(field, value) {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  /* ---------------- */
  /* SAVE SETTINGS */
  /* ---------------- */

  async function save() {
    await fetch(`${API_BASE}/${tenantSlug}/admin/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    alert("Settings saved");
  }

  /* ---------------- */
  /* LOGO UPLOAD */
  /* ---------------- */

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
      const url = resolveTenantMedia({
        tenantSlug,
        folder: "images",
        filename: data.logoUrl,
      });

      setLogoPreview(url);

      setSettings((prev) => ({
        ...prev,
        logoUrl: data.logoUrl,
      }));
    }

    setLogoFile(null);
  }

  /* ---------------- */
  /* HERO IMAGE UPLOAD */
  /* ---------------- */

  async function uploadHero() {
    if (!heroFile) return;

    const formData = new FormData();
    formData.append("hero", heroFile);

    const res = await fetch(
      `${API_BASE}/${tenantSlug}/admin/settings/hero`,
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

    if (data.heroImageUrl) {
      const url = resolveTenantMedia({
        tenantSlug,
        folder: "images",
        filename: data.heroImageUrl,
      });

      setHeroPreview(url);

      setSettings((prev) => ({
        ...prev,
        heroImageUrl: data.heroImageUrl,
      }));
    }

    setHeroFile(null);
  }

  /* ---------------- */

  if (loading) return <div className="p-6">Loading…</div>;
  if (!settings) return <div className="p-6">Unable to load settings.</div>;

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Tenant Settings</h1>

      {/* ---------------- */}
      {/* BASIC INFO */}
      {/* ---------------- */}

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

      {/* ---------------- */}
      {/* COLORS */}
      {/* ---------------- */}

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

      {/* ---------------- */}
      {/* HERO SETTINGS */}
      {/* ---------------- */}

      <div className="space-y-4 border rounded p-6">
        <h2 className="font-semibold">Hero Section</h2>

        {heroPreview && (
          <img
            src={heroPreview}
            alt="Hero preview"
            className="w-full max-h-60 object-cover rounded"
          />
        )}

        <input
          type="file"
          onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={uploadHero}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Upload Hero Image
        </button>

        <div>
          <label className="text-sm font-medium">Hero Title</label>

          <input
            className="border rounded p-2 w-full"
            value={settings.heroTitle || ""}
            onChange={(e) => updateField("heroTitle", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Hero Subtitle</label>

          <input
            className="border rounded p-2 w-full"
            value={settings.heroSubtitle || ""}
            onChange={(e) => updateField("heroSubtitle", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">CTA Text</label>

          <input
            className="border rounded p-2 w-full"
            value={settings.heroCtaText || ""}
            onChange={(e) => updateField("heroCtaText", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">CTA Link</label>

          <input
            className="border rounded p-2 w-full"
            value={settings.heroCtaLink || ""}
            onChange={(e) => updateField("heroCtaLink", e.target.value)}
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.heroEnabled ?? true}
            onChange={(e) => updateField("heroEnabled", e.target.checked)}
          />
          Enable Hero
        </label>
      </div>

      {/* ---------------- */}
      {/* LOGO */}
      {/* ---------------- */}

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

        <button
          onClick={uploadLogo}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Upload Logo
        </button>
      </div>

      {/* ---------------- */}

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

/* ---------------- */
/* COLOR ROW */
/* ---------------- */

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