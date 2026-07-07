"use client";
import { useState } from "react";
import { CreateMarketplaceListing } from "@/types/marketplace";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createProduct, useCreateProduct } from "@/lib/api/marketplace";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthProvider";
import { Trash2 } from "lucide-react";
import "./AddProduct.css";
import { IoIosArrowRoundBack } from "react-icons/io";
import {
  FARMER_CATEGORIES,
  UNITS,
  SUPPLIER_CATEGORIES,
} from "@/constants/items";
import Link from "next/link";

const AddProduct = () => {
  const { user } = useAuth();
  const role = user?.role;
 const { mutate: createProductMutate, isPending, error } = useCreateProduct()
  const [form, setForm] = useState<CreateMarketplaceListing>({
    title: "",
    description: "",
    category: "",
    pricePerUnit: 0,
    unit: "",
    quantityAvailable: 0,
    location: "",
    imageUrls: [] as string[],
    expiresAt: "",
  });


  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  function deleteImage(index: number) {
    // Remove from previews
    setPreviews((prev) => prev.filter((_, i) => i !== index));

    // If it's a new file (not yet uploaded)
    setImageFiles((prev) => prev.filter((_, i) => i !== index));

    // If it's an existing Cloudinary URL
    setForm((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  }
  function handleCreateListing(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    setImageFiles(fileArray);
    const previewUrls = fileArray.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  }

  const validateForm = () => {
    if (!form.title || form.title.length < 5)
      return "Title must be at least 5 characters";
    if (!form.description || form.description.length < 10)
      return "Description must be at least 10 characters";
    if (!form.category || form.category.length < 2)
      return "Category is required";
    if (!form.pricePerUnit || form.pricePerUnit <= 0)
      return "Price must be greater than 0";
    if (!form.quantityAvailable || form.quantityAvailable <= 0)
      return "Quantity must be greater than 0";
    if (form.imageUrls?.length > 10) return "Maximum 10 images allowed";
    return null;
  };

  const handleSubmit = async () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      toast.error(errorMessage, { toastId: "form-error" });
      return;
    }
    setIsLoading(true);
    try {
      let imageUrls: string[] = [];

      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map((file) => {
          const formData = new FormData();
          formData.append("file", file);

          return fetch("/api/upload/image", {
            method: "POST",
            credentials: "include",
            body: formData,
          }).then((res) => {
            if (!res.ok) throw new Error("Upload failed");
            return res.json();
          });
        });
        const results = await Promise.all(uploadPromises);
        imageUrls = results.map((r) => r.url);
      }

      const payload = {
        ...form,
        imageUrls,
        pricePerUnit: Number(form.pricePerUnit),
        quantityAvailable: Number(form.quantityAvailable),
        expiresAt: form.expiresAt
          ? new Date(form.expiresAt).toISOString()
          : undefined,
      };

      // await createProduct(payload);
        createProductMutate(payload, {
    onSuccess: (data) => {
      console.log('Listing created:', data)
      // e.g. toast.success('Listing created'), close modal, reset form, etc.
    },
    onError: (err) => {
      console.error('Create failed:', err.message)
      // e.g. toast.error(err.message)
    },
  })
      toast.success("Product listed successfully!");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      setForm({
        title: "",
        description: "",
        category: "",
        pricePerUnit: 0,
        unit: "",
        quantityAvailable: 0,
        location: "",
        imageUrls: [] as string[],
        expiresAt: "",
      });
      setImageFiles([]);
      setPreviews([]);
    }
  };

  const categories =
    role === "FARMER" ? FARMER_CATEGORIES : SUPPLIER_CATEGORIES;

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] w-full flex-col items-center justify-center px-4">
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#C9E86B]/30" />
          <span className="absolute inset-2 animate-pulse rounded-full bg-[#C9E86B]/20" />

          <svg
            className="absolute inset-0 h-full w-full animate-spin-slow"
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="#12331F"
              strokeWidth="3"
              strokeDasharray="8 10"
              strokeLinecap="round"
              opacity="0.15"
            />
          </svg>

          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#12331F] shadow-lg shadow-[#12331F]/25">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C9E86B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-bounce-slow"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
        </div>

        <h1 className="text-lg font-bold text-[#12331F]">
          Listing your product...
        </h1>
        <p className="mt-1 text-sm text-[#12331F]/50">
          Hang tight, we're uploading your details to the marketplace.
        </p>

        <div className="mt-6 flex gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#12331F]/70 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#12331F]/70 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#12331F]/70" />
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="farm-page">
      


