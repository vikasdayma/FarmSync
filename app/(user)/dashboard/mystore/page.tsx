'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { getMyListings } from '@/lib/api/marketplace'
import { MdDelete } from "react-icons/md";
import { Edit, Edit2 } from 'lucide-react';
import { Listing } from '@/types/store';

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-green-100 animate-pulse shadow-sm">
      <div className="h-44 bg-green-50" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 bg-green-100 rounded w-2/3" />
        <div className="h-3 bg-green-100 rounded w-full" />
        <div className="h-3 bg-green-100 rounded w-1/2" />
        <div className="flex gap-2 mt-1">
          <div className="h-8 bg-green-100 rounded-xl flex-1" />
          <div className="h-8 bg-red-50 rounded-xl flex-1" />
        </div>
      </div>
    </div>
  )
}


function ProductCard({
  item,
  onEdit,
  onDelete,
}: {
  item: Listing
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}) {
  const image = item.imageUrls?.[0]
  const isExpired = item.expiresAt && new Date(item.expiresAt) < new Date()
  const expiresSoon =
    item.expiresAt &&
    !isExpired &&
    new Date(item.expiresAt).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-green-100 hover:border-green-300 shadow-sm hover:shadow-md hover:shadow-green-100/50 hover:-translate-y-0.5 transition-all duration-300 flex flex-col">

      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-green-50 to-emerald-100 overflow-hidden flex-shrink-0">
        {image ? (
          <img
            src={image}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl opacity-20">🌾</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Status badge */}
        <span className={`absolute top-2.5 right-2.5 flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-sm
          ${isExpired
            ? 'bg-red-50/90 text-red-500 border-red-200'
            : expiresSoon
            ? 'bg-amber-50/90 text-amber-600 border-amber-200'
            : 'bg-emerald-50/90 text-emerald-600 border-emerald-200'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isExpired ? 'bg-red-400' : expiresSoon ? 'bg-amber-400' : 'bg-emerald-500'}`} />
          {isExpired ? 'Expired' : expiresSoon ? 'Expiring soon' : 'Active'}
        </span>

        {/* Category pill */}
        <span className="absolute top-2.5 left-2.5 bg-white/80 backdrop-blur-sm text-green-700 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full border border-green-200/60 truncate max-w-[120px]">
          {item.category}
        </span>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5">
          <h3 className="text-white font-bold text-sm leading-tight truncate drop-shadow">
            {item.title}
          </h3>
          <p className="text-white/70 text-[10px] flex items-center gap-0.5 mt-0.5">
            📍 {item.location}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2.5 p-3.5 flex-1">

        <p className="text-green-700/60 text-xs leading-relaxed line-clamp-2">
          {item.description}
        </p>

        {/* Price row */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-green-900 font-black text-lg leading-none">
              ₹{parseFloat(item.pricePerUnit).toLocaleString('en-IN')}
            </span>
            <span className="text-green-400 text-xs">/ {item.unit}</span>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-green-400 uppercase tracking-wide leading-none">Stock</p>
            <p className="text-green-700 text-sm font-semibold">{item.quantityAvailable}</p>
          </div>
        </div>

        {/* Reviews & date */}
        <div className="flex items-center justify-between text-[10px] text-green-400 border-t border-green-50 pt-2">
          <span>⭐ {item._count.reviews} review{item._count.reviews !== 1 ? 's' : ''}</span>
          <span>{new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-auto pt-1">
          <button
            onClick={() => onEdit(item.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition-all active:scale-[0.97] shadow-sm shadow-green- 200"
          >
            <Edit2 className='h-3 w-3'/> Edit
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 border border-red-100 hover:border-red-200 text-xs font-semibold transition-all active:scale-[0.97]"
          >
             <MdDelete className='text-lg'/> Delete
          </button>
        </div>
      </div>
    </div>
  )
}


function DeleteModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="bg-[#EDF3E8] rounded-2xl p-6 shadow-xl border border-red-100 max-w-sm w-full">
        <div className="text-3xl mb-3 text-center">🗑️</div>
        <h3 className="text-green-900 font-bold text-base text-center mb-1">Remove Listing?</h3>
        <p className="text-green-600/70 text-sm text-center mb-5">
          This listing will be removed from the marketplace. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-green-200 text-green-700 text-sm font-semibold hover:bg-green-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all shadow-sm"
          >
            Yes, Remove
          </button>
        </div>
      </div>
    </div>
  )
}


const MyStore = () => {
  const router = useRouter()
  const [listingData, setListingData] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function getListings() {
    try {
      setLoading(true)
      const res = await getMyListings()
      setListingData(res.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!deleteTargetId) return
    try {
      setDeleting(true)
      const res = await fetch(`/api/marketplace/${deleteTargetId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete listing')
      setListingData(prev => prev.filter(l => l.id !== deleteTargetId))
      setDeleteTargetId(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  useEffect(() => { getListings() }, [])

  const activeCount = listingData.filter(l =>
    l.expiresAt ? new Date(l.expiresAt) > new Date() : true
  ).length
console.log(listingData)
  return (
    <div className="min-h-screen  bg-[#e3f3e3]" >

      {/* Header */}
        <div className="sticky top-0 z-20 backdrop-blur-xl border-b border-green-100 bg-[#e3f3e3]" >
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-green-900 font-black text-xl tracking-tight">🏪 My Store</h1>
            <p className="text-green-500 text-xs mt-0.5">
              {loading ? 'Loading...' : `${listingData.length} listing${listingData.length !== 1 ? 's' : ''} · ${activeCount} active`}
            </p>
          </div>
          <button
            onClick={() => router.push('mystore/addproduct')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-all shadow-sm shadow-green-200 active:scale-[0.97]"
          >
            + Add Product
          </button>
        </div>
      </div>

   
      <div className="max-w-6xl mx-auto px-5 py-6">

        {error && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-4xl">⚠️</p>
            <p className="text-green-700 font-medium">{error}</p>
            <button
              onClick={getListings}
              className="px-5 py-2 bg-green-600 hover:bg-green-700
               text-white text-sm rounded-xl transition shadow-sm"
            >
              Try again
            </button>
          </div>
        )}

        {!error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-5">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : listingData.map(item => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    onEdit={id => router.push(`mystore/edit/${id}`)}
                    onDelete={id => setDeleteTargetId(id)}
                  />
                ))
            }
          </div>
        )}

        {!loading && !error && listingData.length === 0 && (
          <div className="flex  flex-col items-center justify-center py-24 gap-3">
            <p className="text-5xl">🌱</p>
            <p className="text-green-700 font-semibold text-lg">No listings yet</p>
            <p className="text-green-400 text-sm">Add your first product to start selling</p>
            <button
              onClick={() => router.push('mystore/addproduct')}
              className="mt-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition shadow-sm"
            >
              + Add Product
            </button>
          </div>
        )}
      </div>

      {deleteTargetId && (
        <DeleteModal
          onConfirm={handleDelete}
          onCancel={() => setDeleteTargetId(null)}
        />
      )}
    </div>
  )
}

export default MyStore