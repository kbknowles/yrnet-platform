"use client";

import { useEffect, useState } from "react";



export default function AdminOfficersPage() {
const API_BASE= process.env.NEXT_PUBLIC_API_URL;

const [officers, setOfficers] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [form, setForm] = useState({
    name: "",
    role: "",
    type: "adult",
    seasonId: "",
  });

  useEffect(() => {
    loadOfficers();
    loadSeasons();
  }, []);

  async function loadOfficers() {
    const res = await fetch(`${API_BASE}/api/admin/officers`);
    setOfficers(await res.json());
  }

  async function loadSeasons() {
    const res = await fetch(`${API_BASE}/api/admin/seasons`);
    setSeasons(await res.json());
  }

  async function createOfficer(e) {
    e.preventDefault();
    await fetch(`${API_BASE}/api/admin/officers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", role: "", type: "adult", seasonId: "" });
    loadOfficers();
  }

  async function deleteOfficer(id) {
    await fetch(`${API_BASE}/api/admin/officers/${id}`, {
      method: "DELETE",
    });
    loadOfficers();
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Officers</h1>

      {/* CREATE */}
      <form onSubmit={createOfficer} className="grid grid-cols-4 gap-3">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2"
          required
        />
        <input
          placeholder="Role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border p-2"
          required
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="border p-2"
        >
          <option value="adult">Adult</option>
          <option value="student">Student</option>
          <option value="queen">Queen</option>
        </select>
        <select
          value={form.seasonId}
          onChange={(e) => setForm({ ...form, seasonId: e.target.value })}
          className="border p-2"
          required
        >
          <option value="">Season</option>
          {seasons.map((s) => (
            <option key={s.id} value={s.id}>
              {s.year}
            </option>
          ))}
        </select>
        <button className="bg-black text-white px-4 py-2 col-span-4">
          Add Officer
        </button>
      </form>

      {/* LIST */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Role</th>
            <th className="p-2">Type</th>
            <th className="p-2">Season</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {officers.map((o) => (
            <tr key={o.id} className="border-t">
              <td className="p-2">{o.name}</td>
              <td className="p-2">{o.role}</td>
              <td className="p-2">{o.type}</td>
              <td className="p-2">{o.season?.year}</td>
              <td className="p-2">
                <button
                  onClick={() => deleteOfficer(o.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
