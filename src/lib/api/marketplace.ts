import { CreateMarketplaceListing } from "@/types/marketplace";

// export async function createProduct(inputData: CreateMarketplaceListing) {
//   try {
//     const res = await fetch('/api/marketplace', {   // 👈 leading slash required
//       method: 'POST',
//       credentials: 'include',
//       headers: { 'Content-Type': 'application/json' }, 
//       body: JSON.stringify(inputData)                   
//     })
// const data = await res.json()
// console.log("Full server response:", data)
// console.log("Validation errors:", JSON.stringify(data.errors, null, 2)) // 👈 add this

// if (!res.ok) {
//   throw new Error(data.message || `Request failed with status ${res.status}`)
// }
//     return data

//   } catch (error) {
//     if (error instanceof Error) {
//       throw new Error(`Failed to create listing: ${error.message}`)
//     }
//     throw new Error('An unexpected error occurred')
//   }
// }


import { useMutation, useQueryClient } from '@tanstack/react-query'


export async function createProduct(inputData: CreateMarketplaceListing) {
  try {
    const res = await fetch('/api/marketplace', {   // 👈 leading slash required
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputData)
    })
    const data = await res.json()
    console.log("Full server response:", data)
    console.log("Validation errors:", JSON.stringify(data.errors, null, 2))

    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`)
    }
    return data

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create listing: ${error.message}`)
    }
    throw new Error('An unexpected error occurred')
  }
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (inputData: CreateMarketplaceListing) => createProduct(inputData),
    onSuccess: () => {
      // keep the badge count in sync
      queryClient.invalidateQueries({ queryKey: ['products-count'] })
      // refresh the seller's listing list too, since a new product now exists
      queryClient.invalidateQueries({ queryKey: ['my-listings'] })
    },
  })
}
export const getMyListings = async () => {
  const res = await fetch('/api/marketplace/my-listings', { credentials: 'include' })

  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.message || `Failed to fetch listings (${res.status})`)
  }

  return res.json()
}


export const editListing = async (id: string, data: Record<string, unknown>) => {
  const res = await fetch(`/api/marketplace/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.message || `Failed to update listing (${res.status})`)
  }

  return res.json()
}

// export const PurchaseOrder = async (id: string, data: Record<string, unknown>) => {
//   const res = await fetch(`/api/marketplace/${id}/purchase`, {
//     method: 'POST',
//     credentials: 'include',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   })

//   if (!res.ok) {
//     const err = await res.json().catch(() => null)
//     console.error('🔴 Server error response:', err)  // full object in browser console
//     // show the most detailed message available
//     const message =
//       err?.message ||
//       err?.error ||
//       err?.details ||
//       JSON.stringify(err) ||       // shows full object if none of the above
//       `Request failed (${res.status})`
//     throw new Error(message)
//   }

//   return res.json()
// }



export const PurchaseOrder = async (id: string, data: Record<string, unknown>) => {
  const res = await fetch(`/api/marketplace/${id}/purchase`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => null)
    console.error('🔴 Server error response:', err)  // full object in browser console
    const message =
      err?.message ||
      err?.error ||
      err?.details ||
      JSON.stringify(err) ||
      `Request failed (${res.status})`
    throw new Error(message)
  }

  return res.json()
}

export function usePurchaseOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      PurchaseOrder(id, data),
    onSuccess: () => {
      // a new order now exists — keep the badge count in sync
      queryClient.invalidateQueries({ queryKey: ['orders-count'] })
      // refresh whatever list view shows orders
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      // purchasing likely affects stock/quantity on the listing — refresh those too
      queryClient.invalidateQueries({ queryKey: ['products-count'] })
      queryClient.invalidateQueries({ queryKey: ['my-listings'] })
    },
  })
}