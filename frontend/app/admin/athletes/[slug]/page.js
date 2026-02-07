"use client";

import { useParams } from "next/navigation";
import AthleteForm from "../AthleteForm";

export default function EditAthletePage() {
  const { slug } = useParams();

  return <AthleteForm slug={slug} mode="edit" />;
}
