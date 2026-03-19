// filepath: frontend/app/[tenantSlug]/documents/page.js

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function DocumentsPage() {
  const { tenantSlug } = useParams();
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    if (!tenantSlug) return;

    fetch(`${API_BASE}/${tenantSlug}/documents`)
      .then((res) => res.json())
      .then(setDocs);
  }, [tenantSlug]);

  const grouped = {
    GOVERNANCE: docs.filter((d) => d.category === "GOVERNANCE"),
    MEMBERSHIP: docs.filter((d) => d.category === "MEMBERSHIP"),
    PROGRAMS: docs.filter((d) => d.category === "PROGRAMS"),
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Documents</h1>

      {Object.entries(grouped).map(([section, items]) =>
        items.length ? (
          <div key={section} className="mb-8">
            <h2 className="text-xl font-semibold mb-3">{section}</h2>

            <ul className="space-y-2">
              {items.map((doc) => (
                <li
                  key={doc.id}
                  className="p-3 border rounded flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{doc.title}</div>
                    {doc.description && (
                      <div className="text-sm">{doc.description}</div>
                    )}
                  </div>

                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null
      )}
    </div>
  );
}