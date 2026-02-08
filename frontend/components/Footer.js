// filepath: frontend/components/Footer.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function Footer() {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/pages`)
      .then((res) => res.json())
      .then((data) => {
        const footerPages = data
          .filter((p) => p.showInFooter)
          .sort((a, b) => (a.menuOrder ?? 0) - (b.menuOrder ?? 0));
        setPages(footerPages);
      });
  }, []);

  return (
    <footer className="bg-gray-900 text-white text-sm py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-4 text-center">
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
            © {new Date().getFullYear()} Alabama High School Rodeo Association
          </div>
          <div className="text-gray-400">
            Built by{" "}
            <a
              href="http://kbdev.app"
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
