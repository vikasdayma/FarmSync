// 'use client'
// import React, { useEffect, useState } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import { getProductDetails } from '@/lib/api/store'
// import { PurchaseListing } from '@/types/marketplace'
// import { PurchaseOrder, usePurchaseOrder } from '@/lib/api/marketplace'

// interface Seller {
//   id: string
//   firstName: string
//   lastName: string
// }

// interface ProductDetail {
//   id: string
//   title: string
//   description: string
//   category: string
//   pricePerUnit: string
//   unit: string
//   quantityAvailable: number
//   imageUrls: string[]
//   location: string
//   status: string
//   expiresAt: string | null
//   createdAt: string
//   updatedAt: string
//   sellerId: string
//   seller: Seller
//   reviews: unknown[]
//   _count: { reviews: number }
// }

// /* ── Field wrapper ── */
// const Field = ({
//   label,
//   required,
//   children,
// }: {
//   label: string
//   required?: boolean
//   children: React.ReactNode
// }) => (
//   <div className="flex flex-col gap-1.5">
//     <label className="text-xs font-medium text-stone-500 uppercase tracking-[0.12em]">
//       {label}
//       {required && <span className="text-lime-600 ml-0.5">*</span>}
//     </label>
//     {children}
//   </div>
// )

// const inputCls =
//   'w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/10 transition-all duration-150'

// const Purchase = () => {
//   const { id } = useParams<{ id: string }>()
//   const router = useRouter()

//   /* ── listing state ── */
//   const [listing, setListing] = useState<ProductDetail | null>(null)
//   const [listingLoading, setListingLoading] = useState(true)

//   /* ── form state ── */
//   const [purchasing, setPurchasing] = useState<PurchaseListing>({
//     quantity: 1,
//     shippingAddress: { street: '', city: '', state: '', pincode: '', country: 'India' },
//     notes: '',
//   })
//   const [submitting, setSubmitting] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const { mutate: purchaseOrderMutate, isPending, error:isError } = usePurchaseOrder()

//   /* ── fetch listing ── */
//   useEffect(() => {
//     const load = async () => {
//       try {
//         const data = await getProductDetails(id)
//         setListing(data)
//       } catch (err) {
//         console.error(err)
//       } finally {
//         setListingLoading(false)
//       }
//     }
//     if (id) load()
//   }, [id])

//   /* ── derived ── */
//   const qty = purchasing.quantity ?? 1
//   const pricePerUnit = listing ? parseFloat(listing.pricePerUnit) : 0
//   const total = pricePerUnit * qty
//   const initials = listing
//     ? (listing.seller.firstName[0] + listing.seller.lastName[0]).toUpperCase()
//     : ''

//   /* ── helpers ── */
//   const setAddress = (field: keyof PurchaseListing['shippingAddress'], value: string) =>
//     setPurchasing(prev => ({ ...prev, shippingAddress: { ...prev.shippingAddress, [field]: value } }))

//   /* ── submit ── */
// const onSubmit = async (e: React.FormEvent) => {
//   e.preventDefault()
//   setSubmitting(true)
//   setError(null)
//   try {
//     purchaseOrderMutate({ id, data: purchasing as Record<string, unknown> })
//     router.push(`/marketplace/${id}/purchase/order`)
//   } catch (err: unknown) {
//     console.error('🔴 Purchase failed:', err)
//     setError(err instanceof Error ? err.message : 'Something went wrong')
//   } finally {
//     setSubmitting(false)
//   }
// }




//   return (
//     <>
//       <link
//         href="https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap"
//         rel="stylesheet"
//       />

//       <div
//         className="min-h-screen bg-stone-50 px-5 py-8 md:px-10 xl:px-16"
//         style={{ fontFamily: "'DM Sans', sans-serif" }}
//       >
//         <div className="max-w-2xl mx-auto">

//           {/* ── Back ── */}
//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-2 text-stone-400 hover:text-lime-600 text-sm mb-8 transition-colors duration-150"
//           >
//             <span className="text-base leading-none">←</span>
//             Back to listing
//           </button>

