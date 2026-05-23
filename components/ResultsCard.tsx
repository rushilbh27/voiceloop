'use client'

import React from 'react'

const SKIP_KEYS = new Set(['webhookCallId', 'webhookUrl', 'context', 'from', 'to'])

function formatKey(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim()
}

function RenderValue({ value }: { value: unknown }): React.ReactElement {
  if (value === null || value === undefined) {
    return <span className="text-gray-400 italic">—</span>
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-gray-400 italic">empty</span>
    return (
      <ul className="mt-1 space-y-1">
        {value.map((item, i) => (
          <li key={i} className="pl-3 border-l-2 border-gray-200">
            {typeof item === 'object' ? (
              <NestedObject obj={item as Record<string, unknown>} />
            ) : (
              <span className="text-gray-800">{String(item)}</span>
            )}
          </li>
        ))}
      </ul>
    )
  }

  if (typeof value === 'object') {
    return <NestedObject obj={value as Record<string, unknown>} />
  }

  if (typeof value === 'boolean') {
    return (
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
          value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}
      >
        {value ? 'Yes' : 'No'}
      </span>
    )
  }

  return <span className="text-gray-800">{String(value)}</span>
}

function NestedObject({ obj }: { obj: Record<string, unknown> }) {
  const entries = Object.entries(obj).filter(([k]) => !SKIP_KEYS.has(k))
  if (entries.length === 0) return null
  return (
    <div className="space-y-2">
      {entries.map(([k, v]) => (
        <div key={k} className="flex flex-col sm:flex-row sm:gap-3">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide min-w-[140px]">
            {formatKey(k)}
          </span>
          <div className="text-sm flex-1">
            <RenderValue value={v} />
          </div>
        </div>
      ))}
    </div>
  )
}

interface ResultsCardProps {
  output: Record<string, unknown>
}

export default function ResultsCard({ output }: ResultsCardProps) {
  const entries = Object.entries(output).filter(([k]) => !SKIP_KEYS.has(k))

  return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-2xl">✅</span>
        <h2 className="text-lg font-semibold text-green-900">Call Complete</h2>
      </div>

      <div className="bg-white rounded-lg border border-green-100 p-5 space-y-4">
        {entries.length === 0 ? (
          <p className="text-sm text-gray-500">No output data received.</p>
        ) : (
          entries.map(([key, value]) => (
            <div key={key} className="flex flex-col gap-1 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {formatKey(key)}
              </span>
              <div className="text-sm">
                <RenderValue value={value} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
