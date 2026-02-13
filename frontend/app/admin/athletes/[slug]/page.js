"use client";

import { useParams } from "next/navigation";
import AthleteForm from "../AthleteForm";

export default function EditAthletePage() {
  const params = useParams();
  const slug = params?.slug;

  if (!slug) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return <AthleteForm slug={slug} mode="edit" />;
}
