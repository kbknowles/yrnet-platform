// filepath: frontend/app/[tenantSlug]/admin/rodeo/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import authFetch from "../../../../utils/authFetch";



function formatMMDDYYYY(date) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d)) return "";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

export default function AdminRodeosPage() {
  const params = useParams();
  const router = useRouter();

  const tenantSlug = Array.isArray(params?.tenantSlug)
    ? params.tenantSlug[0]
    : params?.tenantSlug;

  const [authorized, setAuthorized] = useState(false);
  const [rodeos, setRodeos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      router.push(`/${tenantSlug || ""}`);
      return;
    }
    setAuthorized(true);
  }, [tenantSlug, router]);

  useEffect(() => {
    if (!tenantSlug || !authorized) return;

    async function load() {
      try {
        const res = await authFetch(
          `/${tenantSlug}/admin/rodeos`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          router.push(`/${tenantSlug}`);
          return;
        }

        const data = await res.json();
        setRodeos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load rodeos", err);
        setRodeos([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [tenantSlug, authorized, router]);

  if (!authorized) return null;
  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Rodeos</h1>
        <Link
          href={`/${tenantSlug}/admin/rodeos/new`}
          className="px-4 py-2 bg-black text-white rounded text-sm"
        >
          + New Rodeo
        </Link>
      </div>

      {rodeos.length === 0 && (
        <p className="text-slate-600 text-sm">No rodeos found.</p>
      )}

      {rodeos.length > 0 && (
        <div className="bg-white border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Season</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rodeos.map((rodeo) => (
                <tr key={rodeo.id} className="border-t">
                  <td className="px-4 py-3 font-medium">
                    {rodeo.name}
                    <div className="text-xs text-slate-500">
                      /rodeos/{rodeo.slug}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-slate-700">
                    {formatMMDDYYYY(rodeo.startDate)}
                    {rodeo.endDate &&
                      ` – ${formatMMDDYYYY(rodeo.endDate)}`}
                  </td>

                  <td className="px-4 py-3 text-slate-700">
                    {rodeo.season?.year ?? "—"}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        rodeo.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {rodeo.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right space-x-3">
                    <Link
                      href={`/${tenantSlug}/admin/rodeos/${rodeo.slug}`}
                      className="underline"
                    >
                      Edit
                    </Link>

                    <Link
                      href={`/${tenantSlug}/admin/rodeos/${rodeo.slug}/schedule`}
                      className="underline"
                    >
                      Schedule
                    </Link>

                    <Link
                      href={`/${tenantSlug}/rodeos/${rodeo.slug}`}
                      target="_blank"
                      className="underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}