// filepath: frontend/components/Header.js
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const STATIC_LINKS = [
  { title: "Home", href: "" },
  { title: "Athletes", href: "athletes" },
  { title: "Schedule", href: "schedule" },
  { title: "Gallery", href: "gallery" },
  { title: "Sponsors", href: "sponsors" },
  { title: "Leadership", href: "leadership" },
];

export default function Header({ tenant }) {
  const [open, setOpen] = useState(false);
  const [pages, setPages] = useState([]);
  const pathname = usePathname();

  const tenantSlug = tenant?.slug;

  const basePath = useMemo(() => {
    if (!tenantSlug) return "/";
    return `/${tenantSlug}`;
  }, [tenantSlug]);

  const isHome = pathname === basePath;

  useEffect(() => {
    if (!tenantSlug) return;

    fetch(`${API_BASE}/api/${tenantSlug}/pages`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        const menuPages = (Array.isArray(data) ? data : [])
          .filter((p) => p.showInMenu)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        setPages(menuPages);
      })
      .catch(() => setPages([]));
  }, [tenantSlug]);

  const logoSrc =
    tenant?.logoUrl?.startsWith("http")
      ? tenant.logoUrl
      : tenant?.logoUrl
      ? `${API_BASE}${tenant.logoUrl}`
      : null;

  const buildHref = (path) => {
    if (!tenantSlug) return "/";
    if (!path) return basePath;
    return `${basePath}/${path}`;
  };

  return (
    <header
      className={`${
        isHome
          ? "absolute top-0 left-0 w-full bg-transparent"
          : "bg-slate-900"
      } text-white z-50`}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Brand */}
        <Link
          href={buildHref("")}
          className="flex items-center gap-3 font-bold tracking-wide"
        >
          {logoSrc && (
            <Image
              src={logoSrc}
              alt={tenant?.name || "Association"}
              width={40}
              height={40}
              priority
            />
          )}

          <span className="hidden lg:inline text-lg">
            {tenant?.name}
          </span>

          <span className="lg:hidden text-lg">
            {tenant?.shortName || tenant?.name}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {STATIC_LINKS.map((l) => (
            <Link key={l.title} href={buildHref(l.href)}>
              {l.title}
            </Link>
          ))}

          {pages.map((p) => (
            <Link key={p.slug} href={buildHref(p.slug)}>
              {p.title}
            </Link>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="md:hidden text-xl"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <nav
          className={`md:hidden px-4 pb-4 flex flex-col gap-3 text-sm ${
            isHome ? "bg-black/80" : "bg-slate-900"
          }`}
        >
          {[...STATIC_LINKS, ...pages.map((p) => ({
            title: p.title,
            href: p.slug,
          }))].map((l) => (
            <Link
              key={l.title}
              href={buildHref(l.href)}
              onClick={() => setOpen(false)}
            >
              {l.title}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}