"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryImage } from "@/lib/types/wedding";

type GalleryManagerProps = {
  images: GalleryImage[];
  onUpdate: () => Promise<void>;
};

export const GalleryManager = ({ images, onUpdate }: GalleryManagerProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("alt", "Wedding photo");

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        setMessage("Upload failed");
        return;
      }

      await onUpdate();
      setMessage("Photo uploaded successfully");
    } catch {
      setMessage("Upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (index: number) => {
    if (!confirm("Remove this photo from the gallery?")) return;

    const res = await fetch("/api/admin/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index }),
    });

    if (res.ok) {
      await onUpdate();
      setMessage("Photo removed");
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label className="inline-block cursor-pointer rounded-full bg-primary px-5 py-2 text-sm text-background">
          {isUploading ? "Uploading..." : "Upload Photo"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleUpload}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      {message && <p className="mb-4 text-sm text-green-600">{message}</p>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((image, index) => (
          <div key={`${image.src}-${index}`} className="group relative aspect-square overflow-hidden rounded-lg border border-accent/20">
            <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="200px" />
            <button
              type="button"
              onClick={() => handleDelete(index)}
              className="absolute right-2 top-2 rounded-full bg-red-500/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
