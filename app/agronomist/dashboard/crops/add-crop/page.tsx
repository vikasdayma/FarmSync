"use client";

import { useState, useRef } from "react";
import {
  Sprout,
  FlaskConical,
  Tag,
  CloudSun,
  FileText,
  ImagePlus,
  Loader2,
  CheckCircle2,
  Layers,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type CropFormState = {
  name: string;
  scientificName: string;
  category: string;
  season: string;
  description: string;
};

const initialState: CropFormState = {
  name: "",
  scientificName: "",
  category: "",
  season: "",
  description: "",
};

export default function CreateCropForm() {
  const [form, setForm] = useState<CropFormState>(initialState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router =useRouter();
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, imageUrl: "Please select an image file" }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, imageUrl: "Image must be under 5MB" }));
      return;
    }

    setErrors((prev) => {
      const next = { ...prev };
      delete next.imageUrl;
      return next;
    });

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload/image", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Image upload failed");
    }

    const data = await res.json();
    return data.url; // matches { url: result.secure_url } from your Cloudinary route
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    setSuccess(false);
    

    const fieldErrors: Record<string, string> = {};
    if (form.name.trim().length < 2) fieldErrors.name = "Name must be at least 2 characters";
    if (form.category.trim().length < 2) fieldErrors.category = "Category must be at least 2 characters";
    if (form.season.trim().length < 2) fieldErrors.season = "Season must be at least 2 characters";
    if (form.description.length > 500) fieldErrors.description = "Description must be under 500 characters";

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      let imageUrl: string | undefined;

      if (imageFile) {
        setUploadingImage(true);
        try {
          imageUrl = await uploadImage(imageFile);
        } finally {
          setUploadingImage(false);
        }
      }

      const payload = {
        name: form.name.trim(),
        category: form.category.trim(),
        season: form.season.trim(),
        ...(form.scientificName.trim() && { scientificName: form.scientificName.trim() }),
        ...(form.description.trim() && { description: form.description.trim() }),
        ...(imageUrl && { imageUrl }),
      };

      const res = await fetch("/api/crops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.errors) {
          const parsed: Record<string, string> = {};
          Object.entries(data.errors).forEach(([k, v]) => {
            parsed[k] = Array.isArray(v) ? v[0] : String(v);
          });
          setErrors(parsed);
        } else {
          setServerError(data?.message || "Failed to create crop");
        }
        return;
      }

      setSuccess(true);
      setForm(initialState);
      toast('Crop Added Successfully')
    router.push('/agronomist/dashboard/crops')
      removeImage();
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const mono = { fontFamily: "ui-monospace, 'SF Mono', 'JetBrains Mono', monospace" };
  const isBusy = loading || uploadingImage;

  return (
    <div className="min-h-screen bg-[#F7F4EE] p-5 sm:p-8">
    
      <div className="mx-auto max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-lg border border-[#2B2620]/[0.08] bg-white"
        >
          {/* Header */}
          <div className="border-b border-[#2B2620]/[0.08] px-7 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#B5502E]/10">
                <Sprout className="h-[18px] w-[18px] text-[#B5502E]" />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#B5502E]">
                  Crop Catalog
                </p>
                <h1 className="text-[19px] font-semibold text-[#2B2620]">
                  Add New Crop
                </h1>
              </div>
            </div>
          </div>

          <div className="space-y-6 px-7 py-7">
            {serverError && (
              <div className="rounded-md border border-[#A63B32]/25 bg-[#A63B32]/[0.06] px-4 py-3 text-[13px] text-[#A63B32]">
                {serverError}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 rounded-md border border-[#5C6B4E]/25 bg-[#7C8A6E]/[0.08] px-4 py-3 text-[13px] text-[#5C6B4E]">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Crop created and added to the catalog.
              </div>
            )}

            {/* Image picker */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[13px] font-medium text-[#2B2620]">
                <ImagePlus className="h-3.5 w-3.5 text-[#2B2620]/35" />
                Crop Image
                <span className="text-[11px] font-normal text-[#2B2620]/35">optional</span>
              </label>

              {imagePreview ? (
                <div className="relative overflow-hidden rounded-lg border border-[#2B2620]/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Crop preview"
                    className="h-44 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    disabled={isBusy}
                    className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/75 disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-3 py-2">
                    <p className="truncate text-[11.5px] text-white/90" style={mono}>
                      {imageFile?.name}
                    </p>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="crop-image"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#2B2620]/15 bg-[#FAF8F3] px-4 py-8 text-center transition hover:border-[#B5502E]/40 hover:bg-[#B5502E]/[0.02]"
                >
                  <ImagePlus className="h-6 w-6 text-[#2B2620]/25" />
                  <span className="text-[13px] text-[#2B2620]/55">
                    <span className="font-medium text-[#B5502E]">Choose an image</span> or
                    drag and drop
                  </span>
                  <span className="text-[11px] text-[#2B2620]/35">
                    PNG or JPG, up to 5MB
                  </span>
                  <input
                    ref={fileInputRef}
                    id="crop-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </label>
              )}
              {errors.imageUrl && (
                <p className="text-[12px] text-[#A63B32]">{errors.imageUrl}</p>
              )}
            </div>

            {/* Name + Scientific Name */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[13px] font-medium text-[#2B2620]">
                  <Tag className="h-3.5 w-3.5 text-[#2B2620]/35" />
                  Crop Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Soybean"
                  className="w-full rounded-md border border-[#2B2620]/12 bg-[#FAF8F3] px-3.5 py-2.5 text-sm text-[#2B2620] outline-none transition focus:border-[#B5502E]/50 focus:bg-white focus:ring-4 focus:ring-[#B5502E]/8"
                />
                {errors.name && (
                  <p className="text-[12px] text-[#A63B32]">{errors.name}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[13px] font-medium text-[#2B2620]">
                  <FlaskConical className="h-3.5 w-3.5 text-[#2B2620]/35" />
                  Scientific Name
                  <span className="text-[11px] font-normal text-[#2B2620]/35">optional</span>
                </label>
                <input
                  name="scientificName"
                  value={form.scientificName}
                  onChange={handleChange}
                  placeholder="e.g. Glycine max"
                  style={mono}
                  className="w-full rounded-md border border-[#2B2620]/12 bg-[#FAF8F3] px-3.5 py-2.5 text-[13px] italic text-[#2B2620] outline-none transition focus:border-[#B5502E]/50 focus:bg-white focus:ring-4 focus:ring-[#B5502E]/8"
                />
                {errors.scientificName && (
                  <p className="text-[12px] text-[#A63B32]">{errors.scientificName}</p>
                )}
              </div>
            </div>

            {/* Category + Season */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[13px] font-medium text-[#2B2620]">
                  <Layers className="h-3.5 w-3.5 text-[#2B2620]/35" />
                  Category
                </label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Cereal, Pulse, Oilseed"
                  list="category-suggestions"
                  className="w-full rounded-md border border-[#2B2620]/12 bg-[#FAF8F3] px-3.5 py-2.5 text-sm text-[#2B2620] outline-none transition focus:border-[#B5502E]/50 focus:bg-white focus:ring-4 focus:ring-[#B5502E]/8"
                />
                <datalist id="category-suggestions" className=" ">
                  <option value="Cereal" className="" />
                  <option value="Pulse" />
                  <option value="Oilseed" />
                  <option value="Vegetable" />
                  <option value="Fruit" />
                  <option value="Fiber" />
                  <option value="Spice" />
                </datalist>
                {errors.category && (
                  <p className="text-[12px] text-[#A63B32]">{errors.category}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[13px] font-medium text-[#2B2620]">
                  <CloudSun className="h-3.5 w-3.5 text-[#2B2620]/35" />
                  Season
                </label>
                <input
                  name="season"
                  value={form.season}
                  onChange={handleChange}
                  placeholder="e.g. Kharif, Rabi, Zaid"
                  list="season-suggestions"
                  className="w-full rounded-md border border-[#2B2620]/12 bg-[#FAF8F3] px-3.5 py-2.5 text-sm text-[#2B2620] outline-none transition focus:border-[#B5502E]/50 focus:bg-white focus:ring-4 focus:ring-[#B5502E]/8"
                />
                <datalist id="season-suggestions">
                  <option value="Kharif" />
                  <option value="Rabi" />
                  <option value="Zaid" />
                  <option value="Perennial" />
                </datalist>
                {errors.season && (
                  <p className="text-[12px] text-[#A63B32]">{errors.season}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-[13px] font-medium text-[#2B2620]">
                  <FileText className="h-3.5 w-3.5 text-[#2B2620]/35" />
                  Description
                  <span className="text-[11px] font-normal text-[#2B2620]/35">optional</span>
                </label>
                <span
                  className={`text-[11px] ${
                    form.description.length > 500 ? "text-[#A63B32]" : "text-[#2B2620]/30"
                  }`}
                  style={mono}
                >
                  {form.description.length}/500
                </span>
              </div>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Growing notes, common uses, regional relevance..."
                className="w-full resize-none rounded-md border border-[#2B2620]/12 bg-[#FAF8F3] px-3.5 py-2.5 text-sm text-[#2B2620] outline-none transition focus:border-[#B5502E]/50 focus:bg-white focus:ring-4 focus:ring-[#B5502E]/8"
              />
              {errors.description && (
                <p className="text-[12px] text-[#A63B32]">{errors.description}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isBusy}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#2B2620] py-3 text-[14px] font-medium text-white transition hover:bg-[#1C1813] disabled:opacity-50"
            >
              {uploadingImage ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading Image...
                </>
              ) : loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding Crop...
                </>
              ) : (
                "Add Crop to Catalog"
              )}
            </button>
            <p className="text-center text-[11.5px] text-[#2B2620]/35">
              Visible to all farmers immediately after creation
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}