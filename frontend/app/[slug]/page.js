// filepath: frontend/app/[slug]/page.js

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function getPage(slug) {
  const res = await fetch(
    `${API_BASE}/api/pages/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function PublicPage({ params }) {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold">Page not found</h1>
      </main>
    );
  }

  return (
    <main className="bg-white">
      {/* Page Header */}
      <section className="border-b">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-ahsra-blue">
            {page.title}
          </h1>
        </div>
      </section>

      {/* Page Content */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <article className="prose prose-lg max-w-none">
          <div
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </article>
      </section>
    </main>
  );
}
