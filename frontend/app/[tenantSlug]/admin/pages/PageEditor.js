// filepath: frontend/app/[tenantSlug]/admin/pages/PageEditor.js

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import authFetch from "../../../../utils/authFetch";
import { getBasePath } from "../../../../utils/getBasePath";

export default function PageEditor({ title, form, setForm, onSave }) {
  const params = useParams();
  const router = useRouter();

  const tenantSlug = Array.isArray(params?.tenantSlug)
    ? params.tenantSlug[0]
    : params?.tenantSlug;

  const basePath = getBasePath(tenantSlug);

  const [authorized, setAuthorized] = useState(false);
  const [mode, setMode] = useState("edit");
  const [pages, setPages] = useState([]);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkType, setLinkType] = useState("internal");
  const [linkValue, setLinkValue] = useState("");

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      router.push(basePath || "/");
      return;
    }
    setAuthorized(true);
  }, [router, basePath]);

  useEffect(() => {
    if (!tenantSlug || !authorized) return;

    async function loadPages() {
      try {
        const res = await authFetch(`/${tenantSlug}/admin/pages`, {
          cache: "no-store",
        });

        if (!res.ok) {
          router.push(basePath || "/");
          return;
        }

        const data = await res.json();
        setPages(Array.isArray(data) ? data : []);
      } catch {
        setPages([]);
      }
    }

    loadPages();
  }, [tenantSlug, authorized, router, basePath]);

  function wrap(tag) {
    const el = document.getElementById("content");
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;

    const selected = el.value.slice(start, end) || "text";
    const before = el.value.slice(0, start);
    const after = el.value.slice(end);

    const updated = `${before}<${tag}>${selected}</${tag}>${after}`;
    setForm({ ...form, content: updated });
  }

  function insertLink() {
    const el = document.getElementById("content");
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.slice(start, end) || "link";

    const href =
      linkType === "internal"
        ? `${basePath}/${linkValue}`
        : linkValue;

    const before = el.value.slice(0, start);
    const after = el.value.slice(end);

    const updated = `${before}<a href="${href}">${selected}</a>${after}`;
    setForm({ ...form, content: updated });

    setShowLinkModal(false);
    setLinkValue("");
  }

  if (!authorized) return null;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">{title}</h1>

      <input
        className="w-full border p-3"
        placeholder="Page title"
        value={form.title || ""}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <input
        className="w-full border p-3"
        placeholder="Hero subtitle (optional)"
        value={form.heroSubtitle || ""}
        onChange={(e) =>
          setForm({ ...form, heroSubtitle: e.target.value })
        }
      />

      <input
        className="w-full border p-3"
        placeholder="Slug (example: welcome)"
        value={form.slug || ""}
        onChange={(e) =>
          setForm({ ...form, slug: e.target.value })
        }
      />

      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!form.showInMenu}
            onChange={(e) =>
              setForm({ ...form, showInMenu: e.target.checked })
            }
          />
          Show in main navigation
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!form.showInFooter}
            onChange={(e) =>
              setForm({ ...form, showInFooter: e.target.checked })
            }
          />
          Show in footer
        </label>
      </div>

      <div className="flex flex-wrap gap-2 border p-3 bg-gray-50">
        <button type="button" onClick={() => wrap("h2")} className="btn">
          Heading
        </button>
        <button type="button" onClick={() => wrap("strong")} className="btn">
          Bold
        </button>
        <button type="button" onClick={() => wrap("ul")} className="btn">
          Bullet List
        </button>
        <button type="button" onClick={() => setShowLinkModal(true)} className="btn">
          Link
        </button>

        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={() => setMode("edit")}
            className={`btn ${mode === "edit" ? "btn-active" : ""}`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`btn ${mode === "preview" ? "btn-active" : ""}`}
          >
            Preview
          </button>
        </div>
      </div>

      {mode === "edit" ? (
        <textarea
          id="content"
          className="w-full min-h-[400px] border p-4 font-sans"
          value={form.content || ""}
          onChange={(e) =>
            setForm({ ...form, content: e.target.value })
          }
        />
      ) : (
        <div
          className="border p-6 prose max-w-none bg-white"
          dangerouslySetInnerHTML={{ __html: form.content }}
        />
      )}

      <div className="flex items-center justify-between">
        <select
          className="border p-2"
          value={form.status || "draft"}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <button
          onClick={onSave}
          className="bg-primary text-white px-6 py-2"
        >
          Save Page
        </button>
      </div>

      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold">Insert Link</h2>

            <div className="flex gap-4">
              <label>
                <input
                  type="radio"
                  checked={linkType === "internal"}
                  onChange={() => setLinkType("internal")}
                />{" "}
                Page
              </label>
              <label>
                <input
                  type="radio"
                  checked={linkType === "external"}
                  onChange={() => setLinkType("external")}
                />{" "}
                Website
              </label>
            </div>

            {linkType === "internal" ? (
              <select
                className="w-full border p-2"
                value={linkValue}
                onChange={(e) => setLinkValue(e.target.value)}
              >
                <option value="">Select a page</option>
                {pages.map((p) => (
                  <option key={p.id} value={p.slug}>
                    {p.title}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="w-full border p-2"
                placeholder="https://example.com"
                value={linkValue}
                onChange={(e) => setLinkValue(e.target.value)}
              />
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 border"
              >
                Cancel
              </button>
              <button
                onClick={insertLink}
                className="bg-primary text-white px-4 py-2"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .btn {
          border: 1px solid #ccc;
          padding: 6px 10px;
          background: white;
        }
        .btn-active {
          background: #11346e;
          color: white;
        }
      `}</style>
    </main>
  );
}