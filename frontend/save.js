import { NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};

export async function proxy(req) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host");

  if (!host) return NextResponse.next();

  const hostname = host.toLowerCase().replace(/^www\./, "").split(":")[0];

  // skip localhost
  if (hostname === "localhost") {
    return NextResponse.next();
  }

  // prevent loop
  if (url.pathname.startsWith("/ahsra")) {
    return NextResponse.next();
  }

  const res = await fetch(
    `${API_BASE}/resolve-tenant?host=${hostname}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return NextResponse.next();
  }

  const tenant = await res.json();

  if (!tenant?.slug) {
    return NextResponse.next();
  }

  url.pathname =
    url.pathname === "/"
      ? `/${tenant.slug}`
      : `/${tenant.slug}${url.pathname}`;

  return NextResponse.rewrite(url);
}