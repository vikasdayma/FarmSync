"use client";

import { useEffect, useRef, useState } from "react";
import { ImageUp } from "lucide-react";
import MapPin from "./MapPin";
import MapChip from "./MapChip";

const STORAGE_KEY = "farm-map-preview-image";

// Resizes/compresses the image client-side before storing, so large
// phone photos don't blow past localStorage's ~5-10MB quota.
function compressImage(file: File, maxWidth = 1600, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function FarmMapPreview() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Load any previously saved image on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setPreviewImage(saved);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file);
      setPreviewImage(compressed);
      localStorage.setItem(STORAGE_KEY, compressed);
    } catch (err) {
      if (err instanceof DOMException && err.name === "QuotaExceededError") {
        alert("Image is too large to store locally. Try a smaller photo.");
      } else {
        console.error("Failed to process image:", err);
      }
    }
  };

  return (
    <div className="relative hidden lg:block">
      <img
        src={
          previewImage ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6z7fqbRAmVOo0WFJP73Eiekx3fFS-ik7C2UuU3UprLA&s=10"
        }
        className="absolute inset-0 h-full w-full object-cover"
        alt="Farm map"
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {!previewImage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-full bg-black/50 px-5 py-3 text-[13px] font-medium text-white backdrop-blur-md transition-colors hover:bg-black/65"
          >
            <ImageUp className="h-4 w-4" />
            Upload your image
          </button>
        </div>
      )}

      {previewImage && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/40 px-3.5 py-2 text-[12px] font-medium text-white backdrop-blur-md hover:bg-black/55"
        >
          <ImageUp className="h-3.5 w-3.5" />
          Change image
        </button>
      )}
  <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3.5 py-2 text-[12px] font-medium text-white backdrop-blur-md">
        Map
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      <button
        aria-label="Fullscreen"
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/55"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
          <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" />
        </svg>
      </button>

      <MapPin color="#E5583B" className="right-[22%] top-[16%]" />
      <MapChip className="right-[8%] top-[20%]">2 plots need attention</MapChip>

      <MapPin color="#F2C94C" className="left-[16%] top-[42%]" />
      <MapChip className="left-[6%] top-[47%]">Moisture: 68%</MapChip>

      <MapPin color="#7BC96F" className="left-[24%] bottom-[16%]" />
      <MapChip className="left-[24%] bottom-[10%]">Healthy: 92%</MapChip>

      {/* zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col items-center gap-2">
        <button
          aria-label="Recenter"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/55"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          </svg>
        </button>
        <div className="flex flex-col overflow-hidden rounded-full bg-black/40 backdrop-blur-md">
          <button
            aria-label="Zoom in"
            className="flex h-9 w-9 items-center justify-center text-white hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          <div className="h-px w-5 self-center bg-white/25" />
          <button
            aria-label="Zoom out"
            className="flex h-9 w-9 items-center justify-center text-white hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <path d="M5 12h14" />
            </svg>
          </button>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 h-20 w-20 overflow-hidden rounded-xl border-2 border-white/70 shadow-lg">
        <div className="flex h-full w-full items-center justify-center bg-[#4C7A3D] text-[9px] text-white/70">
          mini map
        </div>
        <button
          aria-label="Refresh map"
          className="absolute bottom-1 left-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3">
            <path d="M4 4v5h5M20 20v-5h-5M4 9a8 8 0 0114-5M20 15a8 8 0 01-14 5" />
          </svg>
        </button>
      </div>   
    </div>
  );
}