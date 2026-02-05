"use client";

import AthleteForm from "../AthleteForm";
import { useParams } from "next/navigation";

export default function EditAthletePage() {
  const { id } = useParams();
  return <AthleteForm athleteId={id} />;
}
