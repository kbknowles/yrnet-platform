// filepath: frontend/app/[tenantSlug]/admin/documents/page.js

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AdminDocuments() {
  const { tenantSlug } = useParams();

  const [form, setForm] = useState({
    title: "",
    category: "GOVERNANCE",
    fileUrl: "",
  });

  const [file, setFile] = useState(null);

  async function handleUpload() {
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    const res = await fetch(
      `${API_BASE}/${tenantSlug}/documents/upload`,
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();

    setForm((prev) => ({ ...prev, fileUrl: result.fileUrl }));
  }

  async function handleSave() {
    await fetch(`${API_BASE}/${tenantSlug}/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    alert("Saved");
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-xl font-bold mb-4">Upload Document</h1>

      <input
        type="text"
        placeholder="Title"
        className="border p-2 w-full mb-2"
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <select
        className="border p-2 w-full mb-2"
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
      >
        <option value="GOVERNANCE">Governance</option>
        <option value="MEMBERSHIP">Membership</option>
        <option value="PROGRAMS">Programs</option>
      </select>

      {/* FILE UPLOAD */}
      <input
        type="file"
        className="mb-2"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={handleUpload}
        className="bg-gray-800 text-white px-4 py-2 mb-4"
      >
        Upload File
      </button>

      {/* PREVIEW */}
      {form.fileUrl && (
        <div className="mb-4 text-sm">
          Uploaded: {form.fileUrl}
        </div>
      )}

      <button
        onClick={handleSave}
        className="bg-black text-white px-4 py-2"
      >
        Save Document
      </button>
    </div>
  );
}