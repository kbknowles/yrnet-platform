// filepath: frontend/components/Header.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [pages, setPages] = useState([]);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    fetch(`${API_BASE}/api/pages`)
      .then((res) => res.json())
      .then((data) => setPages(data.filter((p) => p.showInMenu)));
  }, []);

  return (
    <header
      className={`${
        isHome
          ? "absolute top-0 left-0 w-full bg-transparent"
          : "bg-ahsra-blue"
      } text-white z-50`}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Brand */}
        {!isHome ? (
          <Link href="/" className="font-bold tracking-wide">
            <span className="hidden md:inline text-lg">
              Alabama High School Rodeo Association
            </span>
            <span className="md:hidden text-lg">AHSRA</span>
          </Link>
        ) : (
          <div />
        )}

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/">Home</Link>
          <Link href="/schedule">Schedule</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/leadership">Leadership</Link>

          {pages.map((p) => (
            <Link key={p.slug} href={`/${p.slug}`}>
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
            isHome ? "bg-black/80" : "bg-ahsra-blue"
          }`}
        >
          <Link href="/" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link href="/schedule" onClick={() => setOpen(false)}>
            Schedule
          </Link>
          <Link href="/gallery" onClick={() => setOpen(false)}>
            Gallery
          </Link>
          <Link href="/leadership" onClick={() => setOpen(false)}>
            Leadership
          </Link>

          {pages.map((p) => (
            <Link
              key={p.slug}
              href={`/${p.slug}`}
              onClick={() => setOpen(false)}
            >
              {p.title}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
