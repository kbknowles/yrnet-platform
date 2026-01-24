"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-ahsra-blue text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="font-bold text-lg">
          AHSRA
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/schedule">Schedule</Link>
          <Link href="/leadership">Leadership</Link>
          <Link href="/sponsors">Sponsors</Link>
          <Link href="/about">About</Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={
                open
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <nav className="md:hidden bg-ahsra-blue border-t border-white/20">
          <div className="px-4 py-4 flex flex-col gap-4 text-sm font-medium">
            <Link href="/schedule" onClick={() => setOpen(false)}>
              Schedule
            </Link>
            <Link href="/leadership" onClick={() => setOpen(false)}>
              Leadership
            </Link>
            <Link href="/sponsors" onClick={() => setOpen(false)}>
              Sponsors
            </Link>
            <Link href="/about" onClick={() => setOpen(false)}>
              About
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
