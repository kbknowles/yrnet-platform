// frontend/app/admin/seasons/page.js

"use client";

import { useEffect, useState } from "react";
import SeasonForm from "../../../components/admin/SeasonForm";


export default function AdminSeasonsPage() {
  const [seasons, setSeasons] = useState([]);

  async function loadSeasons() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/seasons`
    );
    const data = await res.json();
    setSeasons(data);
  }

  useEffect(() => {
    loadSeasons();
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-2xl font-bold">Seasons</h1>

      <SeasonForm onCreated={loadSeasons} />

      <section className="space-y-2">
        {seasons.map((s) => (
          <div
            key={s.id}
            className="border rounded p-3 bg-white text-sm"
          >
            <div className="font-medium">{s.year}</div>
            <div className="text-gray-600">
              {new Date(s.startDate).toLocaleDateString()} –{" "}
              {new Date(s.endDate).toLocaleDateString()}
            </div>
            {s.active && (
              <div className="text-green-700 font-medium">Active</div>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}
