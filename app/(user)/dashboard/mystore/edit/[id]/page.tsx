'use client'
import { useEffect, useState } from "react"
import { CreateMarketplaceListing } from "@/types/marketplace"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import { toast } from 'react-toastify'
import { useAuth } from '@/context/AuthProvider'
import { useParams } from "next/navigation"
import { Trash2 } from "lucide-react"
import { editListing } from "@/lib/api/marketplace"
import '../Edit.css'
import { UNITS,FARMER_CATEGORIES, SUPPLIER_CATEGORIES} from "@/constants/items"
import { IoIosArrowRoundBack } from "react-icons/io"
import Link from "next/link"
const editProduct = () => {

  const { user } = useAuth()
  const role = user?.role // "FARMER" | "supplier"
  const params=useParams();
  const id = params.id as string 
  const [form, setForm] = useState<CreateMarketplaceListing>({
    title: '',
    description: '',
    category: '',
    pricePerUnit: 0,
    unit: '',
    quantityAvailable: 0,
    location: '',
    imageUrls: [] as string[],
    expiresAt: '',
  })
  console.log(role)

  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
 function deleteImage(index: number) {
  // Remove from previews
  setPreviews(prev => prev.filter((_, i) => i !== index))

  // If it's a new file (not yet uploaded)
  setImageFiles(prev => prev.filter((_, i) => i !== index))

  // If it's an existing Cloudinary URL
  setForm(prev => ({
    ...prev,
    imageUrls: prev.imageUrls?.filter((_, i) => i !== index)
  }))
}
  function handleCreateListing(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === "number" ? (parseFloat(value) || 0) : value,
    }))
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return
    const fileArray = Array.from(files)
    setImageFiles(fileArray)
    const previewUrls = fileArray.map(file => URL.createObjectURL(file))
    setPreviews(previewUrls)
  }

  const validateForm = () => {
    if (!form.title || form.title.length < 5) return "Title must be at least 5 characters"
    if (!form.description || form.description.length < 10) return "Description must be at least 10 characters"
    if (!form.category || form.category.length < 2) return "Category is required"
    if (!form.pricePerUnit || form.pricePerUnit <= 0) return "Price must be greater than 0"
    if (!form.quantityAvailable || form.quantityAvailable <= 0) return "Quantity must be greater than 0"
    if (form.imageUrls?.length > 10) return "Maximum 10 images allowed"
    return null
  }

  const handleSubmit = async () => {
    const errorMessage = validateForm()
    if (errorMessage) {
      toast.error(errorMessage, { toastId: "form-error" })
      return
    }

    try {
      let imageUrls: string[] = []

      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(file => {
          const formData = new FormData()
          formData.append('file', file)
          return fetch('/api/upload/image', {
            method: 'POST',
            credentials: 'include',
            body: formData,
          }).then(res => {
            if (!res.ok) throw new Error('Upload failed')
            return res.json()
          })
        })
        const results = await Promise.all(uploadPromises)
        imageUrls = results.map(r => r.url)
      }

      const payload = {
        ...form,
        imageUrls,
        pricePerUnit: Number(form.pricePerUnit),
        quantityAvailable: Number(form.quantityAvailable),
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
      }

      await editListing(id,payload)
      toast.success("Product listed successfully!")
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  const categories = role === "FARMER" ? FARMER_CATEGORIES : SUPPLIER_CATEGORIES


  useEffect(() => {
  const fetchListing = async () => {
    try {
      const res = await fetch(`/api/marketplace/${id}`, { credentials: 'include' })
      const data = await res.json()
      const listing = data.data  // based on your API response shape

      setForm({
        title: listing.title,
        description: listing.description,
        category: listing.category,
        pricePerUnit: listing.pricePerUnit,
        unit: listing.unit,
        quantityAvailable: listing.quantityAvailable,
        location: listing.location,
        imageUrls: listing.imageUrls ?? [],
        expiresAt: listing.expiresAt
          ? new Date(listing.expiresAt).toISOString().split('T')[0]
          : '',
      })
         setPreviews(listing.imageUrls ?? [])
    } catch (err) {
      toast.error('Failed to load listing')
    }
  }

  if (id) fetchListing()
}, [id])
  return (
    <>
   

      <div className="farm-page">

        {/* Header */}
        <div className="farm-header">
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
          <h1>Edit Your Product</h1>

        </div>

        <div className="form-wrapper">

          {/* Form Card */}
          <div className="farm-card">
            <div className="form-grid">

              {/* Basic Info */}
              <div className="form-section">
                <h3 className="card-section-title">
                  📋 Basic Information
                  <span className={`role-badge ${role}`}>
                    {role === 'FARMER' ? '🌾 FARMER Listing' : '🏭 Supplier Listing'}
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
                    placeholder={role === 'FARMER' ? 'e.g. Fresh Alphonso Mangoes' : 'e.g. NPK Granular Fertilizer 20-20-20'}
                  />
                </div>

                <div className="field-group">
                  <label className="farm-label">Description</label>
                  <textarea
                    className="farm-textarea"
                    name="description"
                    value={form.description}
                    onChange={handleCreateListing}
                    placeholder={role === 'FARMER'
                      ? 'Describe your produce — quality, harvest date, any certifications...'
                      : 'Describe your product — specifications, usage instructions, brand...'}
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
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="section-divider" />

              {/* Pricing & Quantity */}
              <div className="form-section">
                <h3 className="card-section-title">💰 Pricing & Availability</h3>

                <div className="field-row">
                  <div className="field-group">
                    <label className="farm-label">Price Per Unit (₹)</label>
                    <input
                      className="farm-input"
                      type="number"
                      name="pricePerUnit"
                      value={form.pricePerUnit || ''}
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
                      {UNITS.map(u => (
                        <option key={u} value={u}>{u}</option>
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
                      value={form.quantityAvailable || ''}
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

              {/* Location */}
              <div className="form-section">
                <h3 className="card-section-title">📍 Location</h3>
                <div className="field-group">
                  <label className="farm-label">Location / Village / District</label>
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

              {/* Images */}
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
                  <div className="upload-text">Click to upload product photos</div>
                  <div className="upload-subtext">JPG, PNG, WEBP — up to 10 images</div>
                </div>

               {previews.length > 0 && (
                  <div className="previews-grid">
                    {previews.map((src, i) => (
                   <div className="flex flex-col  items-center justify-center">
                          <img key={i} src={src} alt={`preview ${i + 1}`} className="preview-img" />
                            <button  className='mt-2' onClick={()=>{deleteImage(i)}}>
         <Trash2/>
                    </button>
                    </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Submit Bar */}
            <div className="submit-bar">
              <span className="submit-hint">
                All fields marked are required. Your listing will be reviewed before going live.
              </span>
              <button className="submit-btn" onClick={handleSubmit} type="button">
                Publish Listing →
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default editProduct