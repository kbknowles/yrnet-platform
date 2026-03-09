// filepath: frontend/app/[tenantSlug]/admin/pages/[id]/page.js
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
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/\n/g, "<br />")}</p>`)
    .join("");
}

export default function EditPage() {
  const params = useParams();
  const router = useRouter();

  const tenantSlug = Array.isArray(params?.tenantSlug)
    ? params.tenantSlug[0]
    : params?.tenantSlug;

  const id = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id;

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenantSlug || !id) return;

    async function load() {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/${tenantSlug}/admin/pages`);
      const pages = await res.json();

      const page = Array.isArray(pages)
        ? pages.find((p) => p.id === Number(id))
        : null;

      if (page) {
        setForm({
          ...page,
          heroSubtitle: page.heroSubtitle || "",
        });
      } else {
        setForm(null);
      }

      setLoading(false);
    }

    load();
  }, [tenantSlug, id]);

  async function save() {
    const formatted = {
      ...form,
      content: toParagraphs(form.content),
    };

    await fetch(`${API_BASE}/api/${tenantSlug}/admin/pages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formatted),
    });

    router.push(`/${tenantSlug}/admin/pages`);
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