import { headers } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default async function RootPage() {
  const h = await headers();
  const host = h.get("host");

  try {
    if (!host) {
      return <div>No host header</div>;
    }

    const hostname = host.split(":")[0];

    const res = await fetch(
      `${API_BASE}/api/resolve-tenant?host=${hostname}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return <div>Resolver failed: {res.status}</div>;
    }

    const tenant = await res.json();

    if (!tenant?.slug) {
      return <div>No tenant found</div>;
    }

    // ✅ This is the only success path
    redirect(`/${tenant.slug}`);
  } catch (err) {
    return <div>Root error: {String(err)}</div>;
  }
}