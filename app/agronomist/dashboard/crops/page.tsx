'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FlaskConical, Sprout, Plus, CloudSun } from 'lucide-react'

type Crop = {
  id: string
  name: string
  scientificName?: string
  category: string
  season: string
  description?: string
  imageUrl?: string
  isActive: boolean
}

function SkeletonCard() {
  return (
    <div className="bg-[#e3f3e3] rounded-2xl overflow-hidden border border-green-100 animate-pulse shadow-sm">
      <div className="h-40 bg-green-50" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 bg-green-100 rounded w-2/3" />
        <div className="h-3 bg-green-100 rounded w-full" />
        <div className="flex gap-2 mt-1">
          <div className="h-6 bg-green-100 rounded-full w-16" />
          <div className="h-6 bg-green-100 rounded-full w-16" />
        </div>
      </div>
    </div>
  )
}

function CropCard({ item }: { item: Crop }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-green-100 hover:border-green-300 shadow-sm hover:shadow-md hover:shadow-green-100/50 hover:-translate-y-0.5 transition-all duration-300 flex flex-col">

      {/* Image */}
      <div className="relative h-40 bg-gradient-to-br from-green-50 to-emerald-100 overflow-hidden flex-shrink-0">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Sprout className="h-12 w-12 text-green-300" strokeWidth={1.5} />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

   
        <span className="absolute top-2.5 left-2.5 bg-white/80 backdrop-blur-sm text-green-700 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full border border-green-200/60 truncate max-w-[120px]">
          {item.category}
        </span>


        <span className={`absolute top-2.5 right-2.5 flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-sm
          ${item.isActive
            ? 'bg-emerald-50/90 text-emerald-600 border-emerald-200'
            : 'bg-red-50/90 text-red-500 border-red-200'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${item.isActive ? 'bg-emerald-500' : 'bg-red-400'}`} />
          {item.isActive ? 'Active' : 'Inactive'}
        </span>


        <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5">
          <h3 className="text-white font-bold text-sm leading-tight truncate drop-shadow">
            {item.name}
          </h3>
          {item.scientificName && (
            <p className="text-white/70 text-[10px] italic truncate mt-0.5">
              {item.scientificName}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 p-3.5 flex-1">
        <p className="text-green-700/60 text-xs leading-relaxed line-clamp-2 min-h-[2.2em]">
          {item.description || 'No description added yet.'}
        </p>

        <div className="flex items-center gap-2 border-t border-green-50 pt-2.5 mt-auto">
          <span className="flex items-center gap-1 text-[11px] text-green-600 bg-green-50 px-2 py-1 rounded-lg font-medium">
            <CloudSun className="h-3 w-3" />
            {item.season}
          </span>
          {item.scientificName && (
            <span className="flex items-center gap-1 text-[11px] text-green-500 bg-green-50/60 px-2 py-1 rounded-lg">
              <FlaskConical className="h-3 w-3" />
              Verified
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

const CropsCatalog = () => {
  const router = useRouter()
  const [crops, setCrops] = useState<Crop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function getCrops() {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/crops')
      if (!res.ok) throw new Error(`${res.status}: Failed to load crops`)
      const data = await res.json()
      setCrops(data.data) 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { getCrops() }, [])

  const activeCount = crops.filter(c => c.isActive).length

  return (
    <div className="min-h-screen bg-[#e3f3e3]">

      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-xl border-b border-green-100 bg-[#e3f3e3]">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-green-900 font-black text-xl tracking-tight">🌾 Crop Catalog</h1>
            <p className="text-green-500 text-xs mt-0.5">
              {loading ? 'Loading...' : `${crops.length} crop${crops.length !== 1 ? 's' : ''} · ${activeCount} active`}
            </p>
          </div>
          <button
            onClick={() => router.push('/agronomist/dashboard/crops/add-crop')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-all shadow-sm shadow-green-200 active:scale-[0.97]"
          >
            <Plus className="h-4 w-4" />
            Add Crop
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-6">

        {error && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-4xl">⚠️</p>
            <p className="text-green-700 font-medium">{error}</p>
            <button
              onClick={getCrops}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-xl transition shadow-sm"
            >
              Try again
            </button>
          </div>
        )}

        {!error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : crops.map(item => <CropCard key={item.id} item={item} />)
            }
          </div>
        )}

        {!loading && !error && crops.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p className="text-5xl">🌱</p>
            <p className="text-green-700 font-semibold text-lg">No crops yet</p>
            <p className="text-green-400 text-sm">Add the first crop to build out the catalog</p>
            <button
              onClick={() => router.push('/agronomist/crops/new')}
              className="mt-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition shadow-sm"
            >
              <Plus className="h-4 w-4 inline mr-1.5" />
              Add Crop
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CropsCatalog