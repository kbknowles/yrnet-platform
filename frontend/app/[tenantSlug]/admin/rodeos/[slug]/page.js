// filepath: frontend/app/[tenantSlug]/admin/rodeos/[slug]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function formatForDateInput(date) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d)) return "";
  return d.toISOString().slice(0, 10);
}

function toISO(date) {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d)) return null;
  return d.toISOString();
}

export default function AdminEditRodeoPage() {
  const params = useParams();
  const router = useRouter();

  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const tenantSlug = Array.isArray(params?.tenantSlug)
    ? params.tenantSlug[0]
    : params?.tenantSlug;

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    startDate: "",
    endDate: "",
    status: "draft",
  });

  useEffect(() => {
    if (!slug || !tenantSlug) return;

    async function loadRodeo() {
      try {
        const res = await fetch(
          `${API_BASE}/${tenantSlug}/admin/rodeos/${encodeURIComponent(slug)}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();

        setForm({
          name: data.name || "",
          slug: data.slug || "",
          startDate: formatForDateInput(data.startDate),
          endDate: formatForDateInput(data.endDate),
          status: data.status || "draft",
        });
      } catch (err) {
        console.error("Failed to load rodeo", err);
      } finally {
        setLoading(false);
      }
    }

    loadRodeo();
  }, [slug, tenantSlug]);

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...form,
      startDate: toISO(form.startDate),
      endDate: toISO(form.endDate),
    };

    try {
      const res = await fetch(
        `${API_BASE}/${tenantSlug}/admin/rodeos/${encodeURIComponent(slug)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to update rodeo:", text);
        return;
      }

      router.push(`/${tenantSlug}/admin/rodeos`);
    } catch (err) {
      console.error("Update failed", err);
    }
  }

  if (loading) {
    return <div className="p-6">Loading…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Rodeo</h1>
        <Link
          href={`/${tenantSlug}/admin/rodeos`}
          className="text-sm underline"
        >
          Back to Rodeos
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded p-6 space-y-4"
      >
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full border rounded px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) =>
              setForm({ ...form, slug: e.target.value })
            }
            className="w-full border rounded px-3 py-2 text-sm"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Start Date</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) =>
                setForm({ ...form, startDate: e.target.value })
              }
              className="w-full border rounded px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">End Date</label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) =>
                setForm({ ...form, endDate: e.target.value })
              }
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Status</label>
          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}