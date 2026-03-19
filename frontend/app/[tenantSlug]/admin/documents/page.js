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

  /*
    HANDLE FILE UPLOAD
    -------------------------------------------------------
    - Sends file via FormData
    - Stores returned fileUrl in form state
  */
  async function handleUpload() {
    if (!file) return alert("Select a file first");

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch(
        `${API_BASE}/${tenantSlug}/admin/documents/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error(text);
        return alert("Upload failed");
      }

      const result = await res.json();

      setForm((prev) => ({
        ...prev,
        fileUrl: result.fileUrl,
      }));
    } catch (err) {
      console.error(err);
      alert("Upload error");
    }
  }

  /*
    HANDLE SAVE
    -------------------------------------------------------
    - Creates document record in DB
    - Requires fileUrl from upload step
  */
  async function handleSave() {
    if (!form.title) return alert("Title required");
    if (!form.fileUrl) return alert("Upload file first");

    try {
      const res = await fetch(
        `${API_BASE}/${tenantSlug}/admin/documents`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error(text);
        return alert("Save failed");
      }

      alert("Saved");

      // Reset form
      setForm({
        title: "",
        category: "GOVERNANCE",
        fileUrl: "",
      });
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Save error");
    }
  }

  return (
    <div className="p-6 max-w-xl">
      {/* HEADER */}
      <h1 className="text-xl font-bold mb-4">Upload Document</h1>

      {/* TITLE INPUT */}
      <input
        type="text"
        placeholder="Title"
        value={form.title}
        className="border p-2 w-full mb-2"
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      {/* CATEGORY SELECT */}
      <select
        value={form.category}
        className="border p-2 w-full mb-2"
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
      >
        <option value="GOVERNANCE">Governance</option>
        <option value="MEMBERSHIP">Membership</option>
        <option value="PROGRAMS">Programs</option>
      </select>

      {/* FILE INPUT */}
      <input
        type="file"
        accept="application/pdf"
        className="mb-2"
        onChange={(e) => setFile(e.target.files[0])}
      />

      {/* UPLOAD BUTTON */}
      <button
        onClick={handleUpload}
        className="bg-gray-800 text-white px-4 py-2 mb-4"
      >
        Upload File
      </button>

      {/* FILE PREVIEW */}
      {form.fileUrl && (
        <div className="mb-4 text-sm break-all">
          Uploaded: {form.fileUrl}
        </div>
      )}

      {/* SAVE BUTTON */}
      <button
        onClick={handleSave}
        className="bg-black text-white px-4 py-2"
      >
        Save Document
      </button>
    </div>
  );
}