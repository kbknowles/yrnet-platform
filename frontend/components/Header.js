// filepath: frontend/components/Header.js

"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-ahsra-blue text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-lg">
          AHSRA
        </Link>

        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/schedule">Schedule</Link>
          <Link href="/leadership">Leadership</Link>
          <Link href="/about">About</Link>
        </nav>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle Menu"
        >
          ☰
        </button>
      </div>

      {open && (
        <nav className="md:hidden px-4 pb-4 flex flex-col gap-3 text-sm">
          <Link href="/schedule" onClick={() => setOpen(false)}>Schedule</Link>
          <Link href="/leadership" onClick={() => setOpen(false)}>Leadership</Link>
          <Link href="/about" onClick={() => setOpen(false)}>About</Link>
        </nav>
      )}
    </header>
  );
}
