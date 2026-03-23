// filepath: frontend/components/home/HomeCTA.js
"use client";

import Link from "next/link";
import { useTenantSlug } from "hooks/useTenantSlug";
import { getBasePath } from "../../utils/getBasePath";

export default function HomeCTA() {
  const tenantSlug = useTenantSlug();
  const basePath = getBasePath(tenantSlug);

  return (
    <div className="py-2">
      <section className="hero bg-accent py-12 text-center">
        <h2 className="hero text-2xl font-bold">Ready to Ride?</h2>
        <p className="hero mt-4">Learn how to compete.</p>

        <Link
          href={`${basePath}/learn-more`}
          className="inline-block mt-6 bg-white text-secondary px-6 py-3 rounded font-semibold"
        >
          Learn More
        </Link>
      </section>
    </div>
  );
}