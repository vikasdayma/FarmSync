import {  Order, } from "@/generated/prisma/client";
import { useState } from "react";
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

const formatAmount = (amount: string) =>
  `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`

const statusColor: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  PENDING:   { bg: '#fffbeb', text: '#92650a', dot: '#f59e0b', border: '#fde68a' },
  CONFIRMED: { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6', border: '#bfdbfe' },
  SHIPPED:   { bg: '#f0fdf4', text: '#166534', dot: '#22c55e', border: '#bbf7d0' },
  DELIVERED: { bg: '#f0fdf4', text: '#15803d', dot: '#16a34a', border: '#86efac' },
  CANCELLED: { bg: '#fef2f2', text: '#991b1b', dot: '#ef4444', border: '#fecaca' },
}
export const SaleCard = ({ order, index }: { order: any; index: number }) => {
  const [expanded, setExpanded] = useState(false)
  const status = order.status || 'PENDING'
  const colors = statusColor[status] || statusColor['PENDING']

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e8e4df',
      borderRadius: '14px',
      overflow: 'hidden',
      opacity: 0,
      animation: 'fadeUp 0.4s ease forwards',
      animationDelay: `${index * 80}ms`,
      transition: 'box-shadow 0.2s ease, transform 0.2s ease',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.07)'
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
      }}
    >
      {/* Status bar accent */}
      <div style={{ height: '4px', background: colors.dot }} />

      <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Top: Order ID + Status + Amount */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <p style={{ fontSize: '0.68rem', letterSpacing: '0.15em', color: '#b8860b', textTransform: 'uppercase', fontFamily: 'Georgia, serif', marginBottom: '0.2rem' }}>
              Sale Order
            </p>
            <p style={{ fontSize: '0.78rem', color: '#bbb', fontFamily: 'monospace' }}>
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.28rem 0.7rem',
              borderRadius: '999px',
              background: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              fontSize: '0.71rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.dot }} />
              {status}
            </span>
            <p style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1a1a1a', fontFamily: 'Georgia, serif' }}>
              {formatAmount(order.totalAmount)}
            </p>
          </div>
        </div>

        <div style={{ height: '1px', background: '#f0ece8' }} />

        {/* Buyer info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {/* Avatar */}
            <div style={{
              width: '38px', height: '38px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #b8860b22, #b8860b44)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', fontWeight: 700, color: '#b8860b', fontFamily: 'Georgia, serif',
              flexShrink: 0,
            }}>
              {order.buyer.firstName[0]}
            </div>
            <div>
              <p style={{ fontSize: '0.7rem', color: '#aaa', marginBottom: '0.15rem' }}>Buyer</p>
              <p style={{ fontSize: '0.92rem', color: '#1a1a1a', fontFamily: 'Georgia, serif', fontWeight: 500 }}>
                {order.buyer.firstName} {order.buyer.lastName}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#999' }}>{order.buyer.email}</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.7rem', color: '#aaa', marginBottom: '0.15rem' }}>Ordered on</p>
            <p style={{ fontSize: '0.85rem', color: '#555' }}>{formatDate(order.createdAt)}</p>
          </div>
        </div>

        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {order.items.map((item:any) => (
            <div key={item.id} style={{
              display: 'flex', gap: '0.75rem', alignItems: 'center',
              background: '#faf9f7', borderRadius: '10px', padding: '0.7rem 0.9rem',
            }}>
              {item.listing?.imageUrls?.[0] && (
                <img
                  src={item.listing.imageUrls[0]}
                  alt={item.listing.title}
                  style={{ width: '52px', height: '52px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0, border: '1px solid #e8e4df' }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1a1a1a', fontFamily: 'Georgia, serif' }}>
                  {item.listing?.title}
                </p>
                <p style={{ fontSize: '0.72rem', color: '#aaa', marginTop: '0.1rem' }}>
                  {item.listing?.category} · 📍 {item.listing?.location}
                </p>
                <p style={{ fontSize: '0.78rem', color: '#888', marginTop: '0.15rem' }}>
                  Qty: <strong>{item.quantity} {item.listing?.unit}</strong> · {formatAmount(item.unitPrice)} / {item.listing?.unit}
                </p>
              </div>
              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a1a1a', fontFamily: 'Georgia, serif', flexShrink: 0 }}>
                {formatAmount(item.total)}
              </p>
            </div>
          ))}
        </div>

        {/* Deliver to */}
        <div style={{ background: '#faf9f7', borderRadius: '8px', padding: '0.7rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '0.85rem', marginTop: '1px' }}>📦</span>
          <div>
            <p style={{ fontSize: '0.68rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Deliver to</p>
            <p style={{ fontSize: '0.83rem', color: '#555', lineHeight: 1.5 }}>
              {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#aaa' }}>
              🛍 {order._count.items} item{order._count.items !== 1 ? 's' : ''}
            </span>
            <span style={{ fontSize: '0.75rem', color: order._count.payments > 0 ? '#16a34a' : '#aaa' }}>
              💳 {order._count.payments > 0 ? `${order._count.payments} payment(s)` : 'Unpaid'}
            </span>
          </div>
          <button
            onClick={() => setExpanded(p => !p)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.78rem', color: '#b8860b', fontWeight: 600,
              padding: 0, letterSpacing: '0.03em',
            }}
          >
            {expanded ? '▲ Less' : '▼ More'}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={{
          borderTop: '1px solid #f0ece8',
          padding: '1.25rem 1.5rem',
          background: '#fdfcfb',
          display: 'flex', flexDirection: 'column', gap: '1rem',
        }}>

          {/* Buyer contact */}
          <div>
            <p style={{ fontSize: '0.68rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Buyer Contact</p>
            <p style={{ fontSize: '0.85rem', color: '#555' }}>📧 {order.buyer.email}</p>
            <p style={{ fontSize: '0.85rem', color: '#555', marginTop: '0.2rem' }}>📞 {order.buyer.phone}</p>
          </div>

          {/* Payment details */}
          <div>
            <p style={{ fontSize: '0.68rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
              Payments
            </p>
            {order.payments.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#bbb', fontStyle: 'italic' }}>No payments received yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {order.payments.map((p:any) => (
                  <div key={p.id} style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: '0.83rem', color: '#555',
                    background: '#f4f4f2', borderRadius: '6px', padding: '0.4rem 0.75rem',
                  }}>
                    <span>{p.method} · {p.status}</span>
                    <span style={{ fontWeight: 600 }}>{formatAmount(p.amount)} · {formatDate(p.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Listing descriptions */}
          {order.items.map((item:any) => item.listing?.description && (
            <div key={item.id}>
              <p style={{ fontSize: '0.68rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
                Listing — {item.listing.title}
              </p>
              <p style={{ fontSize: '0.83rem', color: '#666', lineHeight: 1.6 }}>{item.listing.description}</p>
              <p style={{ fontSize: '0.75rem', color: '#bbb', marginTop: '0.3rem' }}>
                Stock left: {item.listing.quantityAvailable} {item.listing.unit} · Expires: {formatDate(item.listing.expiresAt)}
              </p>
            </div>
          ))}

          {/* Notes */}
          {order.notes && (
            <div>
              <p style={{ fontSize: '0.68rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Notes from Buyer</p>
              <p style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>"{order.notes}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}