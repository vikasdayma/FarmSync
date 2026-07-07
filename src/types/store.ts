export interface Listing {
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
  _count: { reviews: number }
}
