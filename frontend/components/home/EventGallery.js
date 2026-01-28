import GalleryCarousel from "./GalleryCarousel";

export default function EventGallery({ albums = [] }) {
  if (!albums.length) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold text-ahsra-blue mb-6 text-center">
        Rodeo Highlights
      </h2>

      <GalleryCarousel albums={albums} />
    </section>
  );
}
