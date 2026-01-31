// filepath: frontend/app/admin/pages/PageEditor.js

"use client";

import { uploadPdf } from "../../../lib/uploadPdf";

export default function PageEditor({
  title,
  form,
  setForm,
  onSave,
}) {
  async function handlePdfUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { url } = await uploadPdf(file);
      await navigator.clipboard.writeText(url);
      alert("PDF uploaded. Link copied to clipboard.");
    } catch {
      alert("PDF upload failed.");
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-2xl font-bold text-ahsra-blue">
        {title}
      </h1>

      <input
        className="w-full border p-3"
        placeholder="Title"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <input
        className="w-full border p-3"
        placeholder="Slug"
        value={form.slug}
        onChange={(e) =>
          setForm({ ...form, slug: e.target.value })
        }
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-medium">Page Content</label>

          <label className="text-sm cursor-pointer text-ahsra-blue underline">
            Upload PDF
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handlePdfUpload}
            />
          </label>
        </div>

        <textarea
          className="w-full border p-3 h-72"
          placeholder="Write page content here. Paste PDF links where needed."
          value={form.content}
          onChange={(e) =>
            setForm({ ...form, content: e.target.value })
          }
        />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.showInMenu}
            onChange={(e) =>
              setForm({ ...form, showInMenu: e.target.checked })
            }
          />
          Show in Menu
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.showInFooter}
            onChange={(e) =>
              setForm({
                ...form,
                showInFooter: e.target.checked,
              })
            }
          />
          Show in Footer
        </label>
      </div>

      <div className="flex items-center gap-6">
        <select
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
          className="border p-2"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <button
          onClick={onSave}
          className="rounded bg-ahsra-blue px-6 py-2 text-white"
        >
          Save
        </button>
      </div>
    </main>
  );
}
