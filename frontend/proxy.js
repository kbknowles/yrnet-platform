import { NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// 🔴 REQUIRED — without this proxy won't run on all routes
export const config = {
  matcher: "/:path*",
};

export async function proxy(req) {
  const url = req.nextUrl;
  const hostHeader = req.headers.get("host");

  if (!hostHeader) return NextResponse.next();

  const hostname = hostHeader.split(":")[0];

  if (hostname === "localhost") {
    return NextResponse.next();
  }

  try {
    const res = await fetch(
      `${API_BASE}/api/resolve-tenant?host=${hostname}`,
      { cache: "no-store" }
    );

    if (!res.ok) return NextResponse.next();

    const tenant = await res.json();

    if (!tenant?.slug) return NextResponse.next();

    // prevent loop
    if (url.pathname.startsWith(`/${tenant.slug}`)) {
      return NextResponse.next();
    }

    // rewrite ALL paths (handles "/" correctly)
    url.pathname = `/${tenant.slug}${url.pathname}`;

    return NextResponse.rewrite(url);
  } catch {
    return NextResponse.next();
  }
}