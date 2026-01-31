// filepath: frontend/app/admin/pages/page.js

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AdminPagesList() {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/pages`)
      .then((res) => res.json())
      .then(setPages);
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ahsra-blue">
          Pages
        </h1>

        <Link
          href="/admin/pages/new"
          className="rounded bg-ahsra-blue px-4 py-2 text-white"
        >
          + New Page
        </Link>
      </div>

      <table className="w-full border bg-white">
        <thead className="bg-gray-50 text-left text-sm">
          <tr>
            <th className="p-3">Title</th>
            <th>Status</th>
            <th>Menu</th>
            <th>Footer</th>
            <th>Updated</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pages.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3 font-medium">{p.title}</td>
              <td>{p.status}</td>
              <td>{p.showInMenu ? "Yes" : "—"}</td>
              <td>{p.showInFooter ? "Yes" : "—"}</td>
              <td>
                {new Date(p.updatedAt).toLocaleDateString()}
              </td>
              <td className="text-right pr-3">
                <Link
                  href={`/admin/pages/${p.id}`}
                  className="text-ahsra-blue underline"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
