import { Farm } from "@/types/farmregistration"

export async function getFarms(): Promise<Farm[]> {
  try {
    const res = await fetch('/api/farms', {
      method: 'GET',
      credentials: 'include',
    })
    if (!res.ok) return []
    const json = await res.json()
    return json.data
  } catch {
    return []
  }
}