// filepath: frontend/app/admin/pages/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageEditor from "../PageEditor";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

/* ----------------------------
   Helper: text → HTML paragraphs
----------------------------- */
function toParagraphs(text = "") {
  return text
    .split(/\n\s*\n/) // split on blank lines
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/\n/g, "<br />")}</p>`)
    .join("");
}

export default function EditPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function load() {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/admin/pages`);
      const pages = await res.json();

      const page = pages.find((p) => p.id === Number(id));
      setForm(page || null);

      setLoading(false);
    }

    load();
  }, [id]);

  async function save() {
    const formatted = {
      ...form,
      content: toParagraphs(form.content),
    };

    await fetch(`${API_BASE}/api/admin/pages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formatted),
    });

    router.push("/admin/pages");
  }

  if (loading) return <div className="p-8">Loading…</div>;
  if (!form) return <div className="p-8">Page not found.</div>;

  return (
    <PageEditor
      title="Edit Page"
      form={form}
      setForm={setForm}
      onSave={save}
    />
  );
}