<div className="farm-header ">
  <Link
    href="/dashboard/mystore"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      color: "rgba(232,213,163,0.75)",
      fontSize: "0.82rem",
      fontWeight: 500,
      textDecoration: "none",
      marginBottom: "16px",
      position: "relative",
      transition: "color 0.2s ease",
    }}
    className="back-link flex justify-center items-center"
  >
   <IoIosArrowRoundBack className="w-8 h-8"/>
    Back to My Store
  </Link>

  <h1>List Your Product</h1>
  <p>
    Reach buyers across the marketplace — fill in your product details
    below
  </p>
</div>
        <div className="form-wrapper">
          <div className="farm-card">
            <div className="form-grid">
              <div className="form-section">
                <h3 className="card-section-title">
                  📋 Basic Information
                  <span className={`role-badge ${role}`}>
                    {role === "FARMER"
                      ? "🌾 FARMER Listing"
                      : "🏭 Supplier Listing"}
                  </span>
                </h3>

                <div className="field-group">
                  <label className="farm-label">Product Name</label>
                  <input
                    className="farm-input"
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleCreateListing}
                    placeholder={
                      role === "FARMER"
                        ? "e.g. Fresh Alphonso Mangoes"
                        : "e.g. NPK Granular Fertilizer 20-20-20"
                    }
                  />
                </div>

                <div className="field-group">
                  <label className="farm-label">Description</label>
                  <textarea
                    className="farm-textarea"
                    name="description"
                    value={form.description}
                    onChange={handleCreateListing}
                    placeholder={
                      role === "FARMER"
                        ? "Describe your produce — quality, harvest date, any certifications..."
                        : "Describe your product — specifications, usage instructions, brand..."
                    }
                  />
                </div>

                <div className="field-group">
                  <label className="farm-label">Category</label>
                  <select
                    className="farm-select"
                    name="category"
                    value={form.category}
                    onChange={handleCreateListing}
                  >
                    <option value="">— Select a category —</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="section-divider" />

              <div className="form-section">
                <h3 className="card-section-title">
                  💰 Pricing & Availability
                </h3>

                <div className="field-row">
                  <div className="field-group">
                    <label className="farm-label">Price Per Unit (₹)</label>
                    <input
                      className="farm-input"
                      type="number"
                      name="pricePerUnit"
                      value={form.pricePerUnit || ""}
                      onChange={handleCreateListing}
                      placeholder="0.00"
                      min="0"
                    />
                  </div>

                  <div className="field-group">
                    <label className="farm-label">Unit Type</label>
                    <select
                      className="farm-select"
                      name="unit"
                      value={form.unit}
                      onChange={handleCreateListing}
                    >
                      <option value="">— Select unit —</option>
                      {UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-group">
                    <label className="farm-label">Quantity Available</label>
                    <input
                      className="farm-input"
                      type="number"
                      name="quantityAvailable"
                      value={form.quantityAvailable || ""}
                      onChange={handleCreateListing}
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div className="field-group">
                    <label className="farm-label">Listing Expires On</label>
                    <input
                      className="farm-input"
                      type="date"
                      name="expiresAt"
                      value={form.expiresAt}
                      onChange={handleCreateListing}
                    />
                  </div>
                </div>
              </div>

              <div className="section-divider" />

              <div className="form-section">
                <h3 className="card-section-title">📍 Location</h3>
                <div className="field-group">
                  <label className="farm-label">
                    Location / Village / District
                  </label>
                  <input
                    className="farm-input"
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleCreateListing}
                    placeholder="e.g. Nashik, Maharashtra"
                  />
                </div>
              </div>

              <div className="section-divider" />

              <div className="form-section" style={{ marginBottom: 0 }}>
                <h3 className="card-section-title">📷 Product Images</h3>

                <div className="image-upload-zone">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <div className="upload-icon">🖼️</div>
                  <div className="upload-text">
                    Click to upload product photos
                  </div>
                  <div className="upload-subtext">
                    JPG, PNG, WEBP — up to 10 images
                  </div>
                </div>

                {previews.length > 0 && (
                  <div className="previews-grid">
                    {previews.map((src, i) => (
                      <div className="flex flex-col  items-center justify-center">
                        <img
                          key={i}
                          src={src}
                          alt={`preview ${i + 1}`}
                          className="preview-img"
                        />
                        <button
                          className="mt-2"
                          onClick={() => {
                            deleteImage(i);
                          }}
                        >
                          <Trash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="submit-bar">
              <span className="submit-hint">
                All fields marked are required. Your listing will be reviewed
                before going live.
              </span>
              <button
                className="submit-btn"
                onClick={handleSubmit}
                type="button"
              >
                Publish Listing →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
