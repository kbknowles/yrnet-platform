"use client";

export default function GalleryImageForm({ albumId, onUploaded }) {
  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/gallery/${albumId}/images`,
      { method: "POST", body: formData }
    );

    e.target.reset();
    onUploaded();
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
      <button className="bg-ahsra-blue text-white px-3 py-1 rounded">
        Upload
      </button>
    </form>
  );
}
