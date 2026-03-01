const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function uploadPdf(file, id) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `${API_BASE}/api/admin/documents/${id}`,
    {
      method: "PUT",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  return res.json();
}
