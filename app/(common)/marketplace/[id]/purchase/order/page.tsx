'use client'
import React from 'react'
import { useRouter } from 'next/navigation';
const Order = () => {
  const router=useRouter();
  return (
    <div style={{
      minHeight: '100vh',
      background: '#faf9f7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Georgia', 'Times New Roman', serif",
      padding: '2rem',
    }}>
      <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center' }}>

        {/* Check icon */}
        <div style={{
          width: '72px', height: '72px',
          borderRadius: '50%',
          border: '2px solid #b8860b',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 2rem',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b8860b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <p style={{
          fontSize: '0.72rem',
          letterSpacing: '0.3em',
          color: '#b8860b',
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
        }}>
          Order Confirmed
        </p>

        <h1 style={{
          fontSize: '2.4rem',
          fontWeight: 400,
          color: '#1a1a1a',
          lineHeight: 1.2,
          marginBottom: '1.5rem',
        }}>
          Thank you for<br />your purchase.
        </h1>

        <div style={{ width: '40px', height: '1px', background: '#b8860b', margin: '0 auto 1.5rem' }} />

        <p style={{
          fontSize: '1rem',
          color: '#666',
          lineHeight: 1.7,
          marginBottom: '0.75rem',
          fontStyle: 'italic',
        }}>
          Our seller will contact you shortly to confirm your order details.
        </p>

        <p style={{ fontSize: '0.85rem', color: '#999', marginBottom: '2.5rem' }}>
          A confirmation has been sent to your email.
        </p>

        <button
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.85rem 2rem',
            background: 'transparent',
            border: '1px solid #b8860b',
            color: '#b8860b',
            fontSize: '0.78rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            fontFamily: "'Georgia', serif",
          }}
          onClick={()=>router.push('/dashboard/track-order')}
        >
          Track Your Order
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>

      </div>
    </div>
  )
}

export default Order