// filepath: frontend/app/[tenantSlug]/admin/documents/page.js

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AdminDocuments() {
  const { tenantSlug } = useParams();

  const [form, setForm] = useState({
    id: null,
    title: "",
    category: "GOVERNANCE",
    fileUrl: "",
  });

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [documents, setDocuments] = useState([]);

  /* -----------------------------
     LOAD DOCUMENTS
  ----------------------------- */
  async function loadDocuments() {
    const res = await fetch(`${API_BASE}/${tenantSlug}/documents`);
    const data = await res.json();
    setDocuments(data || []);
  }

  useEffect(() => {
    if (tenantSlug) loadDocuments();
  }, [tenantSlug]);

  /* -----------------------------
     UPLOAD FILE
  ----------------------------- */
  async function handleUpload() {
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    const res = await fetch(
      `${API_BASE}/${tenantSlug}/admin/documents/upload`,
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();

    if (res.ok) {
      setForm((prev) => ({ ...prev, fileUrl: result.fileUrl }));
      setMessage('Upload successful. Click "Save Document" to finish.');
    } else {
      setMessage("Upload failed");
    }
  }

  /* -----------------------------
     SAVE / UPDATE
  ----------------------------- */
  async function handleSave() {
    const method = form.id ? "PUT" : "POST";
    const url = form.id
      ? `${API_BASE}/${tenantSlug}/admin/documents/${form.id}`
      : `${API_BASE}/${tenantSlug}/admin/documents`;

    const body = form.id && file
      ? (() => {
          const data = new FormData();
          data.append("file", file);
          data.append("title", form.title);
          data.append("category", form.category);
          return data;
        })()
      : JSON.stringify(form);

    await fetch(url, {
      method,
      headers: form.id && file ? undefined : { "Content-Type": "application/json" },
      body,
    });

    setForm({
      id: null,
      title: "",
      category: "GOVERNANCE",
      fileUrl: "",
    });

    setFile(null);
    setMessage("Saved");
    loadDocuments();
  }

  /* -----------------------------
     DELETE
  ----------------------------- */
  async function handleDelete(id) {
    await fetch(`${API_BASE}/${tenantSlug}/admin/documents/${id}`, {
      method: "DELETE",
    });

    loadDocuments();
  }

  /* -----------------------------
     EDIT
  ----------------------------- */
  function handleEdit(doc) {
    setForm(doc);
    setMessage("Editing document");
  }

  /* -----------------------------
     GROUP + SORT
  ----------------------------- */
  const grouped = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {});

  Object.keys(grouped).forEach((cat) => {
    grouped[cat].sort((a, b) => a.title.localeCompare(b.title));
  });

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* LEFT */}
      <div>
        <h1 className="text-xl font-bold mb-4">
          {form.id ? "Edit Document" : "Upload Document"}
        </h1>

        {/* Helpful Hints */}
        <div className="mb-6 p-4 border rounded bg-gray-50 text-sm">
          <h2 className="font-semibold mb-2">Helpful Hints</h2>

          <div className="mb-2">
            <strong>Governance</strong>
            <div>Rules, bylaws, constitution, policies</div>
          </div>

          <div className="mb-2">
            <strong>Membership</strong>
            <div>Applications, waivers, eligibility forms</div>
          </div>

          <div>
            <strong>Events & Activities</strong>
            <div>Schedules, entry forms, event info</div>
          </div>
        </div>

        <input
          type="text"
          placeholder="Title"
          className="border p-2 w-full mb-2"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <select
          className="border p-2 w-full mb-2"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        >
          <option value="GOVERNANCE">Governance</option>
          <option value="MEMBERSHIP">Membership</option>
          <option value="EVENTS">Events & Activities</option>
        </select>

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

        {message && (
          <div className="mb-4 text-sm text-green-700">
            {message}
          </div>
        )}

        <button
          onClick={handleSave}
          className="bg-black text-white px-4 py-2"
        >
          {form.id ? "Update Document" : "Save Document"}
        </button>
      </div>

      {/* RIGHT */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Documents</h2>

        {Object.keys(grouped).map((category) => (
          <div key={category} className="mb-6">
            <h3 className="font-bold mb-2">
              {category === "EVENTS"
                ? "Events & Activities"
                : category}
            </h3>

            <div className="space-y-2">
              {grouped[category].map((doc) => (
                <div
                  key={doc.id}
                  className="border p-3 flex justify-between items-center"
                >
                  <div className="flex flex-col text-sm">
                    <a
                      href={`${API_BASE}${doc.fileUrl}`}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      {doc.title}
                    </a>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(doc)}
                      className="text-blue-600 text-xs"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-600 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}