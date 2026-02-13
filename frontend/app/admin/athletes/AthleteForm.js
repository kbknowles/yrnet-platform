"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const EVENT_OPTIONS = [
  "BAREBACK",
  "SADDLE_BRONC",
  "BULL_RIDING",
  "BARREL_RACING",
  "POLE_BENDING",
  "GOAT_TYING",
  "BREAKAWAY_ROPING",
  "TIE_DOWN_ROPING",
  "TEAM_ROPING",
  "STEER_WRESTLING",
  "RANCH_SADDLE_BRONC",
];

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  school: "",
  grade: "",
  hometown: "",
  bio: "",
  events: [],
  futureGoals: "",
  socialLinks: [],
  isActive: true,
  isFeatured: false,
  sortOrder: 0,
};

export default function AthleteForm({ slug, mode = "create" }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [headshotFile, setHeadshotFile] = useState(null);
  const [actionFile, setActionFile] = useState(null);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  useEffect(() => {
    if (mode !== "edit" || !slug) return;

    async function loadAthlete() {
      const res = await fetch(
        `${API_BASE}/api/admin/athletes/${slug}`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        alert("Failed to load athlete");
        return;
      }

      const data = await res.json();

      setForm({
        ...EMPTY_FORM,
        ...data,
        events: data.events || [],
        isActive: data.isActive ?? true,
      });

      setLoading(false);
    }

    loadAthlete();
  }, [mode, slug]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value ?? "");
      }
    });

    if
