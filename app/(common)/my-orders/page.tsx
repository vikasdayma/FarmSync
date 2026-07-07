// 'use client'
// import React, { useEffect, useState } from 'react'
// import { getMyOrders } from '@/lib/api/orders'

// interface ShippingAddress {
//   street: string
//   city: string
//   state: string
//   country: string
//   pincode: string
// }

// interface OrderItem {
//   id: string
//   quantity: number
//   unitPrice: string
//   total: string
// }

// interface Order {
//   id: string
//   buyerId: string
//   supplierId: string
//   totalAmount: string
//   notes: string
//   createdAt: string
//   shippingAddress: ShippingAddress
//   buyer: { id: string; firstName: string; lastName: string }
//   supplier: { id: string; firstName: string; lastName: string }
//   items: OrderItem[]
//   status?: string
//   _count: { payments: number }
// }

// const statusColor: Record<string, { bg: string; text: string; dot: string }> = {
//   PENDING:    { bg: '#fef9ec', text: '#92650a', dot: '#f59e0b' },
//   CONFIRMED:  { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6' },
//   SHIPPED:    { bg: '#f0fdf4', text: '#166534', dot: '#22c55e' },
//   DELIVERED:  { bg: '#f0fdf4', text: '#166534', dot: '#16a34a' },
//   CANCELLED:  { bg: '#fef2f2', text: '#991b1b', dot: '#ef4444' },
// }

// const formatDate = (iso: string) => {
//   const d = new Date(iso)
//   return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
// }

// const formatAmount = (amount: string) =>
//   `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`

// const OrderCard = ({ order, index }: { order: Order; index: number }) => {
//   const status = order.status || 'PENDING'
//   const colors = statusColor[status] || statusColor['PENDING']

//   return (
//     <div
//       style={{
//         background: '#fff',
//         border: '1px solid #e8e4df',
//         borderRadius: '12px',
//         padding: '1.5rem',
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '1rem',
//         opacity: 0,
//         animation: `fadeUp 0.4s ease forwards`,
//         animationDelay: `${index * 80}ms`,
//         transition: 'box-shadow 0.2s ease, transform 0.2s ease',
//         cursor: 'default',
//       }}
//       onMouseEnter={e => {
//         (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'
//         ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
//       }}
//       onMouseLeave={e => {
//         (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
//         ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
//       }}
//     >
//       {/* Top row */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
//         <div>
//           <p style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: '#b8860b', textTransform: 'uppercase', marginBottom: '0.25rem', fontFamily: 'Georgia, serif' }}>
//             Order
//           </p>
//           <p style={{ fontSize: '0.78rem', color: '#999', fontFamily: 'monospace' }}>
//             #{order.id.slice(0, 8).toUpperCase()}
//           </p>
//         </div>

//         {/* Status badge */}
//         <span style={{
//           display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
//           padding: '0.3rem 0.75rem',
//           borderRadius: '999px',
//           background: colors.bg,
//           color: colors.text,
//           fontSize: '0.72rem',
//           fontWeight: 600,
//           letterSpacing: '0.05em',
//         }}>
//           <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.dot, display: 'inline-block' }} />
//           {status}
//         </span>
//       </div>

//       {/* Divider */}
//       <div style={{ height: '1px', background: '#f0ece8' }} />

//       {/* Supplier & Date */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
//         <div>
//           <p style={{ fontSize: '0.7rem', color: '#aaa', marginBottom: '0.2rem' }}>Supplier</p>
//           <p style={{ fontSize: '0.9rem', color: '#1a1a1a', fontFamily: 'Georgia, serif' }}>
//             {order.supplier.firstName} {order.supplier.lastName}
//           </p>
//         </div>
//         <div style={{ textAlign: 'right' }}>
//           <p style={{ fontSize: '0.7rem', color: '#aaa', marginBottom: '0.2rem' }}>Placed on</p>
//           <p style={{ fontSize: '0.85rem', color: '#555' }}>{formatDate(order.createdAt)}</p>
//         </div>
//       </div>

//       {/* Shipping Address */}
//       <div style={{ background: '#faf9f7', borderRadius: '8px', padding: '0.75rem 1rem' }}>
//         <p style={{ fontSize: '0.7rem', color: '#aaa', marginBottom: '0.3rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Shipping to</p>
//         <p style={{ fontSize: '0.85rem', color: '#555', lineHeight: 1.5 }}>
//           {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
//         </p>
//       </div>

//       {/* Items count & total */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <p style={{ fontSize: '0.8rem', color: '#888' }}>
//           {order.items.length} item{order.items.length !== 1 ? 's' : ''} · {order._count.payments} payment{order._count.payments !== 1 ? 's' : ''}
//         </p>
//         <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1a1a1a', fontFamily: 'Georgia, serif' }}>
//           {formatAmount(order.totalAmount)}
//         </p>
//       </div>
//     </div>
//   )
// }

