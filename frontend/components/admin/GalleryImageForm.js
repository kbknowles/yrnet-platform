// filepath: frontend/components/admin/GalleryImageForm.js
"use client";

import { useParams } from "next/navigation";
import authFetch from "../../utils/authFetch";

export default function GalleryImageForm({ albumId, onUploaded }) {
  const params = useParams();

  const tenantSlug = Array.isArray(params?.tenantSlug)
    ? params.tenantSlug[0]
    : params?.tenantSlug;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!tenantSlug || !albumId) return;

    const formData = new FormData(e.target);

    await authFetch(
      `/${tenantSlug}/admin/gallery/${albumId}/images`,
      {
        method: "POST",
        body: formData,
      }
    );

    e.target.reset();
    onUploaded?.();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <input type="file" name="image" required />

      <input
        type="text"
        name="caption"
        placeholder="Caption"
        className="border p-1"
      />

      <button className="bg-primary text-white px-3 py-1 rounded">
        Upload
      </button>
    </form>
  );
}