// filepath: frontend/app/events/[slug]/PosterGallery.js
"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Zoom, Navigation } from "swiper/modules";
import { resolveTenantMedia } from "lib/media";

import "swiper/css";
import "swiper/css/zoom";
import "swiper/css/navigation";

/*
  Poster resolver using KBDev Engine media standard.

  Media structure:
  /uploads/tenants/{tenantSlug}/announcements/{announcementId}/{filename}

  DB stores filename only.
*/
function resolvePoster(filename, tenantSlug, id) {
  if (!filename) return null;

  return resolveTenantMedia({
    tenantSlug,
    folder: "announcements",
    filename,
    recordId: id,
  });
}

export default function PosterGallery({ posters = [], tenantSlug }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const safePosters = Array.isArray(posters) ? posters : [];

  return (
    <>
      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {safePosters.map((p, i) => {
          const src = resolvePoster(p.imageUrl, tenantSlug, p.id);

          return (
            <button
              key={p.id || i}
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
              className="border rounded overflow-hidden"
            >
              {src && (
                <img
                  src={src}
                  alt={p.title || "Poster"}
                  className="w-full h-[220px] object-contain block"
                />
              )}

              <div className="p-2 text-sm font-medium truncate">
                {p.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-white text-2xl z-50"
          >
            ✕
          </button>

          <Swiper
            modules={[Zoom, Navigation]}
            zoom
            navigation
            initialSlide={index}
            slidesPerView={1}
            className="w-full h-full"
          >
            {safePosters.map((p, i) => {
              const src = resolvePoster(p.imageUrl, tenantSlug, p.id);

              return (
                <SwiperSlide key={p.id || i}>
                  <div
                    className="swiper-zoom-container flex items-center justify-center h-full"
                    style={{ transform: "translateZ(0)" }}
                  >
                    {src && (
                      <img
                        src={src}
                        alt={p.title || "Poster"}
                        className="max-w-full max-h-full object-contain block"
                        style={{
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                        }}
                      />
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}
    </>
  );
}