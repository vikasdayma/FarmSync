import { useQuery, useQueryClient } from '@tanstack/react-query'

function extractCount(data: any): number {
  if (typeof data?.meta?.total === 'number') return data.meta.total
  if (typeof data?.meta?.totalCount === 'number') return data.meta.totalCount
  if (typeof data?.count === 'number') return data.count
  if (Array.isArray(data?.data)) return data.data.length
  if (Array.isArray(data)) return data.length
  return 0
}

type OrderCountParams = {
  status?: string
  role?: 'buyer' | 'seller'
}

export const getOrderCount = async ({ status, role }: OrderCountParams = {}): Promise<number> => {
  const params = new URLSearchParams()
  if (status) params.set('status', status)
  if (role) params.set('role', role)
  params.set('limit', '1')

  const res = await fetch(`/api/orders?${params.toString()}`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!res.ok) {
    
    return 0
  }

  try {
    const data = await res.json()
  
    return extractCount(data)
  } catch (e) {
  
    return 0
  }
}

export function useOrderCount(params: OrderCountParams = {}) {
  return useQuery({
    queryKey: ['orders-count', params],
    queryFn: () => getOrderCount(params),
    staleTime: 15000,
    refetchOnWindowFocus: true,
  })
}

export function useInvalidateOrderCount() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ['orders-count'] })
}