// filepath: frontend/app/pages/[slug]/page.js

import { notFound } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function getPage(slug) {
  const res = await fetch(`${API_BASE}/api/pages/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function CustomPage({ params }) {
  const page = await getPage(params.slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold text-ahsra-blue">
        {page.title}
      </h1>

      <article className="prose max-w-none">
        <div
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </article>
    </main>
  );
}
