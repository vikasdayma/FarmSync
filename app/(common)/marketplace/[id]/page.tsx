'use client'
import { getProductDetails } from '@/lib/api/store'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface Seller {
  id: string
  firstName: string
  lastName: string
}

interface ProductDetail {
  id: string
  title: string
  description: string
  category: string
  pricePerUnit: string
  unit: string
  quantityAvailable: number
  imageUrls: string[]
  location: string
  status: string
  expiresAt: string | null
  createdAt: string
  updatedAt: string
  sellerId: string
  seller: Seller
  reviews: any[]
  _count: { reviews: number }
}

const ViewDetails = () => {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params.id
  const [productDetails, setProductDetails] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  const getProduct = async () => {
    try {
      setLoading(true)
      const data = await getProductDetails(id)
      setProductDetails(data)
    } catch (err) {
      console.error('something went wrong', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProduct()
  }, [id])

  const isExpired = productDetails?.expiresAt
    ? new Date(productDetails.expiresAt) < new Date()
    : false

  const expiresSoon = productDetails?.expiresAt && !isExpired
    ? new Date(productDetails.expiresAt).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000
    : false

  const initials = productDetails
    ? (productDetails.seller.firstName[0] + productDetails.seller.lastName[0]).toUpperCase()
    : ''

  // ── Skeleton ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen animate-pulse" style={{ background: 'linear-gradient(160deg, #f0faf2 0%, #e8f5ea 50%, #f4fbf0 100%)' }}>
        <div className="max-w-5xl mx-auto px-5 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl bg-green-100 h-96" />
          <div className="flex flex-col gap-4 pt-2">
            <div className="h-4 bg-green-100 rounded w-1/3" />
            <div className="h-8 bg-green-100 rounded w-3/4" />
            <div className="h-4 bg-green-100 rounded w-full" />
            <div className="h-4 bg-green-100 rounded w-2/3" />
            <div className="h-12 bg-green-100 rounded-xl mt-4" />
          </div>
        </div>
      </div>
    )
  }

  if (!productDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ background: 'linear-gradient(160deg, #f0faf2 0%, #e8f5ea 50%, #f4fbf0 100%)' }}>
        <p className="text-5xl">🌾</p>
        <p className="text-green-700 font-semibold text-lg">Product not found</p>
        <button onClick={() => router.back()} className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-xl transition">
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #f0faf2 0%, #e8f5ea 50%, #f4fbf0 100%)' }}>

      {/* Top nav */}
      <div className="sticky top-0 z-20 backdrop-blur-xl border-b border-green-100" style={{ background: 'rgba(240,250,242,0.92)' }}>
        <div className="max-w-5xl mx-auto px-5 py-3.5 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
          >
            ← Back
          </button>
          <span className="text-green-200">|</span>
          <span className="text-green-500 text-sm truncate">{productDetails.title}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── Left: Images ── */}
          <div className="flex flex-col gap-3">

            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 aspect-square">
              {productDetails.imageUrls.length > 0 ? (
                <img
                  src={productDetails.imageUrls[activeImage]}
                  alt={productDetails.title}
                  className="w-full h-full object-cover"         
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl opacity-20">🌾</span>
                </div>
              )}

              {/* Status badge */}
              <span className={`absolute top-3 right-3 flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border backdrop-blur-sm
                ${isExpired
                  ? 'bg-red-50/90 text-red-500 border-red-200'
                  : expiresSoon
                  ? 'bg-amber-50/90 text-amber-600 border-amber-200'
                  : 'bg-emerald-50/90 text-emerald-600 border-emerald-200'}`}>
                <span className={`w-2 h-2 rounded-full ${isExpired ? 'bg-red-400' : expiresSoon ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                {isExpired ? 'Expired' : expiresSoon ? 'Expiring soon' : 'Active'}
              </span>

              {/* Image counter */}
              {productDetails.imageUrls.length > 1 && (
                <span className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                  {activeImage + 1} / {productDetails.imageUrls.length}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {productDetails.imageUrls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {productDetails.imageUrls.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all
                      ${activeImage === i ? 'border-green-500 shadow-sm shadow-green-200' : 'border-green-100 hover:border-green-300'}`}
                  >
                    <img src={url} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Details ── */}
          <div className="flex flex-col gap-5">

            {/* Category + title */}
            <div>
              <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full border border-green-200 mb-3">
                {productDetails.category}
              </span>
              <h1 className="text-green-950 font-black text-2xl leading-tight mb-1">
                {productDetails.title}
              </h1>
              <p className="text-green-500 text-sm flex items-center gap-1">
                📍 {productDetails.location}
              </p>
            </div>

            {/* Price */}
            <div className="bg-white rounded-2xl border border-green-100 p-4 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-green-400 text-xs uppercase tracking-wide mb-0.5">Price per unit</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-green-900 font-black text-3xl">
                    ₹{parseFloat(productDetails.pricePerUnit).toLocaleString('en-IN')}
                  </span>
                  <span className="text-green-400 text-sm">/ {productDetails.unit}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-400 text-xs uppercase tracking-wide mb-0.5">Available</p>
                <p className="text-green-700 font-bold text-xl">{productDetails.quantityAvailable}</p>
                <p className="text-green-400 text-xs">{productDetails.unit}s in stock</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-green-100 p-4 shadow-sm">
              <h3 className="text-green-800 font-semibold text-sm mb-2">About this product</h3>
              <p className="text-green-600/80 text-sm leading-relaxed">
                {productDetails.description}
              </p>
            </div>

            {/* Meta info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl border border-green-100 p-3 shadow-sm">
                <p className="text-green-400 text-[10px] uppercase tracking-wide mb-1">Listed on</p>
                <p className="text-green-800 text-sm font-medium">
                  {new Date(productDetails.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-green-100 p-3 shadow-sm">
                <p className="text-green-400 text-[10px] uppercase tracking-wide mb-1">Expires on</p>
                <p className={`text-sm font-medium ${isExpired ? 'text-red-500' : expiresSoon ? 'text-amber-600' : 'text-green-800'}`}>
                  {productDetails.expiresAt
                    ? new Date(productDetails.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                    : '—'}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-green-100 p-3 shadow-sm">
                <p className="text-green-400 text-[10px] uppercase tracking-wide mb-1">Reviews</p>
                <p className="text-green-800 text-sm font-medium">⭐ {productDetails._count.reviews}</p>
              </div>
              <div className="bg-white rounded-xl border border-green-100 p-3 shadow-sm">
                <p className="text-green-400 text-[10px] uppercase tracking-wide mb-1">Status</p>
                <p className={`text-sm font-medium ${isExpired ? 'text-red-500' : 'text-emerald-600'}`}>
                  {productDetails.status}
                </p>
              </div>
            </div>

            {/* Seller */}
            <div className="bg-white rounded-2xl border border-green-100 p-4 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-green-900 font-semibold text-sm">
                  {productDetails.seller.firstName} {productDetails.seller.lastName}
                </p>
                <p className="text-green-400 text-xs">Seller</p>
              </div>
              <span className="text-green-300 text-xs">#{productDetails.sellerId.slice(0, 8)}</span>
            </div>

            {/* CTA */}
          <button
  type="button"
  onClick={() => router.push(`/marketplace/${id}/purchase`)}
  className="w-full py-3.5 rounded-2xl bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white font-semibold text-sm tracking-wide transition-all shadow-md shadow-green-200"
>
  Purchase →
</button>

          </div>
        </div>

        {/* Reviews section */}
        <div className="mt-10">
          <h2 className="text-green-900 font-bold text-lg mb-4">
            Reviews <span className="text-green-400 font-normal text-sm">({productDetails._count.reviews})</span>
          </h2>

          {productDetails.reviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-green-100 p-8 text-center shadow-sm">
              <p className="text-3xl mb-2">💬</p>
              <p className="text-green-600 font-medium">No reviews yet</p>
              <p className="text-green-400 text-sm mt-1">Be the first to review this product</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {productDetails.reviews.map((review: any) => (
                <div key={review.id} className="bg-white rounded-2xl border border-green-100 p-4 shadow-sm">
                  <p className="text-green-800 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default ViewDetails