// const MyOrder = () => {
//   const [orders, setOrders] = useState<Order[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     async function fetchOrders() {
//       try {
//         const res = await getMyOrders()
//         setOrders(res.data || [])
//       } catch (err) {
//         setError('Failed to load orders.')
//         console.error(err)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchOrders()
//   }, [])
// console.log(orders)
//   return (
//     <>
//       <style>{`
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(16px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }
//       `}</style>

//       <div style={{
//         minHeight: '100vh',
//         background: '#faf9f7',
//         fontFamily: "'Segoe UI', sans-serif",
//         padding: '2.5rem 1.5rem',
//       }}>
//         <div style={{ maxWidth: '720px', margin: '0 auto' }}>

//           {/* Header */}
//           <div style={{ marginBottom: '2rem' }}>
//             <p style={{ fontSize: '0.72rem', letterSpacing: '0.3em', color: '#b8860b', textTransform: 'uppercase', marginBottom: '0.4rem', fontFamily: 'Georgia, serif' }}>
//               My Account
//             </p>
//             <h1 style={{ fontSize: '2rem', fontWeight: 400, color: '#1a1a1a', fontFamily: 'Georgia, serif', margin: 0 }}>
//               My Orders
//             </h1>
//           </div>

//           {/* Loading */}
//           {loading && (
//             <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
//               <div style={{
//                 width: '32px', height: '32px',
//                 border: '2px solid #e8e4df',
//                 borderTop: '2px solid #b8860b',
//                 borderRadius: '50%',
//                 animation: 'spin 0.8s linear infinite',
//               }} />
//             </div>
//           )}

//           {/* Error */}
//           {error && (
//             <div style={{ textAlign: 'center', padding: '4rem 0', color: '#999' }}>
//               <p style={{ fontSize: '0.95rem' }}>{error}</p>
//             </div>
//           )}

//           {/* Empty */}
//           {!loading && !error && orders.length === 0 && (
//             <div style={{ textAlign: 'center', padding: '5rem 0' }}>
//               <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📦</p>
//               <p style={{ fontSize: '1rem', color: '#aaa', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>No orders yet.</p>
//             </div>
//           )}

//           {/* Orders list */}
//           {!loading && !error && orders.length > 0 && (
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//               {orders.map((order, i) => (
//                 <OrderCard key={order.id} order={order} index={i} />
//               ))}
//             </div>
//           )}

//         </div>
//       </div>
//     </>
//   )
// }

// export default MyOrder

'use client'
import React, { useEffect, useState } from 'react'
import { getMyOrders } from '@/lib/api/orders'

interface ShippingAddress {
  street: string
  city: string
  state: string
  country: string
  pincode: string
}

