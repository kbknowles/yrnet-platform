// filepath: frontend/app/athletes/[slug]/page.js

import Link from "next/link";
import { notFound } from "next/navigation";
import AthleteView from "./AthleteView";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function getAthlete(slug) {
  const res = await fetch(`${API_BASE}/api/athletes/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function AthleteDetailPage(props) {
  const { slug } = await props.params;
  const athlete = await getAthlete(slug);

  if (!athlete || !athlete.isActive) {
    notFound();
  }

  return (
    <AthleteView
      athlete={athlete}
      API_BASE={API_BASE}
    />
  );
}