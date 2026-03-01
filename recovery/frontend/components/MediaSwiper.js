// filepath: frontend/components/MediaSwiper.js
"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Zoom, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/zoom";
import "swiper/css/navigation";

const UPLOADS_BASE = process.env.NEXT_PUBLIC_UPLOADS_URL;

function resolveSrc(src) {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  return `${UPLOADS_BASE}${src}`;
}

export default function MediaSwiper({ items, thumbHeight = "h-[220px]" }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!items?.length) return null;

  return (
    <>
      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <button
            key={item.id || i}
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            className="border rounded overflow-hidden"
          >
            <img
              src={resolveSrc(item.imageUrl)}
              alt={item.title || "Image"}
              className={`w-full ${thumbHeight} object-contain block`}
            />
            {item.title && (
              <div className="p-2 text-sm font-medium truncate">
                {item.title}
              </div>
            )}
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
            {items.map((item, i) => (
              <SwiperSlide key={item.id || i}>
                <div
                  className="swiper-zoom-container flex items-center justify-center h-full"
                  style={{ transform: "translateZ(0)" }}
                >
                  <img
                    src={resolveSrc(item.imageUrl)}
                    alt={item.title || "Image"}
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
