// types/marketplace.ts

export interface MarketplaceListing {
  id: string
  sellerId: string
  title: string
  description: string
  category: string
  pricePerUnit: number
  unit: string
  quantityAvailable: number
  imageUrls: string[]
  location: string
  status: "ACTIVE" | "SOLD" | "EXPIRED" | "REMOVED"
  expiresAt: string | null
  deletedAt: string | null
  createdAt: string
  updatedAt: string

  // Relations (included when backend uses `include`)
  seller?: {
    id: string
    firstName: string
    lastName: string
  }
  reviews?: {
    id: string
    rating: number
    comment: string
    createdAt: string
    user: {
      id: string
      firstName: string
    }
  }[]
  _count?: {
    reviews: number
  }
}


export interface CreateMarketplaceListing {
  title: string
  description: string
  category: string
  pricePerUnit: number
  unit: string
  quantityAvailable: number
  location: string
  imageUrls: string[]
  expiresAt?: string
}

// For purchase
export interface Purchase {
  id: string
  listingId: string
  buyerId: string
  sellerId: string
  quantity: number
  unitPrice: number
  totalAmount: number
  shippingAddress: string
  notes?: string
  createdAt: string
}

// For purchase form



export type PurchaseListing = {
  quantity?: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  notes?: string;
}

