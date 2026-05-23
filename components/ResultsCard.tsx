'use client'

import React from 'react'

const SKIP_KEYS = new Set(['webhookCallId', 'webhookUrl', 'context', 'from', 'to', 'callId'])

function formatKey(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase())
    .trim()
}

function RenderValue({ value }: { value: unknown }): React.ReactElement {
  if (value === null || value === undefined) {
    return <span style={{ color: 'var(--text-3)' }}>—</span>
  }

  if (typeof value === 'boolean') {
    return (
      <span style={{
        fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)',
        padding: '2px 6px', borderRadius: 3,
        background: value ? 'rgba(45,212,160,0.12)' : 'rgba(255,59,59,0.12)',
        color: value ? '#2DD4A0' : '#FF3B3B',
      }}>
        {value ? 'YES' : 'NO'}
      </span>
    )
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <span style={{ color: 'var(--text-3)' }}>empty</span>
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
        {value.map((item, i) => (
          <div key={i} style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 6, padding: '8px 10px',
          }}>
            {typeof item === 'object' && item !== null ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {Object.entries(item as Record<string, unknown>).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                    <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-3)', minWidth: 50 }}>{formatKey(k)}</span>
                    <span style={{ fontSize: 13, color: 'var(--text)' }}>{String(v)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span style={{ fontSize: 13, color: 'var(--text)' }}>{String(item)}</span>
            )}
          </div>
        ))}
      </div>
    )
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {entries.map(([k, v]) => (
          <div key={k} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-3)', minWidth: 60 }}>{formatKey(k)}</span>
            <span style={{ fontSize: 13, color: 'var(--text)' }}><RenderValue value={v} /></span>
          </div>
        ))}
      </div>
    )
  }

  const STATUS_COLORS: Record<string, string> = {
    order_placed: '#2DD4A0',
    completed: '#2DD4A0',
    callback_scheduled: '#FACC15',
    not_interested: '#FF3B3B',
    needs_followup: '#60A5FA',
    wrong_number: '#FF3B3B',
    busy: '#FACC15',
  }

  const sval = String(value).toLowerCase().replace(/ /g, '_')
  if (STATUS_COLORS[sval]) {
    const c = STATUS_COLORS[sval]
    return (
      <span style={{
        fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)',
        padding: '2px 8px', borderRadius: 3,
        background: `${c}1A`,
        color: c,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}>
        {String(value).replace(/_/g, ' ')}
      </span>
    )
  }

  return <span style={{ fontSize: 13, color: 'var(--text)' }}>{String(value)}</span>
}

interface ResultsCardProps {
  output: Record<string, unknown>
}

export default function ResultsCard({ output }: ResultsCardProps) {
  const entries = Object.entries(output).filter(([k]) => !SKIP_KEYS.has(k))

  return (
    <div className="card animate-enter" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'rgba(45,212,160,0.04)',
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: 'rgba(45,212,160,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <polyline points="20 6 9 17 4 12" stroke="#2DD4A0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#2DD4A0' }}>
            Call Complete
          </div>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>
            {entries.length} fields returned
          </div>
        </div>
      </div>

      {/* Fields */}
      <div style={{ padding: '4px 0' }}>
        {entries.length === 0 ? (
          <p style={{ padding: 20, fontSize: 13, color: 'var(--text-3)' }}>No output data.</p>
        ) : (
          entries.map(([key, value], i) => (
            <div key={key} style={{
              padding: '12px 20px',
              borderBottom: i < entries.length - 1 ? '1px solid var(--border)' : 'none',
              display: 'flex', flexDirection: 'column', gap: 4,
            }}>
              <span style={{
                fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-mono)',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'var(--text-3)',
              }}>
                {formatKey(key)}
              </span>
              <div><RenderValue value={value} /></div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
