'use client'
import { useEffect, useState } from 'react'
import { Store } from '@/lib/api/store'
import { useRouter } from 'next/navigation'
import { SkeletonCard } from './SkeletonCard'


export interface Seller {
  id: string
  firstName: string
  lastName: string
}

export interface MarketplaceListing {
  id: string
  sellerId: string
  title: string
  description: string
  category: string
  pricePerUnit: string
  unit: string
  quantityAvailable: number
  imageUrls: string[]
  location: string
  status: "ACTIVE" | "INACTIVE" | "SOLD_OUT" | "EXPIRED"
  expiresAt: string | null
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  seller: Seller
  _count: { reviews: number }
}

const categoryConfig: Record<string, { gradient: string; emoji: string }> = {
  grain:      { gradient: 'from-amber-100 via-yellow-50 to-amber-50',    emoji: '🌾' },
  grains:     { gradient: 'from-amber-100 via-yellow-50 to-amber-50',    emoji: '🌾' },
  vegetables: { gradient: 'from-emerald-100 via-green-50 to-teal-50',    emoji: '🥦' },
  fruits:     { gradient: 'from-orange-100 via-rose-50 to-pink-50',      emoji: '🍎' },
  dairy:      { gradient: 'from-sky-100 via-blue-50 to-indigo-50',       emoji: '🥛' },
  spices:     { gradient: 'from-red-100 via-orange-50 to-amber-50',      emoji: '🌶️' },
  pulses:     { gradient: 'from-lime-100 via-green-50 to-emerald-50',    emoji: '🫘' },
  organic:    { gradient: 'from-teal-100 via-emerald-50 to-green-50',    emoji: '🌿' },
  seafood:    { gradient: 'from-cyan-100 via-blue-50 to-sky-50',         emoji: '🐟' },
  default:    { gradient: 'from-green-100 via-emerald-50 to-lime-50',    emoji: '📦' },
}

function getCategoryConfig(category: string) {
  return categoryConfig[category?.toLowerCase()] ?? categoryConfig.default
}


function ProductCard({ item }: { item: MarketplaceListing }) {
  const image     = item.imageUrls?.[0]
  const isExpired = item.expiresAt && new Date(item.expiresAt) < new Date()
  const initials  = (item.seller.firstName[0] + item.seller.lastName[0]).toUpperCase()
  const config    = getCategoryConfig(item.category)
  const router =useRouter();
  function handleViewDetails(id:string){
   router.push(`/marketplace/${id}`)

   }
  return (
    <div className="group flex flex-col  rounded-2xl overflow-hidden bg-white border border-green-100 hover:border-green-300 shadow-sm hover:shadow-lg hover:shadow-green-100/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer">

      {/* Image */}
      <div className={`relative w-full h-48 flex-shrink-0 bg-gradient-to-br ${config.gradient} overflow-hidden`}>
        {image ? (
          <img
            src={image}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl opacity-30">{config.emoji}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />

        {/* Category pill */}
        <span className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-green-700 text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border border-green-200/60">
          {item.category}
        </span>

        {/* Status badge */}
        <span className={`absolute top-3 right-3 flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm border
          ${isExpired
            ? 'bg-red-50/90 text-red-500 border-red-200'
            : 'bg-emerald-50/90 text-emerald-600 border-emerald-200'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isExpired ? 'bg-red-400' : 'bg-emerald-500'}`} />
          {isExpired ? 'Expired' : 'Active'}
        </span>

        {/* Title + location overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
          <h3 className="text-white font-bold text-base leading-snug truncate drop-shadow">{item.title}</h3>
          <p className="text-white/70 text-[11px] mt-0.5 flex items-center gap-1">
            <span>📍</span>{item.location}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-4 flex-1">

        <p className="text-green-700/60 text-xs leading-relaxed line-clamp-2">
          {item.description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-green-900 font-black text-xl">
              ₹{parseFloat(item.pricePerUnit).toLocaleString('en-IN')}
            </span>
            <span className="text-green-400 text-xs">/ {item.unit}</span>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-green-400 uppercase tracking-wide">Stock</p>
            <p className="text-green-700 text-sm font-semibold">{item.quantityAvailable}</p>
          </div>
        </div>

        <div className="h-px bg-green-100" />

        {/* Seller */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-green-900 text-xs font-medium truncate leading-none">
                {item.seller.firstName} {item.seller.lastName}
              </p>
              <p className="text-green-400 text-[10px] mt-0.5">Seller</p>
            </div>
          </div>
          {item._count.reviews > 0 ? (
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
              <span className="text-amber-500 text-xs">★</span>
              <span className="text-amber-600 text-xs font-medium">{item._count.reviews}</span>
            </div>
          ) : (
            <span className="text-green-300 text-[10px]">No reviews</span>
          )}
        </div>

        {/* CTA */}
        <button onClick={()=>{handleViewDetails(item.id)}} className="w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white text-xs font-semibold tracking-wide transition-all duration-200 shadow-sm shadow-green-200">
          View Details →
        </button>
      </div>
    </div>
  )
}





const MarketPlace = () => {
  const [productData, setProductData] = useState<MarketplaceListing[]>([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState<string | null>(null)
  const [search, setSearch]           = useState('')

  const getProducts = async () => {
    try {
      setLoading(true)
      const data = await Store()
      setProductData(data)
    } catch (err) {
      setError('Failed to load products')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { getProducts() }, [])

  const filtered = productData.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    
    <div className="min-h-screen mt-14" style={{ background: 'linear-gradient(160deg, #f0faf2 0%, #e8f5ea 50%, #f4fbf0 100%)' }}>

      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-xl border-b border-green-100" style={{ background: 'rgba(240, 250, 242, 0.9)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-green-900 font-black text-xl tracking-tight">🌾 Marketplace</h1>
            <p className="text-green-500 text-xs mt-0.5">
              {loading ? 'Loading...' : `${filtered.length} listing${filtered.length !== 1 ? 's' : ''} available`}
            </p>
          </div>
          <div className="relative w-full sm:w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search products, category, location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-green-200 rounded-xl text-green-900 placeholder:text-green-300 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p className="text-4xl">⚠️</p>
            <p className="text-green-700 font-medium">{error}</p>
            <button onClick={getProducts} className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-xl transition shadow-sm">
              Try again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : filtered.map(item => <ProductCard key={item.id} item={item} />)
            }
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p className="text-5xl">🌾</p>
            <p className="text-green-700 font-semibold text-lg">No listings found</p>
            <p className="text-green-400 text-sm">Try a different search</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MarketPlace                                                                                                                                                                                                                                                                                                                                                                                                     