import { headers } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default async function RootPage() {
  const headersList = await headers(); // 🔴 FIX
  const host = headersList.get("host");

  if (!host) return null;

  const hostname = host.split(":")[0];

  try {
    const res = await fetch(
      `${API_BASE}/api/resolve-tenant?host=${hostname}`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;

    const tenant = await res.json();

    if (!tenant?.slug) return null;

    redirect(`/${tenant.slug}`);
  } catch {
    return null;
  }
}