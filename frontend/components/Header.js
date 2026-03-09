// filepath: frontend/components/Header.js
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const STATIC_LINKS = [
  { title: "Home", href: "/" },
  { title: "Athletes", href: "/athletes" },
  { title: "Schedule", href: "/schedule" },
  { title: "Gallery", href: "/gallery" },
  { title: "Sponsors", href: "/sponsors" },
  { title: "Leadership", href: "/leadership" },
];

function resolveLogo(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;

  const clean = url.replace(/^\/+/, "");
  return `${API_BASE}/${clean}`;
}

export default function Header({ tenant }) {
  const [open, setOpen] = useState(false);
  const [pages, setPages] = useState([]);
  const pathname = usePathname();

  const tenantSlug = useMemo(() => {
    if (tenant?.slug) return tenant.slug;
    const seg = (pathname || "").split("/").filter(Boolean)[0];
    return seg || null;
  }, [tenant?.slug, pathname]);

  const basePath = tenantSlug ? `/${tenantSlug}` : "";

  const isHome = useMemo(() => {
    if (!pathname) return false;
    if (tenantSlug) return pathname === basePath;
    return pathname === "/";
  }, [pathname, tenantSlug, basePath]);

  const buildHref = (href) => {
    if (!tenantSlug) return href;
    if (href === "/") return basePath;
    return `${basePath}${href}`;
  };

  useEffect(() => {
    if (!tenantSlug) return;

    fetch(`${API_BASE}/${tenantSlug}/pages`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        const menuPages = (Array.isArray(data) ? data : [])
          .filter((p) => p.showInMenu)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        setPages(menuPages);
      })
      .catch(() => setPages([]));
  }, [tenantSlug]);

  const logoSrc = resolveLogo(tenant?.logoUrl);
  const fullName = tenant?.name || "";
  const shortName = tenant?.shortName || "";

  return (
    <header
      className={`${
        isHome ? "absolute top-0 left-0 w-full bg-transparent" : "bg-slate-900"
      } text-white z-50`}
    >
      <div className="hero max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {!isHome ? (
          <Link
            href={buildHref("/")}
            className="flex items-center gap-3 font-semibold tracking-wide"
          >
            {logoSrc && (
              <Image
                src={logoSrc}
                alt={fullName || "logo"}
                width={40}
                height={40}
                priority
                unoptimized
              />
            )}

            {fullName && (
              <>
                <span className="hidden lg:inline text-lg">{fullName}</span>
                {shortName && (
                  <span className="lg:hidden text-lg">{shortName}</span>
                )}
              </>
            )}
          </Link>
        ) : (
          <div />
        )}

        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {STATIC_LINKS.map((l) => (
            <Link key={l.href} href={buildHref(l.href)}>
              {l.title}
            </Link>
          ))}

          {pages.map((p) => (
            <Link key={p.slug} href={`${basePath}/${p.slug}`}>
              {p.title}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="md:hidden text-xl"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {open && (
        <nav
          className={`md:hidden px-4 pb-4 flex flex-col gap-3 text-sm ${
            isHome ? "bg-black/80" : "bg-secondary"
          }`}
        >
          {[
            ...STATIC_LINKS.map((l) => ({
              title: l.title,
              href: buildHref(l.href),
            })),
            ...pages.map((p) => ({
              title: p.title,
              href: `${basePath}/${p.slug}`,
            })),
          ].map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.title}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}