// filepath: frontend/app/admin/pages/[id]/page.js

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function EditPage({ params }) {
  const router = useRouter();
  const [form, setForm] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/pages`)
      .then((res) => res.json())
      .then((pages) =>
        setForm(pages.find((p) => p.id === Number(params.id)))
      );
  }, [params.id]);

  async function save() {
    await fetch(`${API_BASE}/api/admin/pages/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/admin/pages");
  }

  if (!form) return null;

  return (
    <PageEditor
      title="Edit Page"
      form={form}
      setForm={setForm}
      onSave={save}
    />
  );
}