interface Listing {
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

interface OrderItem {
  id: string
  quantity: number
  unitPrice: string
  total: string
  listing: Listing
}

interface Order {
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
  payments: { id: string; amount: string; status: string; method: string; createdAt: string }[]
  _count: { payments: number; items: number }
}

const statusColor: Record<string, { bg: string; text: string; dot: string }> = {
  PENDING:   { bg: '#fef9ec', text: '#92650a', dot: '#f59e0b' },
  CONFIRMED: { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6' },
  SHIPPED:   { bg: '#f0fdf4', text: '#166534', dot: '#22c55e' },
  DELIVERED: { bg: '#f0fdf4', text: '#166534', dot: '#16a34a' },
  CANCELLED: { bg: '#fef2f2', text: '#991b1b', dot: '#ef4444' },
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

const formatAmount = (amount: string) =>
  `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`

const OrderCard = ({ order, index }: { order: Order; index: number }) => {
  const [expanded, setExpanded] = useState(false)
  const status = order.status || 'PENDING'
  const colors = statusColor[status] || statusColor['PENDING']

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e8e4df',
        borderRadius: '14px',
        overflow: 'hidden',
        opacity: 0,
        animation: `fadeUp 0.4s ease forwards`,
        animationDelay: `${index * 80}ms`,
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
      }}
    >
      {/* Card Body */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Top row: Order ID + Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: '#b8860b', textTransform: 'uppercase', marginBottom: '0.25rem', fontFamily: 'Georgia, serif' }}>
              Order
            </p>
            <p style={{ fontSize: '0.78rem', color: '#999', fontFamily: 'monospace' }}>
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.3rem 0.75rem',
            borderRadius: '999px',
            background: colors.bg,
            color: colors.text,
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.dot, display: 'inline-block' }} />
            {status}
          </span>
        </div>

        <div style={{ height: '1px', background: '#f0ece8' }} />

        {/* Supplier & Date */}
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <p style={{ fontSize: '0.7rem', color: '#aaa', marginBottom: '0.2rem' }}>Supplier</p>
            <p style={{ fontSize: '0.9rem', color: '#1a1a1a', fontFamily: 'Georgia, serif' }}>
              {order.supplier.firstName} {order.supplier.lastName}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#999' }}>{order.supplier.email}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.7rem', color: '#aaa', marginBottom: '0.2rem' }}>Placed on</p>
            <p style={{ fontSize: '0.85rem', color: '#555' }}>{formatDate(order.createdAt)}</p>
          </div>
        </div>

        {/* Items Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {order.items.map((item) => (
            <div key={item.id} style={{
              display: 'flex', gap: '0.75rem', alignItems: 'center',
              background: '#faf9f7', borderRadius: '10px', padding: '0.75rem',
            }}>
              {/* Listing Image */}
              {item.listing?.imageUrls?.[0] && (
                <img
                  src={item.listing.imageUrls[0]}
                  alt={item.listing.title}
                  style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.15rem', fontFamily: 'Georgia, serif' }}>
                  {item.listing?.title}
                </p>
                <p style={{ fontSize: '0.72rem', color: '#aaa', marginBottom: '0.2rem' }}>
                  {item.listing?.category} · 📍 {item.listing?.location}
                </p>
                <p style={{ fontSize: '0.78rem', color: '#777' }}>
                  {item.quantity} {item.listing?.unit} × {formatAmount(item.unitPrice)}
                </p>
              </div>
              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1a1a1a', fontFamily: 'Georgia, serif', flexShrink: 0 }}>
                {formatAmount(item.total)}
              </p>
            </div>
          ))}
        </div>

        {/* Shipping Address */}
        <div style={{ background: '#faf9f7', borderRadius: '8px', padding: '0.75rem 1rem' }}>
          <p style={{ fontSize: '0.7rem', color: '#aaa', marginBottom: '0.3rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Shipping to</p>
          <p style={{ fontSize: '0.85rem', color: '#555', lineHeight: 1.5 }}>
            {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
          </p>
        </div>

        {/* Footer: item count + total + expand */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setExpanded(prev => !prev)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.78rem', color: '#b8860b', fontWeight: 600,
              padding: 0, letterSpacing: '0.03em',
            }}
          >
            {expanded ? '▲ Hide details' : '▼ More details'}
          </button>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1a1a1a', fontFamily: 'Georgia, serif' }}>
            {formatAmount(order.totalAmount)}
          </p>
        </div>
      </div>

      {/* Expanded Section */}
      {expanded && (
        <div style={{
          borderTop: '1px solid #f0ece8',
          padding: '1.25rem 1.5rem',
          background: '#fdfcfb',
          display: 'flex', flexDirection: 'column', gap: '1rem',
        }}>

          {/* Buyer Info */}
          <div>
            <p style={{ fontSize: '0.7rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Buyer</p>
            <p style={{ fontSize: '0.88rem', color: '#1a1a1a', fontFamily: 'Georgia, serif' }}>
              {order.buyer.firstName} {order.buyer.lastName}
            </p>
            <p style={{ fontSize: '0.78rem', color: '#999' }}>{order.buyer.email} · {order.buyer.phone}</p>
          </div>

          {/* Listing Description */}
          {order.items.map((item) => item.listing?.description && (
            <div key={item.id}>
              <p style={{ fontSize: '0.7rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
                About "{item.listing.title}"
              </p>
              <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.6 }}>{item.listing.description}</p>
              <p style={{ fontSize: '0.78rem', color: '#aaa', marginTop: '0.3rem' }}>
                Stock available: {item.listing.quantityAvailable} {item.listing.unit} · Expires: {formatDate(item.listing.expiresAt)}
              </p>
            </div>
          ))}

          {/* Payments */}
          <div>
            <p style={{ fontSize: '0.7rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
              Payments ({order._count.payments})
            </p>
            {order.payments.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#bbb', fontStyle: 'italic' }}>No payments recorded yet.</p>
            ) : (
              order.payments.map(p => (
                <div key={p.id} style={{ fontSize: '0.85rem', color: '#555' }}>
                  {formatAmount(p.amount)} · {p.method} · {p.status} · {formatDate(p.createdAt)}
                </div>
              ))
            )}
          </div>

          {/* Notes */}
          {order.notes && (
            <div>
              <p style={{ fontSize: '0.7rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Notes</p>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>{order.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const MyOrder = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await getMyOrders('buyer')
        setOrders(res.data.data || [])
      } catch (err) {
        setError('Failed to load orders.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#faf9f7',
        fontFamily: "'Segoe UI', sans-serif",
        padding: '2.5rem 1.5rem',
      }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>

          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.3em', color: '#b8860b', textTransform: 'uppercase', marginBottom: '0.4rem', fontFamily: 'Georgia, serif' }}>
              My Account
            </p>
            <h1 style={{ fontSize: '2rem', fontWeight: 400, color: '#1a1a1a', fontFamily: 'Georgia, serif', margin: 0 }}>
              My Orders
            </h1>
          </div>

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
              <div style={{
                width: '32px', height: '32px',
                border: '2px solid #e8e4df',
                borderTop: '2px solid #b8860b',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
            </div>
          )}

          {error && (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#999' }}>
              <p style={{ fontSize: '0.95rem' }}>{error}</p>
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📦</p>
              <p style={{ fontSize: '1rem', color: '#aaa', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>No orders yet.</p>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.map((order, i) => (
                <OrderCard key={order.id} order={order} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default MyOrder