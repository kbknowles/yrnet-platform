// filepath: frontend/app/[tenantSlug]/admin/settings/page.js

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { resolveTenantMedia } from "lib/media";
import authFetch from "../../../../utils/authFetch";

export default function TenantSettingsPage() {
  const params = useParams();
  const router = useRouter();

  const tenantSlug = Array.isArray(params?.tenantSlug)
    ? params.tenantSlug[0]
    : params?.tenantSlug;

  const [authorized, setAuthorized] = useState(false);
  const [settings, setSettings] = useState(null);

  const [logoFile, setLogoFile] = useState(null);
  const [heroFile, setHeroFile] = useState(null);

  const [logoPreview, setLogoPreview] = useState(null);
  const [heroPreview, setHeroPreview] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      router.push(`/${tenantSlug || ""}`);
      return;
    }
    setAuthorized(true);
  }, [tenantSlug, router]);

  async function load() {
    if (!tenantSlug) return;

    try {
      const res = await authFetch(
        `/${tenantSlug}/admin/settings`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        router.push(`/${tenantSlug}`);
        return;
      }

      const data = await res.json();

      setSettings(data);

      if (data.logoUrl) {
        setLogoPreview(
          resolveTenantMedia({
            tenantSlug,
            folder: "images",
            filename: data.logoUrl,
          })
        );
      }

      if (data.heroImageUrl) {
        setHeroPreview(
          resolveTenantMedia({
            tenantSlug,
            folder: "images",
            filename: data.heroImageUrl,
          })
        );
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authorized) load();
  }, [tenantSlug, authorized]);

  function updateField(field, value) {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function save() {
    await authFetch(`/${tenantSlug}/admin/settings`, {
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

    const res = await authFetch(
      `/${tenantSlug}/admin/settings/logo`,
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
      setLogoPreview(
        resolveTenantMedia({
          tenantSlug,
          folder: "images",
          filename: data.logoUrl,
        })
      );

      setSettings((prev) => ({
        ...prev,
        logoUrl: data.logoUrl,
      }));
    }

    setLogoFile(null);
  }

  async function uploadHero() {
    if (!heroFile) return;

    const formData = new FormData();
    formData.append("hero", heroFile);

    const res = await authFetch(
      `/${tenantSlug}/admin/settings/hero`,
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
      setHeroPreview(
        resolveTenantMedia({
          tenantSlug,
          folder: "images",
          filename: data.heroImageUrl,
        })
      );

      setSettings((prev) => ({
        ...prev,
        heroImageUrl: data.heroImageUrl,
      }));
    }

    setHeroFile(null);
  }

  if (!authorized) return null;
  if (loading) return <div className="p-6">Loading…</div>;
  if (!settings) return <div className="p-6">Unable to load settings.</div>;

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Tenant Settings</h1>

      <div className="space-y-4 border rounded p-6">
        <h2 className="font-semibold">Basic Information</h2>

        <input
          className="border rounded p-2 w-full"
          value={settings.name || ""}
          onChange={(e) => updateField("name", e.target.value)}
        />

        <input
          className="border rounded p-2 w-full bg-gray-100"
          value={settings.slug || ""}
          disabled
        />

        <input
          className="border rounded p-2 w-full"
          value={settings.domain || ""}
          onChange={(e) => updateField("domain", e.target.value)}
        />
      </div>

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

      <div className="space-y-4 border rounded p-6">
        <h2 className="font-semibold">Hero Section</h2>

        {heroPreview && (
          <img
            src={heroPreview}
            className="w-full max-h-60 object-cover rounded"
          />
        )}

        <input
          type="file"
          onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
        />

        <button onClick={uploadHero} className="btn-primary">
          Upload Hero Image
        </button>

        <input
          className="border p-2 w-full"
          value={settings.heroTitle || ""}
          onChange={(e) => updateField("heroTitle", e.target.value)}
        />

        <input
          className="border p-2 w-full"
          value={settings.heroSubtitle || ""}
          onChange={(e) => updateField("heroSubtitle", e.target.value)}
        />

        <input
          className="border p-2 w-full"
          value={settings.heroCtaText || ""}
          onChange={(e) => updateField("heroCtaText", e.target.value)}
        />

        <input
          className="border p-2 w-full"
          value={settings.heroCtaLink || ""}
          onChange={(e) => updateField("heroCtaLink", e.target.value)}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.heroEnabled ?? true}
            onChange={(e) => updateField("heroEnabled", e.target.checked)}
          />
          Enable Hero
        </label>
      </div>

      <div className="space-y-4 border rounded p-6">
        <h2 className="font-semibold">Logo</h2>

        {logoPreview && (
          <img src={logoPreview} className="h-20 object-contain" />
        )}

        <input
          type="file"
          onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
        />

        <button onClick={uploadLogo} className="btn-primary">
          Upload Logo
        </button>
      </div>

      <button onClick={save} className="btn-primary">
        Save Settings
      </button>
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
      />
    </div>
  );
}