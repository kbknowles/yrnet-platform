// filepath: frontend/app/[tenantSlug]/admin/pages/new/page.js

"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import PageEditor from "../PageEditor";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function NewPage() {
  const router = useRouter();
  const params = useParams();

  const tenantSlug = Array.isArray(params?.tenantSlug)
    ? params.tenantSlug[0]
    : params?.tenantSlug;

  const [form, setForm] = useState({
    title: "",
    slug: "",
    heroSubtitle: "",
    content: "",
    status: "draft",
    showInMenu: false,
    showInFooter: false,
    sortOrder: 0,
  });

  async function save() {
    if (!tenantSlug) return;

    await fetch(`${API_BASE}/${tenantSlug}/admin/pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    router.push(`/${tenantSlug}/admin/pages`);
  }

  return (
    <PageEditor
      title="New Page"
      form={form}
      setForm={setForm}
      onSave={save}
    />
  );
}