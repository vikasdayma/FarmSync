export interface ShippingAddress {
  street: string
  city: string
  state: string
  country: string
  pincode: string
}

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
  expiresAt: string
}

export interface OrderItem {
  id: string
  quantity: number
  unitPrice: string
  total: string
  listing: Listing
}

export interface Payment {
  id: string
  amount: string
  status: string
  method: string
  createdAt: string
}

export interface Order {
  id: string
  buyerId: string
  supplierId: string
  totalAmount: string
  notes: string
  createdAt: string
  shippingAddress: ShippingAddress
  buyer: { id: string; firstName: string; lastName: string; email: string; phone: string }
  supplier: { id: string; firstName: string; lastName: string; email: string; phone: string }
  items: OrderItem[]
  status?: string
  payments: Payment[]
  _count: { payments: number; items: number }
}
