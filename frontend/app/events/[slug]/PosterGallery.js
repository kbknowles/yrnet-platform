// filepath: frontend/app/events/[slug]/PosterGallery.js
"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Zoom, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/zoom";
import "swiper/css/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function PosterGallery({ posters }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <>
      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posters.map((p, i) => (
          <button
            key={p.id}
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            className="border rounded overflow-hidden"
          >
            <img
              src={`${API_BASE}${p.imageUrl}`}
              alt={p.title}
              className="w-full h-[220px] object-contain block"
            />
            <div className="p-2 text-sm font-medium truncate">
              {p.title}
            </div>
          </button>
        ))}
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
            {posters.map((p) => (
              <SwiperSlide key={p.id}>
                <div
                  className="swiper-zoom-container flex items-center justify-center h-full"
                  style={{ transform: "translateZ(0)" }} // 🔑 iOS repaint
                >
                  <img
                    src={`${API_BASE}${p.imageUrl}`}
                    alt={p.title}
                    className="max-w-full max-h-full object-contain block"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </>
  );
}
