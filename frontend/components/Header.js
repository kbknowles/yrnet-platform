// filepath: frontend/components/Header.js

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header
      className={`${
        isHome ? "absolute top-0 left-0 w-full bg-transparent" : "bg-ahsra-blue"
      } text-white z-50`}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Brand */}
        <Link href="/" className="font-bold tracking-wide">
          <span className="hidden md:inline text-lg">
            Alabama High School Rodeo Association
          </span>
          <span className="md:hidden text-lg">AHSRA</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/schedule">Schedule</Link>
          <Link href="/leadership">Leadership</Link>
          <Link href="/about">About</Link>
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
          <Link href="/schedule" onClick={() => setOpen(false)}>
            Schedule
          </Link>
          <Link href="/leadership" onClick={() => setOpen(false)}>
            Leadership
          </Link>
          <Link href="/about" onClick={() => setOpen(false)}>
            About
          </Link>
        </nav>
      )}
    </header>
  );
}
