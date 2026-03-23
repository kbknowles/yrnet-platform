// filepath: frontend/app/[tenantSlug]/admin/rodeos/new/page.js
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import authFetch from "../../../../../utils/authFetch";
import { getBasePath } from "../../../../../utils/getBasePath";

export default function NewRodeoPage() {
  const params = useParams();
  const router = useRouter();

  const tenantSlug = Array.isArray(params?.tenantSlug)
    ? params.tenantSlug[0]
    : params?.tenantSlug;

  const basePath = getBasePath(tenantSlug);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    startDate: "",
    endDate: "",
    status: "draft",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await authFetch(`/${tenantSlug}/admin/rodeos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("Failed to create rodeo");
      return;
    }

    router.push(`${basePath}/admin/rodeos`);
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">New Rodeo</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <input
          className="w-full border p-2"
          placeholder="Slug"
          value={form.slug}
          onChange={(e) =>
            setForm({ ...form, slug: e.target.value })
          }
          required
        />

        <input
          type="date"
          className="w-full border p-2"
          value={form.startDate}
          onChange={(e) =>
            setForm({ ...form, startDate: e.target.value })
          }
          required
        />

        <input
          type="date"
          className="w-full border p-2"
          value={form.endDate}
          onChange={(e) =>
            setForm({ ...form, endDate: e.target.value })
          }
        />

        <select
          className="w-full border p-2"
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
        >
          <option value="draft">draft</option>
          <option value="published">published</option>
        </select>

        <div className="flex gap-3 pt-4">
          <button className="bg-black text-white px-4 py-2">
            Create Rodeo
          </button>

          <button
            type="button"
            onClick={() => router.push(`${basePath}/admin/rodeos`)}
            className="border px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}