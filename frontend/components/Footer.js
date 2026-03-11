// filepath: frontend/components/Footer.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { resolveTenantMedia } from "lib/media";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function resolveLogo(filename, tenantSlug) {
  if (!filename) return null;

  return resolveTenantMedia({
    tenantSlug,
    folder: "images",
    filename,
  });
}

export default function Footer({ tenant }) {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    if (!tenant?.slug) return;

    fetch(`${API_BASE}/${tenant.slug}/pages`)
      .then((res) => res.json())
      .then((data) => {
        const footerPages = (Array.isArray(data) ? data : [])
          .filter((p) => p.showInFooter)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

        setPages(footerPages);
      })
      .catch(() => setPages([]));
  }, [tenant?.slug]);

  const logoSrc = resolveLogo(tenant?.logoUrl, tenant?.slug);

  return (
    <footer className="bg-primary text-white text-sm py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-6 text-center">
        <div className="flex justify-center">
          {logoSrc && (
            <Image
              src={logoSrc}
              alt={tenant?.name || "Logo"}
              width={80}
              height={80}
              className="h-16 w-auto object-contain"
              unoptimized
            />
          )}
        </div>

        <nav className="flex flex-wrap justify-center gap-4">
          {pages.map((p) => (
            <Link
              key={p.slug}
              href={`/${tenant?.slug}/${p.slug}`}
              className="footer-menu text-gray-200 hover:text-accent transition"
            >
              {p.slug?.toUpperCase()}
            </Link>
          ))}
        </nav>

        <div className="space-y-1">
          <div>
            © {new Date().getFullYear()} {tenant?.name}
          </div>

          <div className="text-gray-200">
            Powered by{" "}
            <span className="font-semibold text-accent">
              Youth Rodeo Network
            </span>
          </div>

          <div className="text-gray-300">
            Built by{" "}
            <a
              href="https://kbdev.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white hover:underline"
            >
              KBDev Studio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}