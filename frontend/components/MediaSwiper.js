// filepath: frontend/components/MediaSwiper.js
"use client";

/*
  MediaSwiper
  -------------------------------------------------------
  Reusable media gallery component used across KBDev
  vertical platforms (YRNet · LocalPulse · TravelLocal).

  Responsibilities
  • Display thumbnail grid
  • Open full-screen swiper viewer
  • Resolve tenant media paths using the KBDev media system

  Media architecture:

  /uploads/tenants/{tenantSlug}/{folder}/{filename}

  Examples:

  /uploads/tenants/ahsra/announcements/1719943321-poster.png
  /uploads/tenants/ahsra/gallery/1719944500-barrel.jpg
  /uploads/tenants/ahsra/sponsors/1719945011-logo.png

  Rules:

  • DB stores filename only
  • Upload middleware generates unique filenames
  • No recordId folders are used
  • Media folders are flat per tenant
*/

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Zoom, Navigation } from "swiper/modules";
import { resolveTenantMedia } from "lib/media";

import "swiper/css";
import "swiper/css/zoom";
import "swiper/css/navigation";

/*
  Resolve media source using shared resolver.

  folder defaults to "images" so the component can be
  reused for galleries, sponsors, announcements, etc.
*/
function resolveSrc(src, tenantSlug, folder = "images") {
  if (!src) return "";

  return resolveTenantMedia({
    tenantSlug,
    folder,
    filename: src,
  });
}

export default function MediaSwiper({
  items = [],
  thumbHeight = "h-[220px]",
  tenantSlug,
  folder = "images",
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const safeItems = Array.isArray(items) ? items : [];

  if (safeItems.length === 0) return null;

  return (
    <>
      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {safeItems.map((item, i) => {
          const src = resolveSrc(item.imageUrl, tenantSlug, folder);

          return (
            <button
              key={item.id || i}
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
              className="border rounded overflow-hidden"
            >
              {src && (
                <img
                  src={src}
                  alt={item.title || "Image"}
                  className={`w-full ${thumbHeight} object-contain block`}
                />
              )}

              {item.title && (
                <div className="p-2 text-sm font-medium truncate">
                  {item.title}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* MODAL VIEWER */}
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
            {safeItems.map((item, i) => {
              const src = resolveSrc(item.imageUrl, tenantSlug, folder);

              return (
                <SwiperSlide key={item.id || i}>
                  <div
                    className="swiper-zoom-container flex items-center justify-center h-full"
                    style={{ transform: "translateZ(0)" }}
                  >
                    {src && (
                      <img
                        src={src}
                        alt={item.title || "Image"}
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