//           {/* ── Page heading ── */}
//           <div className="mb-6">
//             <p className="text-xs text-stone-400 uppercase tracking-[0.18em] mb-1">Marketplace</p>
//             <h1
//               className="text-2xl sm:text-3xl font-bold text-stone-800 leading-tight"
//               style={{ fontFamily: "'Lora', serif" }}
//             >
//               Complete Your Purchase
//             </h1>
//             <p className="text-stone-400 text-sm mt-1.5">
//               Fill in your details below to place the order.
//             </p>
//           </div>

//           {/* ── Listing summary card ── */}
//           {listingLoading ? (
//             <div className="rounded-2xl bg-white border border-stone-200 p-5 mb-5 animate-pulse flex gap-4">
//               <div className="w-20 h-20 rounded-xl bg-stone-100 flex-shrink-0" />
//               <div className="flex-1 flex flex-col gap-2.5 justify-center">
//                 <div className="h-3 bg-stone-100 rounded w-3/4" />
//                 <div className="h-3 bg-stone-100 rounded w-1/2" />
//                 <div className="h-3 bg-stone-100 rounded w-1/3" />
//               </div>
//             </div>
//           ) : listing ? (
//             <div className="rounded-2xl bg-white border border-stone-200 shadow-sm shadow-stone-100 p-5 mb-5 flex gap-4 items-start">
//               {/* thumbnail */}
//               <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 flex-shrink-0 border border-stone-100">
//                 {listing.imageUrls[0] ? (
//                   <img
//                     src={listing.imageUrls[0]}
//                     alt={listing.title}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">🌾</div>
//                 )}
//               </div>

//               {/* info */}
//               <div className="flex-1 min-w-0">
//                 <span className="inline-block bg-green-50 text-green-700 text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full border border-green-100 mb-1.5">
//                   {listing.category}
//                 </span>
//                 <p
//                   className="text-stone-800 font-semibold text-sm leading-snug truncate"
//                   style={{ fontFamily: "'Lora', serif" }}
//                 >
//                   {listing.title}
//                 </p>
//                 <p className="text-stone-400 text-xs mt-0.5">📍 {listing.location}</p>

//                 {/* price row */}
//                 <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
//                   <div>
//                     <p className="text-[10px] text-stone-400 uppercase tracking-wide">Price / unit</p>
//                     <p className="text-green-700 font-bold text-sm">
//                       ₹{pricePerUnit.toLocaleString('en-IN')}
//                       <span className="text-stone-400 font-normal"> / {listing.unit}</span>
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-[10px] text-stone-400 uppercase tracking-wide">Stock</p>
//                     <p className="text-stone-700 font-semibold text-sm">
//                       {listing.quantityAvailable} {listing.unit}s
//                     </p>
//                   </div>
//                   {/* seller */}
//                   <div className="flex items-center gap-1.5">
//                     <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
//                       {initials}
//                     </div>
//                     <p className="text-stone-500 text-xs">
//                       {listing.seller.firstName} {listing.seller.lastName}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : null}

//           {/* ── Order total preview ── */}
//           {listing && (
//             <div className="rounded-xl bg-lime-50 border border-lime-200 px-5 py-3.5 mb-5 flex items-center justify-between">
//               <p className="text-lime-700 text-sm font-medium">
//                 {qty} × ₹{pricePerUnit.toLocaleString('en-IN')}
//               </p>
//               <p className="text-lime-800 font-bold text-base" style={{ fontFamily: "'Lora', serif" }}>
//                 Total: ₹{total.toLocaleString('en-IN')}
//               </p>
//             </div>
//           )}

//           {/* ── Form card ── */}
//           <form
//             onSubmit={onSubmit}
//             className="bg-white border border-stone-200 rounded-2xl shadow-sm shadow-stone-100 overflow-hidden"
//           >
//             <div className="h-1 bg-gradient-to-r from-lime-500 to-emerald-500" />

//             <div className="p-6 sm:p-8 space-y-8">

