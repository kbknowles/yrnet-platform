// filepath: frontend/app/admin/gallery/page.js
"use client";

import { useEffect, useState } from "react";

export default function AdminGalleryPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const [albums, setAlbums] = useState([]);
  const [title, setTitle] = useState("");
  const [seasonId, setSeasonId] = useState("");
  const [loading, setLoading] = useState(true);

  const [activeAlbum, setActiveAlbum] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [caption, setCaption] = useState("");

  async function loadAlbums() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/${tenantSlug}/${tenantSlug}/${tenantSlug}/${tenantSlug}/${tenantSlug}/admin/gallery`, {
        cache: "no-store",
      });

      if (!res.ok) {
        setAlbums([]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setAlbums(Array.isArray(data) ? data : []);
    } catch {
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  }

  async function refreshActiveAlbum(id) {
    try {
      const res = await fetch(`${API_BASE}/api/${tenantSlug}/admin/gallery`, {
        cache: "no-store",
      });

      if (!res.ok) return;

      const data = await res.json();
      const updated = data.find((a) => a.id === id);
      if (updated) setActiveAlbum(updated);
      setAlbums(Array.isArray(data) ? data : []);
    } catch {}
  }

  useEffect(() => {
    loadAlbums();
  }, []);

  async function createAlbum() {
    if (!title.trim()) return;

    const payload = {
      title: title.trim(),
      seasonId: seasonId ? parseInt(seasonId, 10) : null,
    };

    const res = await fetch(`${API_BASE}/api/${tenantSlug}/admin/gallery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) return;

    setTitle("");
    setSeasonId("");
    loadAlbums();
  }

  async function deleteAlbum(id) {
    if (!confirm("Delete this album and all images?")) return;

    await fetch(`${API_BASE}/api/${tenantSlug}/admin/gallery/${id}`, {
      method: "DELETE",
    });

    if (activeAlbum?.id === id) {
      setActiveAlbum(null);
    }

    loadAlbums();
  }

  async function uploadImage() {
    if (!uploadFile || !activeAlbum) return;

    const formData = new FormData();
    formData.append("image", uploadFile);
    formData.append("caption", caption);

    const res = await fetch(
      `${API_BASE}/api/admin/gallery/${activeAlbum.id}/images`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) return;

    setUploadFile(null);
    setCaption("");
    refreshActiveAlbum(activeAlbum.id);
  }

  async function deleteImage(imageId) {
    if (!activeAlbum) return;

    await fetch(`${API_BASE}/api/${tenantSlug}/admin/gallery/images/${imageId}`, {
      method: "DELETE",
    });

    refreshActiveAlbum(activeAlbum.id);
  }

  if (loading) {
    return <p className="p-6">Loading gallery…</p>;
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Gallery Albums</h1>

      <div className="overflow-x-auto bg-white border rounded shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border text-left">Title</th>
              <th className="p-3 border w-40">Season</th>
              <th className="p-3 border w-48">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-blue-50">
              <td className="p-2 border">
                <input
                  className="w-full border rounded p-1"
                  placeholder="New album title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </td>
              <td className="p-2 border">
                <input
                  className="w-full border rounded p-1"
                  placeholder="Season ID"
                  value={seasonId}
                  onChange={(e) => setSeasonId(e.target.value)}
                />
              </td>
              <td className="p-2 border">
                <button
                  onClick={createAlbum}
                  className="bg-primary text-white px-3 py-1 rounded text-xs"
                >
                  Add Album
                </button>
              </td>
            </tr>

            {albums.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="p-3 border font-medium">{a.title}</td>
                <td className="p-3 border">{a.seasonId ?? "—"}</td>
                <td className="p-3 border space-x-3">
                  <button
                    onClick={() => setActiveAlbum(a)}
                    className="text-primary text-xs"
                  >
                    Manage Photos
                  </button>
                  <button
                    onClick={() => deleteAlbum(a.id)}
                    className="text-red-600 text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeAlbum && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded shadow-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Photos — {activeAlbum.title}
              </h2>
              <button
                onClick={() => setActiveAlbum(null)}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="border rounded p-4 mb-6 bg-gray-50">
              <div className="grid md:grid-cols-3 gap-3">
                <input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />
                <input
                  className="border rounded p-2"
                  placeholder="Caption (optional)"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
                <button
                  onClick={uploadImage}
                  className="bg-primary text-white rounded px-3 py-2 text-sm"
                >
                  Upload
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(activeAlbum.images || []).map((img) => (
                <div
                  key={img.id}
                  className="border rounded overflow-hidden bg-gray-100"
                >
                  <img
                    src={
                      img.imageUrl?.startsWith("http")
                        ? img.imageUrl
                        : `${API_BASE}${img.imageUrl}`
                    }
                    alt={img.caption || ""}
                    className="h-32 w-full object-cover"
                  />
                  <div className="p-2 text-xs flex justify-between">
                    <span className="truncate">
                      {img.caption || "—"}
                    </span>
                    <button
                      onClick={() => deleteImage(img.id)}
                      className="text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
