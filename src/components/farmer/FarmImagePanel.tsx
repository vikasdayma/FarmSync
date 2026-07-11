"use client";

import { useState, useRef } from "react";
import { Poppins } from "next/font/google";
import { TaskCard } from "./TaskCard"
// import { StatCard } from "./StatCard";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
});

// ...RadialGauge, MapPin, MapChip functions stay exactly the same...

export default function FarmImagePanel() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // local preview immediately
    const localUrl = URL.createObjectURL(file);
    setImageUrl(localUrl);

    // upload to server
    uploadFile(file);
  }

  async function uploadFile(file: File) {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/image", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setImageUrl(data.url); // swap local preview for real hosted URL
    } catch (err) {
      console.error(err);
      // optionally: toast.error("Failed to upload farm image")
    } finally {
      setIsUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setImageUrl(localUrl);
    uploadFile(file);
  }

  // ===== Empty state: no image yet =====
  if (!imageUrl) {
    return (
      <div className="relative hidden h-full lg:flex lg:items-center lg:justify-center lg:bg-[#EDF3E8]">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="flex w-[80%] max-w-xs cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-[#142B1D]/20 bg-white/60 px-6 py-10 text-center transition-colors hover:border-[#142B1D]/40 hover:bg-white/80"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#142B1D]/8">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-6 w-6 text-[#142B1D]/50"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#142B1D]">
              Upload farm map image
            </p>
            <p className="mt-1 text-xs text-[#142B1D]/45">
              Drag &amp; drop or click to browse
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>
    );
  }

  // ===== Image uploaded: show it with map overlays =====
  return (
    <div className="relative hidden lg:block">
      <img
        src={imageUrl}
        alt="Farm map"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-xs font-medium text-white">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Uploading...
          </div>
        </div>
      )}

      <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3.5 py-2 text-[12px] font-medium text-white backdrop-blur-md">
        Map
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {/* Change image button — replaces old fullscreen button slot */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        aria-label="Change image"
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/55"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      </button>

      {/* <MapPin color="#E5583B" className="right-[22%] top-[16%]" />
      <MapChip className="right-[8%] top-[20%]">2 plots need attention</MapChip>

      <MapPin color="#F2C94C" className="left-[16%] top-[42%]" />
      <MapChip className="left-[6%] top-[47%]">Moisture: 68%</MapChip>

      <MapPin color="#7BC96F" className="left-[24%] bottom-[16%]" />
      <MapChip className="left-[24%] bottom-[10%]">Healthy: 92%</MapChip> */}

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

      {/* mini-map thumbnail */}
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

