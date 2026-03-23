// filepath: frontend/app/[tenantSlug]/admin/athletes/page.js

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { resolveTenantMedia } from "lib/media";
import authFetch from "../../../../utils/authFetch";
import { getBasePath } from "../../../../utils/getBasePath";

function resolveAthleteImage(filename, tenantSlug) {
  if (!filename) return null;

  return resolveTenantMedia({
    tenantSlug,
    folder: "images",
    filename,
  });
}

export default function AthletesAdminPage() {
  const { tenantSlug } = useParams();
  const router = useRouter();

  const basePath = getBasePath(tenantSlug);
  const adminBase = `${basePath}/admin`;

  const [authorized, setAuthorized] = useState(false);
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      router.push(basePath || "/");
      return;
    }
    setAuthorized(true);
  }, [tenantSlug, router, basePath]);

  useEffect(() => {
    if (!tenantSlug || !authorized) return;

    async function load() {
      try {
        const res = await authFetch(`/${tenantSlug}/admin/athletes`, {
          cache: "no-store",
        });

        if (!res.ok) {
          router.push(basePath || "/");
          return;
        }

        const data = await res.json();
        setAthletes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch athletes error:", err);
        setAthletes([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [tenantSlug, authorized, router, basePath]);

  if (!authorized) return null;
  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Athletes</h1>
        <Link href={`${adminBase}/athletes/new`} className="btn-primary">
          Add Athlete
        </Link>
      </div>

      {athletes.length === 0 && (
        <div className="border rounded p-4 text-gray-600">
          No athletes found.
        </div>
      )}

      {athletes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {athletes.map((a) => (
            <div
              key={a.slug}
              className="border rounded-lg bg-white p-4 flex gap-5"
            >
              <div className="w-24 h-24 rounded overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                {a.headshotUrl ? (
                  <img
                    src={resolveAthleteImage(a.headshotUrl, tenantSlug)}
                    alt={`${a.firstName} ${a.lastName}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-gray-400 text-center px-1">
                    No Photo
                  </span>
                )}
              </div>

              <div className="flex flex-col justify-between flex-1">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">
                    <Link
                      href={`${basePath}/athletes/${a.slug}`}
                      className="text-primary hover:underline"
                      target="_blank"
                    >
                      {a.firstName} {a.lastName}
                    </Link>
                  </h2>

                  {a.school && (
                    <p className="text-sm">
                      <strong>School:</strong> {a.school}
                    </p>
                  )}

                  {a.grade && (
                    <p className="text-sm">
                      <strong>Grade:</strong> {a.grade}
                    </p>
                  )}

                  <p className="text-sm flex items-center gap-2">
                    <strong>Status:</strong>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        a.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {a.isActive ? "Active" : "Inactive"}
                    </span>
                  </p>

                  <p className="text-sm">
                    <strong>Sponsorships:</strong>{" "}
                    <span className="font-medium">
                      {a._count?.sponsorships ?? 0}
                    </span>
                  </p>
                </div>

                <div className="mt-3">
                  <Link
                    href={`${adminBase}/athletes/${a.slug}`}
                    className="text-primary text-sm font-medium"
                  >
                    Edit Athlete →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}