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
    return <span style={{ color: 'var(--text-subtle)', fontStyle: 'italic' }}>—</span>
  }

  if (typeof value === 'boolean') {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 12,
        background: value ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
        color: value ? '#10B981' : '#EF4444',
        border: `1px solid ${value ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
      }}>
        {value ? '✓ Yes' : '✗ No'}
      </span>
    )
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <span style={{ color: 'var(--text-subtle)', fontStyle: 'italic' }}>empty</span>
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
        {value.map((item, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border)',
            borderRadius: 8, padding: '10px 12px',
          }}>
            {typeof item === 'object' && item !== null ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {Object.entries(item as Record<string, unknown>).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-subtle)', minWidth: 60 }}>{formatKey(k)}</span>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {entries.map(([k, v]) => (
          <div key={k} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
            <span style={{ fontSize: 11, color: 'var(--text-subtle)', minWidth: 80 }}>{formatKey(k)}</span>
            <span style={{ fontSize: 13, color: 'var(--text)' }}><RenderValue value={v} /></span>
          </div>
        ))}
      </div>
    )
  }

  // Status enum coloring
  const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    order_placed:       { bg: 'rgba(16,185,129,0.15)',  text: '#10B981' },
    completed:          { bg: 'rgba(16,185,129,0.15)',  text: '#10B981' },
    callback_scheduled: { bg: 'rgba(245,158,11,0.15)',  text: '#F59E0B' },
    not_interested:     { bg: 'rgba(239,68,68,0.15)',   text: '#EF4444' },
    needs_followup:     { bg: 'rgba(59,130,246,0.15)',  text: '#60A5FA' },
    wrong_number:       { bg: 'rgba(239,68,68,0.15)',   text: '#EF4444' },
    busy:               { bg: 'rgba(245,158,11,0.15)',  text: '#F59E0B' },
  }
  const sval = String(value).toLowerCase().replace(/ /g, '_')
  if (STATUS_COLORS[sval]) {
    const c = STATUS_COLORS[sval]
    return (
      <span style={{
        fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 12,
        background: c.bg, color: c.text,
        border: `1px solid ${c.text}30`,
        textTransform: 'capitalize',
      }}>
        {String(value).replace(/_/g, ' ')}
      </span>
    )
  }

  return <span style={{ fontSize: 14, color: 'var(--text)' }}>{String(value)}</span>
}

interface ResultsCardProps {
  output: Record<string, unknown>
}

export default function ResultsCard({ output }: ResultsCardProps) {
  const entries = Object.entries(output).filter(([k]) => !SKIP_KEYS.has(k))

  return (
    <div className="animate-fade-in-up" style={{
      border: '1px solid rgba(16,185,129,0.25)',
      borderRadius: 20,
      overflow: 'hidden',
      background: 'rgba(16,185,129,0.04)',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid rgba(16,185,129,0.15)',
        display: 'flex', alignItems: 'center', gap: 12,
        background: 'rgba(16,185,129,0.06)',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'rgba(16,185,129,0.2)',
          border: '1px solid rgba(16,185,129,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <polyline points="20 6 9 17 4 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <h2 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: '#10B981', marginBottom: 2 }}>
            Call Complete
          </h2>
          <p style={{ fontSize: 12, color: 'rgba(16,185,129,0.7)' }}>
            Agent output received · {entries.length} data fields
          </p>
        </div>
      </div>

      {/* Fields */}
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 0 }}>
        {entries.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>No output data received.</p>
        ) : (
          entries.map(([key, value], i) => (
            <div key={key} style={{
              display: 'flex', flexDirection: 'column', gap: 6,
              padding: '14px 0',
              borderBottom: i < entries.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <span style={{
                fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--text-subtle)',
              }}>
                {formatKey(key)}
              </span>
              <div>
                <RenderValue value={value} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
