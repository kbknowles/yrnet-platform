// filepath: frontend/app/not-found.js

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getBasePath } from "../utils/getBasePath";

export default function NotFound() {
  const pathname = usePathname();

  const tenantSlug = (pathname || "").split("/").filter(Boolean)[0] || null;
  const basePath = getBasePath(tenantSlug);

  const homeHref = basePath || "/";

  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center space-y-6">
      <h1 className="text-4xl font-bold text-primary">
        Page Not Found
      </h1>

      <p className="text-gray-600 max-w-md">
        The page you’re looking for doesn’t exist or is no longer available.
      </p>

      <Link
        href={homeHref}
        className="text-accent font-medium underline"
      >
        Return to Home
      </Link>
    </main>
  );
}