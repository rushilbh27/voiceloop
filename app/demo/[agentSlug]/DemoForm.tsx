'use client'

import { useState, useEffect, useRef } from 'react'
import { AgentConfig } from '@/config/agents'
import ResultsCard from '@/components/ResultsCard'

type DemoState = 'idle' | 'initiating' | 'in_progress' | 'completed' | 'failed'

const POLL_INTERVAL = 5000
const MAX_WAIT_MS = 5 * 60 * 1000

interface DemoFormProps {
  agent: AgentConfig
}

function VariableFormFields({
  fields,
  values,
  onChange,
}: {
  fields: AgentConfig['templateContext']
  values: Record<string, string>
  onChange: (v: Record<string, string>) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {fields.map(field => (
        <div key={field.key}>
          <label className="vl-label">
            {field.label}
            {field.required && <span style={{ color: '#7C3AED', marginLeft: 3 }}>*</span>}
          </label>
          {field.type === 'select' && field.options ? (
            <select
              value={values[field.key] ?? ''}
              onChange={e => onChange({ ...values, [field.key]: e.target.value })}
              required={field.required}
              className="vl-input vl-select"
            >
              <option value="" disabled>{field.placeholder}</option>
              {field.options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type === 'number' ? 'number' : 'text'}
              value={values[field.key] ?? ''}
              onChange={e => onChange({ ...values, [field.key]: e.target.value })}
              placeholder={field.placeholder}
              required={field.required}
              className="vl-input"
            />
          )}
        </div>
      ))}
    </div>
  )
}

function SonarVisual({ phoneNumber }: { phoneNumber: string }) {
  const [elapsed, setElapsed] = useState(0)
  const start = useRef(Date.now())

  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - start.current) / 1000)), 1000)
    return () => clearInterval(t)
  }, [])

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const ss = String(elapsed % 60).padStart(2, '0')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', gap: 32 }}>

      {/* Sonar rings */}
      <div style={{ position: 'relative', width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Ring 1 */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '1px solid rgba(16,185,129,0.6)',
          animation: 'sonar 2.4s ease-out infinite',
        }} />
        {/* Ring 2 */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '1px solid rgba(16,185,129,0.4)',
          animation: 'sonar 2.4s ease-out 0.8s infinite',
        }} />
        {/* Ring 3 */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '1px solid rgba(16,185,129,0.25)',
          animation: 'sonar 2.4s ease-out 1.6s infinite',
        }} />

        {/* Center orb */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(16,185,129,0.1) 60%, transparent 100%)',
          border: '1px solid rgba(16,185,129,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 30px rgba(16,185,129,0.3), inset 0 0 20px rgba(16,185,129,0.1)',
          animation: 'pulse-dot 2s ease-in-out infinite',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.87 9.83 19.79 19.79 0 01.81 1.2 2 2 0 012.8 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Status text */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', background: '#10B981',
            animation: 'pulse-dot 1.5s ease-in-out infinite',
          }} />
          <span className="font-display" style={{ fontSize: 18, fontWeight: 700, color: '#10B981' }}>
            Call Active
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
          Connected to {phoneNumber}
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-subtle)', fontVariantNumeric: 'tabular-nums' }}>
          {mm}:{ss} elapsed · polling every 5s
        </p>
      </div>

      {/* Progress bar */}
      <div style={{
        width: '100%', maxWidth: 240, height: 2,
        background: 'rgba(255,255,255,0.06)',
        borderRadius: 1, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: '40%',
          background: 'linear-gradient(90deg, #10B981, #7C3AED)',
          borderRadius: 1,
          animation: 'shimmer 2s linear infinite',
          backgroundSize: '200% auto',
        }} />
      </div>
    </div>
  )
}