//               {/* ── Quantity ── */}
//               <div>
//                 <p className="text-[11px] text-lime-700 font-semibold uppercase tracking-[0.15em] mb-4">
//                   Order Details
//                 </p>
//                 <Field label="Quantity" required>
//                   <div className="flex items-center gap-3">
//                     <button
//                       type="button"
//                       onClick={() => setPurchasing(prev => ({ ...prev, quantity: Math.max(1, (prev.quantity ?? 1) - 1) }))}
//                       className="w-9 h-9 flex items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:border-lime-400 hover:text-lime-600 transition-all duration-150 text-lg font-medium flex-shrink-0"
//                     >
//                       −
//                     </button>
//                     <input
//                       type="number"
//                       min={1}
//                       max={listing?.quantityAvailable}
//                       value={purchasing.quantity ?? 1}
//                       onChange={e => setPurchasing(prev => ({ ...prev, quantity: Math.max(1, Number(e.target.value)) }))}
//                       className={`${inputCls} text-center w-24`}
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setPurchasing(prev => ({
//                         ...prev,
//                         quantity: Math.min(listing?.quantityAvailable ?? Infinity, (prev.quantity ?? 1) + 1),
//                       }))}
//                       className="w-9 h-9 flex items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:border-lime-400 hover:text-lime-600 transition-all duration-150 text-lg font-medium flex-shrink-0"
//                     >
//                       +
//                     </button>
//                     {listing && (
//                       <span className="text-stone-400 text-xs">
//                         max {listing.quantityAvailable} {listing.unit}s
//                       </span>
//                     )}
//                   </div>
//                 </Field>
//               </div>

//               {/* ── Shipping address ── */}
//               <div>
//                 <p className="text-[11px] text-lime-700 font-semibold uppercase tracking-[0.15em] mb-4">
//                   Shipping Address
//                 </p>
//                 <div className="space-y-4">
//                   <Field label="Street Address" required>
//                     <input
//                       type="text"
//                       placeholder="House no., street, area"
//                       value={purchasing.shippingAddress.street}
//                       onChange={e => setAddress('street', e.target.value)}
//                       className={inputCls}
//                       required
//                     />
//                   </Field>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <Field label="City" required>
//                       <input
//                         type="text"
//                         placeholder="City"
//                         value={purchasing.shippingAddress.city}
//                         onChange={e => setAddress('city', e.target.value)}
//                         className={inputCls}
//                         required
//                       />
//                     </Field>
//                     <Field label="State" required>
//                       <input
//                         type="text"
//                         placeholder="State"
//                         value={purchasing.shippingAddress.state}
//                         onChange={e => setAddress('state', e.target.value)}
//                         className={inputCls}
//                         required
//                       />
//                     </Field>
//                   </div>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <Field label="Pincode" required>
//                       <input
//                         type="text"
//                         placeholder="6-digit pincode"
//                         value={purchasing.shippingAddress.pincode}
//                         onChange={e => setAddress('pincode', e.target.value)}
//                         className={inputCls}
//                         maxLength={6}
//                         pattern="[0-9]{6}"
//                         required
//                       />
//                     </Field>
//                     <Field label="Country">
//                       <input
//                         type="text"
//                         value={purchasing.shippingAddress.country}
//                         onChange={e => setAddress('country', e.target.value)}
//                         className={inputCls}
//                       />
//                     </Field>
//                   </div>
//                 </div>
//               </div>

//               {/* ── Notes ── */}
//               <div>
//                 <p className="text-[11px] text-lime-700 font-semibold uppercase tracking-[0.15em] mb-4">
//                   Additional Notes
//                 </p>
//                 <Field label="Notes (optional)">
//                   <textarea
//                     rows={3}
//                     placeholder="Any special instructions for the seller…"
//                     value={purchasing.notes ?? ''}
//                     onChange={e => setPurchasing(prev => ({ ...prev, notes: e.target.value }))}
//                     className={`${inputCls} resize-none`}
//                   />
//                 </Field>
//               </div>

//               {/* ── Error ── */}
//               {error && (
//                 <div className="flex items-start gap-2.5 rounded-lg bg-red-50 border border-red-100 px-4 py-3">
//                   <span className="text-red-400 text-base leading-none mt-0.5">⚠</span>
//                   <p className="text-red-600 text-sm">{error}</p>
//                 </div>
//               )}

//               {/* ── Actions ── */}
//               <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-2 border-t border-stone-100">
//                 <button
//                   type="button"
//                   onClick={() => router.back()}
//                   className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-stone-200 text-stone-500 text-sm font-medium hover:border-stone-300 hover:text-stone-700 transition-all duration-150"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={submitting || listingLoading}
//                   className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 rounded-lg bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-600 hover:to-emerald-600 text-white text-sm font-medium shadow-sm shadow-lime-200 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150"
//                 >
//                   {submitting ? (
//                     <>
//                       <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
//                       Placing Order…
//                     </>
//                   ) : (
//                     <>🛒 Place Order — ₹{total.toLocaleString('en-IN')}</>
//                   )}
//                 </button>
//               </div>

//             </div>
//           </form>

//         </div>
//       </div>
//     </>
//   )
// }

// export default Purchase

'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getProductDetails } from '@/lib/api/store'
import { PurchaseListing } from '@/types/marketplace'
import { usePurchaseOrder } from '@/lib/api/marketplace'

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
  reviews: unknown[]
  _count: { reviews: number }
}

type FormErrors = Partial<{
  quantity: string
  street: string
  city: string
  state: string
  pincode: string
}>

/* ── Field wrapper ── */
const Field = ({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-stone-500 uppercase tracking-[0.12em]">
      {label}
      {required && <span className="text-lime-600 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-0.5">{error}</p>}
  </div>
)

const inputCls = (hasError?: boolean) =>
  `w-full rounded-lg border ${hasError ? 'border-red-300 focus:border-red-400 focus:ring-red-500/10' : 'border-stone-200 focus:border-lime-500 focus:ring-lime-500/10'} bg-white px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 transition-all duration-150`

const Purchase = () => {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  /* ── listing state ── */
  const [listing, setListing] = useState<ProductDetail | null>(null)
  const [listingLoading, setListingLoading] = useState(true)

  /* ── form state ── */
  const [purchasing, setPurchasing] = useState<PurchaseListing>({
    quantity: 1,
    shippingAddress: { street: '', city: '', state: '', pincode: '', country: 'India' },
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({})
  const { mutateAsync: purchaseOrderMutate, isPending } = usePurchaseOrder()

  /* ── fetch listing ── */
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProductDetails(id)
        setListing(data)
      } catch (err) {
        console.error(err)
      } finally {
        setListingLoading(false)
      }
    }
    if (id) load()
  }, [id])

  /* ── derived ── */
  const qty = purchasing.quantity ?? 1
  const pricePerUnit = listing ? parseFloat(listing.pricePerUnit) : 0
  const total = pricePerUnit * qty
  const initials = listing
    ? (listing.seller.firstName[0] + listing.seller.lastName[0]).toUpperCase()
    : ''

  /* ── helpers ── */
  const setAddress = (field: keyof PurchaseListing['shippingAddress'], value: string) =>
    setPurchasing(prev => ({ ...prev, shippingAddress: { ...prev.shippingAddress, [field]: value } }))

  /* ── validation ── */
  const validate = (): FormErrors => {
    const errs: FormErrors = {}
    const { shippingAddress } = purchasing

    if (!purchasing.quantity || purchasing.quantity < 1) {
      errs.quantity = 'Quantity must be at least 1'
    } else if (listing && purchasing.quantity > listing.quantityAvailable) {
      errs.quantity = `Only ${listing.quantityAvailable} ${listing.unit}s available`
    }

    if (!shippingAddress.street.trim()) {
      errs.street = 'Street address is required'
    }

    if (!shippingAddress.city.trim()) {
      errs.city = 'City is required'
    }

    if (!shippingAddress.state.trim()) {
      errs.state = 'State is required'
    }

    if (!shippingAddress.pincode.trim()) {
      errs.pincode = 'Pincode is required'
    } else if (!/^\d{6}$/.test(shippingAddress.pincode.trim())) {
      errs.pincode = 'Pincode must be exactly 6 digits'
    }

    return errs
  }

  /* ── submit ── */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const errs = validate()
    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) {
      return // stop — don't hit the API with invalid data
    }

    setSubmitting(true)
    try {
      await purchaseOrderMutate({ id, data: purchasing as Record<string, unknown> })
      router.push(`/marketplace/${id}/purchase/order`)
    } catch (err: unknown) {
      console.error('🔴 Purchase failed:', err)
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen bg-stone-50 px-5 py-8 md:px-10 xl:px-16"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="max-w-2xl mx-auto">

          {/* ── Back ── */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-stone-400 hover:text-lime-600 text-sm mb-8 transition-colors duration-150"
          >
            <span className="text-base leading-none">←</span>
            Back to listing
          </button>

          {/* ── Page heading ── */}
          <div className="mb-6">
            <p className="text-xs text-stone-400 uppercase tracking-[0.18em] mb-1">Marketplace</p>
            <h1
              className="text-2xl sm:text-3xl font-bold text-stone-800 leading-tight"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Complete Your Purchase
            </h1>
            <p className="text-stone-400 text-sm mt-1.5">
              Fill in your details below to place the order.
            </p>
          </div>

          {/* ── Listing summary card ── */}
          {listingLoading ? (
            <div className="rounded-2xl bg-white border border-stone-200 p-5 mb-5 animate-pulse flex gap-4">
              <div className="w-20 h-20 rounded-xl bg-stone-100 flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-2.5 justify-center">
                <div className="h-3 bg-stone-100 rounded w-3/4" />
                <div className="h-3 bg-stone-100 rounded w-1/2" />
                <div className="h-3 bg-stone-100 rounded w-1/3" />
              </div>
            </div>
          ) : listing ? (
            <div className="rounded-2xl bg-white border border-stone-200 shadow-sm shadow-stone-100 p-5 mb-5 flex gap-4 items-start">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 flex-shrink-0 border border-stone-100">
                {listing.imageUrls[0] ? (
                  <img
                    src={listing.imageUrls[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">🌾</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <span className="inline-block bg-green-50 text-green-700 text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full border border-green-100 mb-1.5">
                  {listing.category}
                </span>
                <p
                  className="text-stone-800 font-semibold text-sm leading-snug truncate"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  {listing.title}
                </p>
                <p className="text-stone-400 text-xs mt-0.5">📍 {listing.location}</p>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase tracking-wide">Price / unit</p>
                    <p className="text-green-700 font-bold text-sm">
                      ₹{pricePerUnit.toLocaleString('en-IN')}
                      <span className="text-stone-400 font-normal"> / {listing.unit}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-stone-400 uppercase tracking-wide">Stock</p>
                    <p className="text-stone-700 font-semibold text-sm">
                      {listing.quantityAvailable} {listing.unit}s
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                      {initials}
                    </div>
                    <p className="text-stone-500 text-xs">
                      {listing.seller.firstName} {listing.seller.lastName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {listing && (
            <div className="rounded-xl bg-lime-50 border border-lime-200 px-5 py-3.5 mb-5 flex items-center justify-between">
              <p className="text-lime-700 text-sm font-medium">
                {qty} × ₹{pricePerUnit.toLocaleString('en-IN')}
              </p>
              <p className="text-lime-800 font-bold text-base" style={{ fontFamily: "'Lora', serif" }}>
                Total: ₹{total.toLocaleString('en-IN')}
              </p>
            </div>
          )}

          {/* ── Form card ── */}
          <form
            onSubmit={onSubmit}
            noValidate
            className="bg-white border border-stone-200 rounded-2xl shadow-sm shadow-stone-100 overflow-hidden"
          >
            <div className="h-1 bg-gradient-to-r from-lime-500 to-emerald-500" />

            <div className="p-6 sm:p-8 space-y-8">

              {/* ── Quantity ── */}
              <div>
                <p className="text-[11px] text-lime-700 font-semibold uppercase tracking-[0.15em] mb-4">
                  Order Details
                </p>
                <Field label="Quantity" required error={fieldErrors.quantity}>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPurchasing(prev => ({ ...prev, quantity: Math.max(1, (prev.quantity ?? 1) - 1) }))}
                      className="w-9 h-9 flex items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:border-lime-400 hover:text-lime-600 transition-all duration-150 text-lg font-medium flex-shrink-0"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={listing?.quantityAvailable}
                      value={purchasing.quantity ?? 1}
                      onChange={e => setPurchasing(prev => ({ ...prev, quantity: Math.max(1, Number(e.target.value)) }))}
                      className={`${inputCls(!!fieldErrors.quantity)} text-center w-24`}
                    />
                    <button
                      type="button"
                      onClick={() => setPurchasing(prev => ({
                        ...prev,
                        quantity: Math.min(listing?.quantityAvailable ?? Infinity, (prev.quantity ?? 1) + 1),
                      }))}
                      className="w-9 h-9 flex items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:border-lime-400 hover:text-lime-600 transition-all duration-150 text-lg font-medium flex-shrink-0"
                    >
                      +
                    </button>
                    {listing && (
                      <span className="text-stone-400 text-xs">
                        max {listing.quantityAvailable} {listing.unit}s
                      </span>
                    )}
                  </div>
                </Field>
              </div>

              {/* ── Shipping address ── */}
              <div>
                <p className="text-[11px] text-lime-700 font-semibold uppercase tracking-[0.15em] mb-4">
                  Shipping Address
                </p>
                <div className="space-y-4">
                  <Field label="Street Address" required error={fieldErrors.street}>
                    <input
                      type="text"
                      placeholder="House no., street, area"
                      value={purchasing.shippingAddress.street}
                      onChange={e => setAddress('street', e.target.value)}
                      className={inputCls(!!fieldErrors.street)}
                    />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="City" required error={fieldErrors.city}>
                      <input
                        type="text"
                        placeholder="City"
                        value={purchasing.shippingAddress.city}
                        onChange={e => setAddress('city', e.target.value)}
                        className={inputCls(!!fieldErrors.city)}
                      />
                    </Field>
                    <Field label="State" required error={fieldErrors.state}>
                      <input
                        type="text"
                        placeholder="State"
                        value={purchasing.shippingAddress.state}
                        onChange={e => setAddress('state', e.target.value)}
                        className={inputCls(!!fieldErrors.state)}
                      />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Pincode" required error={fieldErrors.pincode}>
                      <input
                        type="text"
                        placeholder="6-digit pincode"
                        value={purchasing.shippingAddress.pincode}
                        onChange={e => setAddress('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className={inputCls(!!fieldErrors.pincode)}
                        maxLength={6}
                      />
                    </Field>
                    <Field label="Country">
                      <input
                        type="text"
                        value={purchasing.shippingAddress.country}
                        onChange={e => setAddress('country', e.target.value)}
                        className={inputCls()}
                      />
                    </Field>
                  </div>
                </div>
              </div>

              {/* ── Notes ── */}
              <div>
                <p className="text-[11px] text-lime-700 font-semibold uppercase tracking-[0.15em] mb-4">
                  Additional Notes
                </p>
                <Field label="Notes (optional)">
                  <textarea
                    rows={3}
                    placeholder="Any special instructions for the seller…"
                    value={purchasing.notes ?? ''}
                    onChange={e => setPurchasing(prev => ({ ...prev, notes: e.target.value }))}
                    className={`${inputCls()} resize-none`}
                  />
                </Field>
              </div>

              {/* ── Error ── */}
              {error && (
                <div className="flex items-start gap-2.5 rounded-lg bg-red-50 border border-red-100 px-4 py-3">
                  <span className="text-red-400 text-base leading-none mt-0.5">⚠</span>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* ── Actions ── */}
              <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-stone-200 text-stone-500 text-sm font-medium hover:border-stone-300 hover:text-stone-700 transition-all duration-150"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || isPending || listingLoading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 rounded-lg bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-600 hover:to-emerald-600 text-white text-sm font-medium shadow-sm shadow-lime-200 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150"
                >
                  {submitting || isPending ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Placing Order…
                    </>
                  ) : (
                    <>🛒 Place Order — ₹{total.toLocaleString('en-IN')}</>
                  )}
                </button>
              </div>

            </div>
          </form>

        </div>
      </div>
    </>
  )
}

export default Purchase