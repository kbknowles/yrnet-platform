// filepath: frontend/app/officers/page.js
"use client";

import { useEffect, useState } from "react";
import SponsorZone from "../../components/sponsorship/SponsorZone";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function OfficersPage() {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/officers`);
    const data = await res.json();
    setOfficers(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <div className="p-6">Loading…</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        <h1 className="text-2xl font-semibold">Officers</h1>


      {officers.length === 0 ? (
        <p className="text-slate-600">No officers found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {officers.map((o) => (
            <div
              key={o.id}
              className="bg-white border rounded-lg p-5 shadow-sm"
            >
              <div className="font-semibold text-lg">{o.name}</div>

              <div className="text-sm text-slate-700 mt-1">
                {o.role}
              </div>

              <div className="text-xs text-slate-500 mt-1">
                {o.type}
              </div>

              <div className="mt-4 text-sm space-y-1">
                {o.emailAlias && (
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    <a
                      href={`mailto:${o.emailAlias}`}
                      className="text-ahsra-blue"
                    >
                      {o.emailAlias}
                    </a>
                  </div>
                )}

                {o.phone && (
                  <div>
                    <span className="font-medium">Phone:</span>{" "}
                    {o.phone}
                  </div>
                )}
              </div>

              {o.season && (
                <div className="mt-4 text-xs text-slate-500">
                  Season: {o.season.year}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

            {/* SPONSORS */}
                  <section className="bg-white/90 py-4">
                    <div className="max-w-7xl mx-auto px-4 space-y-6">
                      <h2 className="text-2xl font-semibold text-center">
                        Thank You to Our Sponsors
                      </h2>
            
                      <div className="border-t-2 border-rose-700 w-20 mx-auto" />
            
                     <SponsorZone
                     contentType="SEASON"
                     contentId={null}
                     levels={["PREMIER", "FEATURED"]}
                     slots={4}
                     />
                    </div>
                  </section>
    </div>
  );
}
