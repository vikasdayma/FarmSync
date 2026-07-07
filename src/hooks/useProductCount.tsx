import { useQuery, useQueryClient } from '@tanstack/react-query'

function extractCount(data: any): number {
  if (typeof data?.meta?.total === 'number') return data.meta.total
  if (typeof data?.meta?.totalCount === 'number') return data.meta.totalCount
  if (typeof data?.count === 'number') return data.count
  if (Array.isArray(data?.data)) return data.data.length
  if (Array.isArray(data?.listings)) return data.listings.length
  if (Array.isArray(data)) return data.length
  return 0
}

export const getProductCount = async (): Promise<number> => {
  const res = await fetch('/api/marketplace/my-listings', {
    method: 'GET',
    credentials: 'include',
  })

  if (!res.ok) {
    console.log('error fetching product count', res.status)
    return 0
  }

  try {
    const data = await res.json()
    return extractCount(data)
  } catch (e) {
    console.log('failed to parse product count response', e)
    return 0
  }
}

export function useProductCount() {
  return useQuery({
    queryKey: ['products-count'],
    queryFn: getProductCount,
    staleTime: 15000, // treat data as fresh for 15s, avoids refetch spam
    refetchOnWindowFocus: true, // catch updates when user tabs back in
  })
}

// Convenience helper — call this anywhere a product/listing mutation happens
// (createProduct, editListing, delete, etc.)
export function useInvalidateProductCount() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ['products-count'] })
}