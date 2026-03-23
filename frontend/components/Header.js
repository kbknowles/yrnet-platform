// filepath: frontend/components/Header.js
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { resolveTenantMedia } from "lib/media";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const STATIC_LINKS = [
  { title: "Home", href: "/" },
  { title: "Athletes", href: "/athletes" },
  { title: "Schedule", href: "/schedule" },
  { title: "Gallery", href: "/gallery" },
  { title: "Sponsors", href: "/sponsors" },
  { title: "Documents", href: "/documents" },
];

function label(slug) {
  if (!slug) return "";
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export default function Header({ tenant }) {
  const [open, setOpen] = useState(false);
  const [pages, setPages] = useState([]);
  const pathname = usePathname();

  /*
    Detect if app is running under /tenantSlug (Render)
    OR root domain (custom domain)
  */
  const tenantSlug = tenant?.slug || null;

  const isSubpathDeployment = useMemo(() => {
    if (!pathname || !tenantSlug) return false;
    return pathname.startsWith(`/${tenantSlug}`);
  }, [pathname, tenantSlug]);

  /*
    Build correct base path dynamically
    - Render: /ahsra
    - Custom domain: ""
  */
  const basePath = isSubpathDeployment ? `/${tenantSlug}` : "";

  const isHome = useMemo(() => {
    if (!pathname) return false;
    return pathname === `${basePath}/` || pathname === basePath || pathname === "/";
  }, [pathname, basePath]);

  const buildHref = (href) => {
    if (href === "/") return basePath || "/";
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

  const logoSrc =
    tenant?.logoUrl && tenantSlug
      ? resolveTenantMedia({
          tenantSlug,
          folder: "images",
          filename: tenant.logoUrl,
        })
      : null;

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
                width={48}
                height={48}
                className="h-10 w-auto object-contain"
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
            <Link key={p.slug} href={buildHref(`/${p.slug}`)}>
              {label(p.slug)}
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
              title: label(p.slug),
              href: buildHref(`/${p.slug}`),
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