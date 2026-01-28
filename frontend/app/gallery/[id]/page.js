import Link from "next/link";



export default async function GalleryPage() {
const API_BASE= process.env.NEXT_PUBLIC_API_URL;
  const albums = await fetch(`${API_BASE}/api/gallery`, {
    cache: "no-store",
  }).then((r) => r.json());

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-bold text-ahsra-blue">
        Photo Gallery
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {albums.map((album) => (
          <Link
            key={album.id}
            href={`/gallery/${album.id}`}
            className="block group"
          >
            <img
              src={album.images[0]?.imageUrl}
              className="rounded group-hover:opacity-90"
            />
            <div className="mt-2 font-medium">
              {album.title}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
