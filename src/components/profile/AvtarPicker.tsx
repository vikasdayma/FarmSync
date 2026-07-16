import React, { useState, useRef, useEffect, useCallback } from "react";
import { Check, Sprout, Camera, X, Loader2 } from "lucide-react";

const FARMERS = [
  { id: "0", role: "Tea farmer", src: "/avatars/farmer1.png" },
  { id: "1", role: "Wheat grower", src: "/avatars/farmer2.png" },
  { id: "2", role: "Coconut farmer", src: "/avatars/farmer3.png" },
  { id: "3", role: "Dairy and crop farmer", src: "/avatars/farmer4.png" },
  { id: "4", role: "SugarCane farmer", src: "/avatars/farmer5.png" },
  { id: "5", role: "Rice farmer", src: "/avatars/farmer6.png" },
  { id: "6", role: "Orchad keeper", src: "/avatars/farmer7.png" },
  { id: "7", role: "Cash Crops", src: "/avatars/farmer8.png" },
];

const MAX_FILE_BYTES = 5 * 1024 * 1024;

type AvatarPickerProps = {
  value?: string;
  onChange?: (url: string) => void;
  uploadUrl?: string;
};

function AvatarPicker({
  value,
  onChange,
  uploadUrl = "/api/profile/avatar",
}: AvatarPickerProps) {
  const presetIndexFromValue = FARMERS.findIndex((f) => f.src === value);

  const [selectedIndex, setSelectedIndex] = useState(
    presetIndexFromValue >= 0 ? presetIndexFromValue : 0,
  );
  const [customUrl, setCustomUrl] = useState(
    presetIndexFromValue === -1 && value ? value : "",
  );
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const savedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const showMessage = useCallback((text: string, type: "success" | "error") => {
    setMessage(text);
    setMessageType(type);
    if (messageTimeout.current) clearTimeout(messageTimeout.current);
    messageTimeout.current = setTimeout(() => setMessage(""), 4000);
  }, []);

  function handleFileSelect(file: File) {
    if (!file.type.startsWith("image/")) {
      showMessage("Only image files are allowed.", "error");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      showMessage("File size must be under 5MB.", "error");
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setSaved(false);
  }

  function handleCancelUpload() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function choosePreset(i: number) {
    handleCancelUpload();
    setCustomUrl("");
    setSelectedIndex(i);
    setSaved(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  }

  async function handleSave() {
    if (pendingFile) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", pendingFile);
        const res = await fetch(uploadUrl, {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          showMessage(data.message || "Upload failed. Try again.", "error");
          return;
        }
        const url = data.data.avatarUrl as string;
        setCustomUrl(url);
        handleCancelUpload();
        onChange?.(url);
        setSaved(true);
        savedTimeout.current && clearTimeout(savedTimeout.current);
        savedTimeout.current = setTimeout(() => setSaved(false), 2200);
      } catch {
        showMessage("Couldn't reach the server. Try again.", "error");
      } finally {
        setUploading(false);
      }
      return;
    }

    onChange?.(FARMERS[selectedIndex].src);
    setSaved(true);
    savedTimeout.current && clearTimeout(savedTimeout.current);
    savedTimeout.current = setTimeout(() => setSaved(false), 2200);
  }

  const displaySrc = previewUrl || customUrl || FARMERS[selectedIndex].src;
  const displayName =
    previewUrl || customUrl ? "Your photo" : FARMERS[selectedIndex].id;
  const displayRole = previewUrl
    ? "Ready to upload"
    : customUrl
      ? "Custom photo"
      : FARMERS[selectedIndex].role;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#122016] font-sans text-[#F4EEDC]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes shadowPulse { 0%, 100% { transform: scaleX(1); opacity: 0.5; } 50% { transform: scaleX(0.88); opacity: 0.35; } }
        @keyframes slideDown { 0% { transform: translateY(-8px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        .font-display { font-family: 'Fraunces', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* soil dot texture */}
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(#7C947318_1px,transparent_1px)] [background-size:26px_26px]" />

      <div className="relative mx-auto px-6 py-18">
        <div className="mb-10 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#C7F547]">
          <Sprout size={15} strokeWidth={2.4} />
          Field profile
        </div>

        <div className="flex flex-col items-center gap-10 text-center md:flex-row md:items-start md:gap-14 md:text-left">
          {/* LEFT: avatar + upload badge + preset strip */}
          <div className="flex c h-1/3 w-3/5 flex-shrink-0 flex-col items-center md:items-start">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className="relative h-1/3 w-[90%] sm:w-[40%] "
            >
              <div
                className={`flex h-full w-full items-center justify-center overflow-hidden rounded-[20px] ${
                  isDragging
                    ? "outline outline-2 outline-dashed outline-offset-4 outline-[#C7F547]"
                    : ""
                }`}
              >
                <img
                  src={displaySrc}
                  alt={displayName}
                  className="h-full w-full object-cover"
                  draggable={false}
                />

                {isDragging && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-[20px] bg-[#0C1710cc] text-center text-sm font-semibold text-[#C7F547]">
                    Drop photo to preview
                  </div>
                )}
              </div>

              {pendingFile && !isDragging && (
                <button
                  onClick={handleCancelUpload}
                  aria-label="Cancel upload"
                  className="absolute -right-2.5 -top-2.5 flex h-[30px] w-[30px] items-center justify-center rounded-full border-[3px] border-[#122016] bg-[#0C1710] text-[#F4EEDC] transition-colors hover:bg-[#E8836B]"
                >
                  <X size={15} strokeWidth={2.5} />
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                aria-label="Upload your own photo"
                className="absolute -bottom-2.5 -left-2.5 flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-[#122016] bg-[#C7F547] text-[#0C1710] transition-transform hover:scale-105 hover:bg-[#9BC22E]"
              >
                <Camera size={18} strokeWidth={2.3} />
              </button>
            </div>

            {/* ground shadow */}
            <div className="mx-auto m my-4 h-4 w-[240px] animate-[shadowPulse_4.5s_ease-in-out_infinite] rounded-full bg-black/30 blur-md md:ml-6 md:mr-0" />

            {/* preset strip, aligned under the avatar */}
            <div className="relative ">
              <div className="absolute left-0 right-0 top-1/2 h-8 sm:h-12 -translate-y-1/2 rounded-2xl bg-[repeating-linear-gradient(180deg,#5B413055_0px,#5B413055_3px,transparent_3px,transparent_13px)] opacity-45" />
              <div className="relative flex justify-center gap-3.5 overflow-x-auto px-1 py-3 [scrollbar-color:#3A4F3D_transparent] [scrollbar-width:thin] md:justify-start">
                {FARMERS.map((f, i) => {
                  const active =
                    !pendingFile && !customUrl && i === selectedIndex;
                  return (
                    <button
                      key={f.src}
                      onClick={() => choosePreset(i)}
                      aria-label={`Select ${f.id}`}
                      className={`flex-shrink-0 overflow-hidden rounded-full border-[2.5px] p-0 transition-all duration-200 hover:-translate-y-1 ${
                        active
                          ? "h-[62px] w-[62px] border-[#C7F547] shadow-[0_6px_16px_-4px_#C7F54755]"
                          : "h-[50px] w-[50px] border-[#3A4F3D] grayscale brightness-75"
                      }`}
                    >
                      <img
                        src={f.src}
                        alt=""
                        className="h-full w-full "
                        draggable={false}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: title, details, message, save */}
          <div className="flex min-w-0 flex-col items-center md:pt-1.5 md:items-start">
            <h1 className="font-display text-[clamp(28px,4vw,40px)] font-semibold tracking-tight text-[#F4EEDC]">
              Choose your farmer
            </h1>
            <p className="mt-2.5 mb-6 text-[15px] text-[#C9C3AE]">
              Pick an avatar, or upload your own photo.
            </p>

            {message && (
              <div
                className={`mb-5 animate-[slideDown_0.2s_ease] rounded-[10px] border px-4 py-2.5 text-[13px] font-medium ${
                  messageType === "success"
                    ? "border-[#C7F54755] bg-[#C7F54722] text-[#C7F547]"
                    : "border-[#E8836B55] bg-[#E8836B22] text-[#E8836B]"
                }`}
              >
                {message}
              </div>
            )}

            <h2 className="font-display text-[22px] font-semibold text-[#F4EEDC]">
              {displayRole}
            </h2>
   

            <button
              onClick={handleSave}
              disabled={uploading}
              className="flex items-center gap-2 rounded-full bg-[#C7F547] px-7 py-3 text-[15px] font-bold text-[#0C1710] shadow-[0_10px_24px_-8px_#C7F54766] transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {uploading ? (
                <>
                  <Loader2 size={17} strokeWidth={3} className="animate-spin" />
                  Uploading...
                </>
              ) : saved ? (
                <>
                  <Check size={17} strokeWidth={3} />
                  Avatar saved
                </>
              ) : (
                "Save this avatar"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AvatarPicker