export default function DemoForm({ agent }: DemoFormProps) {
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [phoneNumber, setPhoneNumber] = useState('')
  const [state, setState] = useState<DemoState>('idle')
  const [error, setError] = useState('')
  const [callId, setCallId] = useState<string | null>(null)
  const [output, setOutput] = useState<Record<string, unknown> | null>(null)

  const pollRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current) }, [])

  function validate(): boolean {
    for (const field of agent.templateContext) {
      if (field.required && !formValues[field.key]?.trim()) {
        setError(`"${field.label}" is required`)
        return false
      }
    }
    if (!phoneNumber.trim()) { setError('Phone number is required'); return false }
    if (!/^\+\d{7,15}$/.test(phoneNumber.trim())) {
      setError('Must be international format — e.g. +256700000000')
      return false
    }
    return true
  }

  async function startPolling(id: string) {
    startTimeRef.current = Date.now()
    pollRef.current = setInterval(async () => {
      if (Date.now() - startTimeRef.current > MAX_WAIT_MS) {
        clearInterval(pollRef.current!)
        setState('failed')
        setError('Timed out waiting (5 min). Check agent logs.')
        return
      }
      try {
        const res = await fetch(`/api/call-status/${id}`)
        if (!res.ok) return
        const data = await res.json()
        if (data.status === 'completed') {
          clearInterval(pollRef.current!)
          setOutput(data.output)
          setState('completed')
        } else if (data.status === 'failed') {
          clearInterval(pollRef.current!)
          setState('failed')
          setError('Call failed — check agent logs in Ultravox console')
        }
      } catch {}
    }, POLL_INTERVAL)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!validate()) return
    setState('initiating')

    try {
      const res = await fetch('/api/trigger-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: agent.agentId,
          agentSlug: agent.slug,
          templateContext: formValues,
          phoneNumber: phoneNumber.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) { setState('failed'); setError(data.error || 'Failed to start call'); return }
      setCallId(data.callId)
      setState('in_progress')
      startPolling(data.callId)
    } catch {
      setState('failed')
      setError('Network error — could not reach server')
    }
  }

  function reset() {
    if (pollRef.current) clearInterval(pollRef.current)
    setFormValues({})
    setPhoneNumber('')
    setState('idle')
    setError('')
    setCallId(null)
    setOutput(null)
  }

  // --- Completed ---
  if (state === 'completed' && output) {
    return (
      <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ResultsCard output={output} />
        <button
          onClick={reset}
          style={{
            width: '100%', background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '12px 20px', fontSize: 14, fontWeight: 500,
            color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { (e.target as HTMLButtonElement).style.color = 'var(--text)' }}
          onMouseLeave={e => { (e.target as HTMLButtonElement).style.color = 'var(--text-muted)' }}
        >
          ← Start another call
        </button>
      </div>
    )
  }

  // --- In progress ---
  if (state === 'in_progress') {
    return (
      <div className="glass animate-fade-in" style={{ borderRadius: 20, overflow: 'hidden' }}>
        <SonarVisual phoneNumber={phoneNumber} />
      </div>
    )
  }

  // --- Initiating ---
  if (state === 'initiating') {
    return (
      <div className="glass animate-fade-in" style={{ borderRadius: 20, padding: '48px 24px', textAlign: 'center' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin-slow 0.8s linear infinite', display: 'inline-block', marginBottom: 16 }}>
          <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.1)" strokeWidth="2"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Initiating call…</p>
      </div>
    )
  }

  // --- Idle / Failed form ---
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }} noValidate>

      {/* Error banner */}
      {(state === 'failed' || error) && (
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 10, padding: '12px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="1.5"/>
              <path d="M12 8v4M12 16h.01" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: 13, color: '#EF4444' }}>{error || 'Call failed'}</span>
          </div>
          {state === 'failed' && (
            <button type="button" onClick={reset} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--text-muted)', textDecoration: 'underline' }}>
              Reset
            </button>
          )}
        </div>
      )}

      {/* Section A: Call context */}
      <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8L6 7h12l-2-4z" stroke="var(--primary-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--primary-light)' }}>
            Call Context
          </span>
        </div>
        <VariableFormFields
          fields={agent.templateContext}
          values={formValues}
          onChange={setFormValues}
        />
      </div>

      {/* Section B: Phone */}
      <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.87 9.83 19.79 19.79 0 01.81 1.2 2 2 0 012.8 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)' }}>
            Destination
          </span>
        </div>
        <div>
          <label className="vl-label">
            Phone number <span style={{ color: '#7C3AED', marginLeft: 2 }}>*</span>
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            placeholder="+256700000000"
            required
            className="vl-input"
          />
          <p style={{ marginTop: 6, fontSize: 11, color: 'var(--text-subtle)' }}>
            International format · include country code
          </p>
        </div>
      </div>

      {/* CTA */}
      <button type="submit" className="vl-btn-primary" style={{ marginTop: 4 }}>
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.87 9.83 19.79 19.79 0 01.81 1.2 2 2 0 012.8 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Start Call
        </span>
      </button>
    </form>
  )
}
