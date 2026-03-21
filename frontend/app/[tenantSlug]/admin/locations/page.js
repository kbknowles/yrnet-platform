// filepath: frontend/app/admin/locations/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import authFetch from "../../../../utils/authFetch";

const EMPTY_LOCATION = {
  name: "",
  streetAddress: "",
  city: "",
  state: "AL",
  zip: "",
  venueInfo: {
    stalls: "",
    hookups: "",
    parking: "",
    notes: "",
  },
};

export default function AdminLocationsPage() {
  const params = useParams();
  const router = useRouter();

  const tenantSlug = Array.isArray(params?.tenantSlug)
    ? params.tenantSlug[0]
    : params?.tenantSlug;

  const [authorized, setAuthorized] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      router.push(`/${tenantSlug || ""}`);
      return;
    }
    setAuthorized(true);
  }, [tenantSlug, router]);

  async function load() {
    if (!tenantSlug) return;

    setLoading(true);
    try {
      const res = await authFetch(
        `/${tenantSlug}/admin/locations`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        router.push(`/${tenantSlug}`);
        return;
      }

      const data = await res.json();
      setLocations(Array.isArray(data) ? data : []);
    } catch {
      setLocations([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authorized) load();
  }, [tenantSlug, authorized]);

  function normalizePayload(l) {
    return {
      name: l.name || "",
      streetAddress: l.streetAddress || "",
      city: l.city || "",
      state: l.state || "AL",
      zip: l.zip || "",
      venueInfo: {
        stalls: l.venueInfo?.stalls || "",
        hookups: l.venueInfo?.hookups || "",
        parking: l.venueInfo?.parking || "",
        notes: l.venueInfo?.notes || "",
      },
    };
  }

  async function save() {
    if (!active || !tenantSlug) return;

    const isEdit = Boolean(active.id);

    const url = isEdit
      ? `/${tenantSlug}/admin/locations/${active.id}`
      : `/${tenantSlug}/admin/locations`;

    await authFetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalizePayload(active)),
    });

    setActive(null);
    load();
  }

  async function remove(id) {
    if (!confirm("Delete location?") || !tenantSlug) return;

    await authFetch(`/${tenantSlug}/admin/locations/${id}`, {
      method: "DELETE",
    });

    if (active?.id === id) {
      setActive(null);
    }

    load();
  }

  if (!authorized) return null;
  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Locations</h1>
        <button
          onClick={() =>
            setActive(JSON.parse(JSON.stringify(EMPTY_LOCATION)))
          }
          className="bg-primary text-white px-4 py-2 rounded"
        >
          + New Location
        </button>
      </div>

      <div className="bg-white rounded shadow border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">City</th>
              <th className="p-3 text-left">State</th>
              <th className="p-3 text-left">Zip</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((l) => (
              <tr key={l.id} className="border-t hover:bg-slate-50">
                <td className="p-3 font-medium">{l.name}</td>
                <td className="p-3">{l.city}</td>
                <td className="p-3">{l.state}</td>
                <td className="p-3">{l.zip}</td>
                <td className="p-3 text-right space-x-3">
                  <button
                    onClick={() =>
                      setActive({
                        id: l.id,
                        name: l.name || "",
                        streetAddress: l.streetAddress || "",
                        city: l.city || "",
                        state: l.state || "AL",
                        zip: l.zip || "",
                        venueInfo: {
                          stalls: l.venueInfo?.stalls || "",
                          hookups: l.venueInfo?.hookups || "",
                          parking: l.venueInfo?.parking || "",
                          notes: l.venueInfo?.notes || "",
                        },
                      })
                    }
                    className="text-primary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(l.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {locations.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="p-6 text-center text-gray-500"
                >
                  No locations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {active && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded shadow-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold">
              {active.id ? "Edit Location" : "New Location"}
            </h2>

            <input
              className="w-full border rounded p-2"
              placeholder="Location Name"
              value={active.name}
              onChange={(e) =>
                setActive({ ...active, name: e.target.value })
              }
            />

            <input
              className="w-full border rounded p-2"
              placeholder="Street Address"
              value={active.streetAddress}
              onChange={(e) =>
                setActive({
                  ...active,
                  streetAddress: e.target.value,
                })
              }
            />

            <div className="grid grid-cols-3 gap-4">
              <input
                className="border rounded p-2"
                placeholder="City"
                value={active.city}
                onChange={(e) =>
                  setActive({ ...active, city: e.target.value })
                }
              />
              <input
                className="border rounded p-2"
                placeholder="State"
                value={active.state}
                onChange={(e) =>
                  setActive({ ...active, state: e.target.value })
                }
              />
              <input
                className="border rounded p-2"
                placeholder="Zip"
                value={active.zip}
                onChange={(e) =>
                  setActive({ ...active, zip: e.target.value })
                }
              />
            </div>

            <div className="border rounded p-4 bg-slate-50 space-y-3">
              <h3 className="font-medium text-sm">Venue Info</h3>

              {["stalls", "hookups", "parking"].map((f) => (
                <input
                  key={f}
                  className="w-full border rounded p-2"
                  placeholder={f}
                  value={active.venueInfo?.[f] || ""}
                  onChange={(e) =>
                    setActive({
                      ...active,
                      venueInfo: {
                        ...active.venueInfo,
                        [f]: e.target.value,
                      },
                    })
                  }
                />
              ))}

              <textarea
                className="w-full border rounded p-2"
                rows={3}
                placeholder="Notes"
                value={active.venueInfo?.notes || ""}
                onChange={(e) =>
                  setActive({
                    ...active,
                    venueInfo: {
                      ...active.venueInfo,
                      notes: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setActive(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="bg-primary text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}