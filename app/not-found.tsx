'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

const NotFound = () => {
  const router = useRouter()

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#faf9f7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Georgia', 'Times New Roman', serif",
        padding: '2rem',
      }}>
        <div style={{
          maxWidth: '480px',
          width: '100%',
          textAlign: 'center',
          animation: 'fadeUp 0.5s ease',
        }}>

          <p style={{
            fontSize: '0.72rem',
            letterSpacing: '0.3em',
            color: '#b8860b',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>
            Error 404
          </p>

          <h1 style={{
            fontSize: '5rem',
            fontWeight: 400,
            color: '#1a1a1a',
            lineHeight: 1,
            margin: '0 0 1rem 0',
          }}>
            404
          </h1>

          <div style={{ width: '40px', height: '1px', background: '#b8860b', margin: '0 auto 1.5rem' }} />

          <h2 style={{
            fontSize: '1.4rem',
            fontWeight: 400,
            color: '#1a1a1a',
            marginBottom: '0.75rem',
          }}>
            This page has wandered off.
          </h2>

          <p style={{
            fontSize: '0.95rem',
            color: '#888',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
            fontStyle: 'italic',
          }}>
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.85rem 2rem',
                background: '#b8860b',
                border: '1px solid #b8860b',
                color: '#fff',
                fontSize: '0.78rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: "'Georgia', serif",
              }}
              onClick={() => router.push('/dashboard')}
            >
              Go to Dashboard
            </button>

            <button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.85rem 2rem',
                background: 'transparent',
                border: '1px solid #d8d4cf',
                color: '#666',
                fontSize: '0.78rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: "'Georgia', serif",
              }}
              onClick={() => router.back()}
            >
              Go Back
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

export default NotFound