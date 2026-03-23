// filepath: frontend/middleware.js

import { NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host");

  if (!host) return NextResponse.next();

  const hostname = host.toLowerCase().replace(/^www\./, "").split(":")[0];

  // skip localhost (dev handled by path)
  if (hostname === "localhost" || hostname.includes("127.0.0.1")) {
    return NextResponse.next();
  }

  // get tenant from domain
  const res = await fetch(
    `${API_BASE}/resolve-tenant?host=${hostname}`,
    { cache: "no-store" }
  );

  if (!res.ok) return NextResponse.next();

  const tenant = await res.json();
  if (!tenant?.slug) return NextResponse.next();

  const pathParts = url.pathname.split("/").filter(Boolean);

  // ✅ already has tenant slug → do nothing
  if (pathParts.length > 0 && pathParts[0] === tenant.slug) {
    return NextResponse.next();
  }

  // ✅ rewrite
  url.pathname =
    url.pathname === "/"
      ? `/${tenant.slug}`
      : `/${tenant.slug}${url.pathname}`;

  return NextResponse.rewrite(url);
}