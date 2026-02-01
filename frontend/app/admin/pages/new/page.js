// filepath: frontend/app/admin/pages/new/page.js

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageEditor from "../PageEditor_tmp";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function NewPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    status: "draft",
    showInMenu: false,
    showInFooter: false,
    sortOrder: 0,
  });

  async function save() {
    await fetch(`${API_BASE}/api/admin/pages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/admin/pages");
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
