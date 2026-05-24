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
  fields, values, onChange,
}: {
  fields: AgentConfig['templateContext']
  values: Record<string, string>
  onChange: (v: Record<string, string>) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {fields.map(field => (
        <div key={field.key}>
          <label className="field-label">
            {field.label}
            {field.required && <span style={{ color: 'var(--red)', marginLeft: 3 }}>*</span>}
          </label>
          {field.type === 'select' && field.options ? (
            <select
              value={values[field.key] ?? ''}
              onChange={e => onChange({ ...values, [field.key]: e.target.value })}
              required={field.required}
              className="field-input field-select"
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
              className="field-input"
            />
          )}
        </div>
      ))}
    </div>
  )
}

function CallActive({ phoneNumber }: { phoneNumber: string }) {
  const [elapsed, setElapsed] = useState(0)
  const start = useRef(Date.now())

  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - start.current) / 1000)), 1000)
    return () => clearInterval(t)
  }, [])

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const ss = String(elapsed % 60).padStart(2, '0')

  return (
    <div className="card animate-fade" style={{ padding: '48px 24px', textAlign: 'center' }}>
      {/* Pulse indicator */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', width: 64, height: 64, marginBottom: 24,
      }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'rgba(45,212,160,0.12)',
          animation: 'ping 1.6s cubic-bezier(0,0,0.2,1) infinite',
        }} />
        <div style={{
          width: 18, height: 18, borderRadius: '50%',
          background: '#2DD4A0',
          boxShadow: '0 0 16px rgba(45,212,160,0.6)',
          position: 'relative',
        }} />
      </div>

      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 17, fontWeight: 800,
        color: 'var(--text)', marginBottom: 4,
        letterSpacing: '-0.02em',
      }}>
        Call in progress
      </div>
      <div style={{
        fontSize: 12, fontFamily: 'var(--font-mono)',
        color: 'var(--text-3)', marginBottom: 6,
      }}>
        {phoneNumber}
      </div>
      <div style={{
        fontSize: 28, fontWeight: 800,
        fontFamily: 'var(--font-display)',
        letterSpacing: '-0.03em',
        color: 'var(--text)', marginTop: 20,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {mm}:{ss}
      </div>
      <div style={{
        fontSize: 10, fontFamily: 'var(--font-mono)',
        color: 'var(--text-3)', marginTop: 6,
        letterSpacing: '0.06em',
      }}>
        polling every 5s
      </div>

      {/* Shimmer bar */}
      <div style={{
        width: 120, height: 2, margin: '20px auto 0',
        background: 'var(--border)', borderRadius: 1, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: '40%',
          background: 'linear-gradient(90deg, transparent, #2DD4A0, transparent)',
          backgroundSize: '200% 100%',
          animation: 'slide 1.5s linear infinite',
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
      setError('International format required — e.g. +256700000000')
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
        setError('Timed out (5 min). Check agent logs.')
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
          setError('Call failed — check Ultravox console')
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
      setError('Network error')
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

  if (state === 'completed' && output) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <ResultsCard output={output} />
        <button onClick={reset} className="btn-ghost" style={{ width: '100%' }}>
          Start another call
        </button>
      </div>
    )
  }

  if (state === 'in_progress') {
    return <CallActive phoneNumber={phoneNumber} />
  }

  if (state === 'initiating') {
    return (
      <div className="card animate-fade" style={{ padding: '56px 24px', textAlign: 'center' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{
          animation: 'spin 0.7s linear infinite',
          display: 'inline-block', marginBottom: 14,
        }}>
          <circle cx="12" cy="12" r="10" stroke="var(--border)" strokeWidth="2"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="var(--red)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 14, fontWeight: 700,
          color: 'var(--text-2)',
          letterSpacing: '-0.01em',
        }}>
          Initiating call...
        </p>
      </div>
    )
  }

  /* Section label style */
  const sectionLabel: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--text-3)',
    marginBottom: 18,
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }} noValidate>
      {/* Error banner */}
      {(state === 'failed' || error) && (
        <div style={{
          background: 'var(--red-surface)',
          border: '1px solid rgba(255,59,59,0.18)',
          borderRadius: 10, padding: '10px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 13, color: 'var(--red)' }}>{error || 'Call failed'}</span>
          {state === 'failed' && (
            <button type="button" onClick={reset} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 11, fontFamily: 'var(--font-mono)',
              color: 'var(--text-3)', textDecoration: 'underline',
            }}>
              Reset
            </button>
          )}
        </div>
      )}

      {/* Call context section */}
      <div className="card" style={{ padding: 24 }}>
        <p style={sectionLabel}>Call context</p>
        <VariableFormFields
          fields={agent.templateContext}
          values={formValues}
          onChange={setFormValues}
        />
      </div>

      {/* Destination section */}
      <div className="card" style={{ padding: 24 }}>
        <p style={sectionLabel}>Destination</p>
        <div>
          <label className="field-label">
            Phone number <span style={{ color: 'var(--red)' }}>*</span>
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            placeholder="+256700000000"
            required
            className="field-input"
            style={{ fontFamily: 'var(--font-mono)' }}
          />
          <p style={{
            marginTop: 6,
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-3)',
            letterSpacing: '0.02em',
          }}>
            International format with country code
          </p>
        </div>
      </div>

      <button type="submit" className="btn-primary" style={{ marginTop: 4 }}>
        Start Call →
      </button>
    </form>
  )
}
