'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="login-grid">

      {/* ── LEFT: Brand column ── */}
      <div className="login-brand-col animate-enter-left" style={{
        padding: '52px 64px',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100vh',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 7,
            background: 'var(--red)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.87 9.83 19.79 19.79 0 01.81 1.2 2 2 0 012.8 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16, fontWeight: 700,
            color: 'var(--text)', letterSpacing: '-0.01em',
          }}>
            VoiceLoop
          </span>
        </div>

        {/* Hero statement */}
        <div>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10, color: 'var(--red)',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            marginBottom: 28,
          }}>
            Pingdrip — Internal Demo
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(42px, 4.5vw, 64px)',
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: '-0.035em',
            color: 'var(--text)',
            marginBottom: 28,
          }}>
            AI agent<br />
            testing<br />
            <span style={{ color: 'var(--red)' }}>environment.</span>
          </h1>
          <p style={{
            fontSize: 15, color: 'var(--text-2)',
            lineHeight: 1.7, maxWidth: 340,
          }}>
            Internal sandbox for testing live AI voice agents before production deployment.
          </p>
        </div>

        {/* Feature list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            'Live outbound call testing',
            'Real call recordings & transcripts',
            'Structured output capture',
          ].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--red)',
                boxShadow: '0 0 8px rgba(255,59,59,0.7)',
                flexShrink: 0,
                animation: 'breathe 3s ease-in-out infinite',
              }} />
              <span style={{
                fontSize: 12,
                color: 'var(--text-3)',
                fontFamily: 'var(--font-mono)',
              }}>
                {f}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Form column ── */}
      <div className="animate-enter" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '52px 48px',
        minHeight: '100vh',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 34, fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            marginBottom: 6,
          }}>
            Sign in
          </h2>
          <p style={{
            fontSize: 14, color: 'var(--text-2)',
            marginBottom: 36, lineHeight: 1.5,
          }}>
            Sign in to access the Pingdrip demo portal
          </p>

          {error && (
            <div style={{
              background: 'var(--red-surface)',
              border: '1px solid rgba(255,59,59,0.2)',
              borderRadius: 8,
              padding: '10px 14px', marginBottom: 20,
              fontSize: 13, color: 'var(--red)',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label className="field-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                autoFocus
                className="field-input"
              />
            </div>
            <div>
              <label className="field-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="field-input"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ marginTop: 4 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" style={{ animation: 'spin 0.7s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="2" fill="none"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  </svg>
                  Signing in
                </span>
              ) : 'Sign in →'}
            </button>
          </form>

          <p style={{
            marginTop: 32, fontSize: 11,
            color: 'var(--text-3)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.06em',
          }}>
            Authorized access only
          </p>
        </div>
      </div>

    </div>
  )
}
