// filepath: frontend/app/admin/pages/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function EditPage() {
  const { id } = useParams(); // ✅ unwrap params correctly
  const router = useRouter();

  const [pages, setPages] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function load() {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/pages`);
      const data = await res.json();
      setPages(data);

      const match = data.find((p) => p.id === Number(id));
      setForm(match || null);
      setLoading(false);
    }

    load();
  }, [id]);

  async function save() {
    await fetch(`${API_BASE}/api/admin/pages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/admin/pages");
  }

  if (loading) return <div className="p-8">Loading…</div>;
  if (!form) return <div className="p-8">Page not found.</div>;

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Edit Page</h1>

      <input
        className="w-full border p-2"
        value={form.title || ""}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        className="w-full border p-2 h-64"
        value={form.content || ""}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
      />

      <button
        onClick={save}
        className="bg-ahsra-blue text-white px-4 py-2"
      >
        Save
      </button>
    </main>
  );
}
