"use client";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function GalleryReorder({ albumId, images = [] }) {
  const [items, setItems] = useState(images);

  useEffect(() => {
    setItems(Array.isArray(images) ? images : []);
  }, [images]);

  async function onDragEnd(e) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const updated = arrayMove(items, oldIndex, newIndex).map((img, idx) => ({
      ...img,
      sortOrder: idx,
    }));

    setItems(updated);

    await fetch(
      `${API_BASE}/api/admin/gallery/albums/${albumId}/reorder`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          updated.map(({ id, sortOrder }) => ({ id, sortOrder }))
        ),
      }
    );
  }

  if (!items.length) return null;

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="space-y-2">
          {items.map((img) => (
            <li
              key={img.id}
              className="border p-2 bg-white cursor-move"
            >
              {img.caption || "Image"}
            </li>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}