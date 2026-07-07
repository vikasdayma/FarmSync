'use client'
import React from 'react'

const TrackOrder = () => {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#e3f3e3',
        fontFamily: "'Segoe UI', sans-serif",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
      }}>
        <div style={{
          maxWidth: '480px',
          textAlign: 'center',
          animation: 'fadeUp 0.5s ease',
        }}>
          <p style={{
            fontSize: '0.72rem',
            letterSpacing: '0.3em',
            color: '#b8860b',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            fontFamily: 'Georgia, serif',
          }}>
            Order Tracking
          </p>

          <div style={{
            fontSize: '3rem',
            marginBottom: '1.5rem',
            animation: 'pulse 2s ease-in-out infinite',
          }}>
            📦
          </div>

          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 400,
            color: '#1a1a1a',
            fontFamily: 'Georgia, serif',
            margin: '0 0 0.75rem 0',
          }}>
            Tracking coming soon
          </h1>

          <p style={{
            fontSize: '0.95rem',
            color: '#888',
            lineHeight: 1.6,
            margin: 0,
          }}>
            We&apos;re working on real-time order tracking. In the meantime,
            you can check your order status and details from your orders page.
          </p>
        </div>
      </div>
    </>
  )
}

export default TrackOrder