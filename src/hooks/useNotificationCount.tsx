// import { useQuery, useQueryClient } from '@tanstack/react-query'

// function extractCount(data: any): number {
//   if (typeof data?.meta?.total === 'number') return data.meta.total
//   if (typeof data?.count === 'number') return data.count
//   if (Array.isArray(data)) return data.length
//   if (Array.isArray(data?.notifications)) return data.notifications.length
//   return 0
// }
// export const getNotificationCount = async (unreadOnly = true): Promise<number> => {
//     const url = `/api/notifications?page=1&limit=1${unreadOnly ? '&unread=true' : ''}`
//   const res = await fetch(url, {
//     method: 'GET',
//     credentials: 'include',
//   })

//   if (!res.ok) {
//     console.log('error fetching notification count', res.status)
//     return 0
//   }

//   try {
//     const data = await res.json()
//     return extractCount(data)
//   } catch (e) {
//     console.log('failed to parse notification count response', e)
//     return 0
//   }
// }

// export function useNotificationCount() {
//   return useQuery({
//     queryKey: ['notifications-count'],
//     queryFn: getNotificationCount,
//     staleTime: 15000, // treat data as fresh for 15s, avoids refetch spam
//     refetchOnWindowFocus: true, // catch updates when user tabs back in
//   })
// }

// // Convenience helper — call this anywhere a notification/order mutation happens
// export function useInvalidateNotificationCount() {
//   const queryClient = useQueryClient()
//   return () => queryClient.invalidateQueries({ queryKey: ['notifications-count'] })
// }

import { useQuery, useQueryClient } from '@tanstack/react-query'

function extractCount(data: any): number {
  if (typeof data?.meta?.total === 'number') return data.meta.total
  if (typeof data?.count === 'number') return data.count
  if (Array.isArray(data)) return data.length
  if (Array.isArray(data?.notifications)) return data.notifications.length
  return 0
}

export const getNotificationCount = async (
  unreadOnly = true
): Promise<number> => {
  const url = `/api/notifications?page=1&limit=1${
    unreadOnly ? '&unread=true' : ''
  }`

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  })

  if (!res.ok) {
    console.error('Error fetching notification count:', res.status)
    return 0
  }

  try {
    const data = await res.json()
    return extractCount(data)
  } catch (error) {
    console.error('Failed to parse notification count response:', error)
    return 0
  }
}

export function useNotificationCount(unreadOnly = true) {
  return useQuery<number>({
    queryKey: ['notifications-count', unreadOnly],
    queryFn: () => getNotificationCount(unreadOnly),
    staleTime: 15000,
    refetchOnWindowFocus: true,
  })
}

export function useInvalidateNotificationCount() {
  const queryClient = useQueryClient()

  return () =>
    queryClient.invalidateQueries({
      queryKey: ['notifications-count'],
    })
}