// filepath: frontend/components/home/HomeCTA.js
"use client";

import  useTenantSlug  from "hooks/useTenantSlug";

function ctaCopy(tenantSlug) {
  if (tenantSlug === "ahsra") {
    return {
      headline: "Ready to Ride?",
      body: "Learn how to compete with AHSRA.",
      button: "Learn More",
      href: "/learn-more",
    };
  }

  if (tenantSlug === "demo") {
    return {
      headline: "Ready to Ride?",
      body: "See how your association can launch a modern rodeo website.",
      button: "Learn More",
      href: "/learn-more",
    };
  }

  return {
    headline: "Ready to Ride?",
    body: "Learn how to compete with your association.",
    button: "Learn More",
    href: "/learn-more",
  };
}

export default function HomeCTA() {
  const tenantSlug = useTenantSlug();
  const copy = ctaCopy(tenantSlug || "demo");

  return (
    <div className="py-2">
      <section className="bg-accent text-white py-12 text-center">
        <h2 className="text-2xl font-bold">{copy.headline}</h2>
        <p className="mt-4">{copy.body}</p>
        <a
          href={copy.href}
          className="inline-block mt-6 bg-white text-primary px-6 py-3 rounded font-semibold"
        >
          {copy.button}
        </a>
      </section>
    </div>
  );
}