"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SponsorshipForm from "components/admin/SponsorshipForm";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export default function SponsorshipsPage() {
  const params = useParams();

  const tenantSlug = Array.isArray(params?.tenantSlug)
    ? params.tenantSlug[0]
    : params?.tenantSlug;

  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);

  async function load() {
    if (!tenantSlug) return;

    const res = await fetch(
      `${API_BASE}/${tenantSlug}/admin/sponsorships`,
      { cache: "no-store" }
    );

    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    load();
  }, [tenantSlug]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Sponsorships</h1>
        <button
          onClick={() => setEditing({})}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Sponsorship
        </button>
      </div>

      {editing && (
        <SponsorshipForm
          sponsorship={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}

      <div className="border rounded divide-y">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">
                {item.sponsor?.name}
              </div>
              <div className="text-sm text-gray-600">
                {item.level} | {item.contentType || "GLOBAL"}
              </div>
            </div>

            <div className="space-x-2">
              <button
                onClick={() => setEditing(item)}
                className="px-3 py-1 border rounded"
              >
                Edit
              </button>

              <button
                onClick={async () => {
                  if (!tenantSlug) return;

                  await fetch(
                    `${API_BASE}/${tenantSlug}/admin/sponsorships/${item.id}`,
                    { method: "DELETE" }
                  );

                  load();
                }}
                className="px-3 py-1 border rounded text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No sponsorships found.
          </div>
        )}
      </div>
    </div>
  );
}