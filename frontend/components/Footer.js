// filepath: frontend/components/Footer.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function Footer({ tenant }) {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    if (!tenant?.slug) return;

    fetch(`${API_BASE}/api/pages?tenant=${tenant.slug}`)
      .then((res) => res.json())
      .then((data) => {
        const footerPages = (Array.isArray(data) ? data : [])
          .filter((p) => p.showInFooter)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

        setPages(footerPages);
      });
  }, [tenant?.slug]);

  return (
    <footer className="bg-gray-900 text-white text-sm py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-6 text-center">
        {/* Logo */}
        <div className="flex justify-center">
          {tenant?.logoUrl ? (
            <Image
              src={
                tenant.logoUrl.startsWith("http")
                  ? tenant.logoUrl
                  : `${API_BASE}${tenant.logoUrl}`
              }
              alt={tenant.name}
              width={60}
              height={60}
            />
          ) : null}
        </div>

        {/* Footer Nav */}
        <nav className="flex flex-wrap justify-center gap-4">
          {pages.map((p) => (
            <Link
              key={p.slug}
              href={`/${p.slug}`}
              className="text-gray-300 hover:text-white"
            >
              {p.title}
            </Link>
          ))}
        </nav>

        <div className="space-y-1">
          <div>
            © {new Date().getFullYear()} {tenant?.name}
          </div>
          <div className="text-gray-400">
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