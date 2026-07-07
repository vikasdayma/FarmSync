// components/AvatarPicker.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

const PRESET_AVATARS = [
  '/avtar.png',
   '/avtar2.png',
      '/avtar3.jpg'
  // add more URLs here...
];

interface AvatarPickerProps {
  currentAvatar?: string;
  onSave: (url: string) => void;
}

export default function AvatarPicker({ currentAvatar, onSave }: AvatarPickerProps) {
  const [selected, setSelected] = useState<string | null>(currentAvatar ?? null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!selected) return;
    setLoading(true);
    await onSave(selected); // sends URL to parent
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Choose an Avatar</h2>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {PRESET_AVATARS.map((url) => (
          <div
            key={url}
            onClick={() => setSelected(url)}
            className={`cursor-pointer rounded-full border-4 transition-all ${
              selected === url
                ? "border-green-500 scale-105"
                : "border-transparent"
            }`}
          >
            <Image
              src={url}
              alt="avatar"
              width={80}
              height={80}
              className="rounded-full object-cover w-full h-full"
            />
          </div>
        ))}
      </div>

      {/* Preview */}
      {selected && (
        <div className="flex items-center gap-3 mb-4">
          <Image src={selected} alt="preview" width={48} height={48} className="rounded-full" />
          <span className="text-sm text-gray-500">Selected avatar</span>
        </div>
      )}

      {/* Confirm Button */}
      <button
        onClick={handleSave}
        disabled={!selected || loading}
        className="w-full bg-green-600 text-white py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Saving..." : "Confirm Avatar"}
      </button>
    </div>
  );
}