'use client'

import { useState, useEffect, useRef } from 'react'
import { AgentConfig } from '@/config/agents'
import VariableForm from '@/components/VariableForm'
import PhoneInput from '@/components/PhoneInput'
import ResultsCard from '@/components/ResultsCard'

type DemoState = 'idle' | 'initiating' | 'in_progress' | 'completed' | 'failed'

const POLL_INTERVAL = 5000 // 5 seconds
const MAX_WAIT_MS = 5 * 60 * 1000 // 5 minutes

interface DemoFormProps {
  agent: AgentConfig
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

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  function validate(): boolean {
    for (const field of agent.templateContext) {
      if (field.required && !formValues[field.key]?.trim()) {
        setError(`"${field.label}" is required`)
        return false
      }
    }
    if (!phoneNumber.trim()) {
      setError('Phone number is required')
      return false
    }
    if (!/^\+\d{7,15}$/.test(phoneNumber.trim())) {
      setError('Phone number must be in international format, e.g. +256700000000')
      return false
    }
    return true
  }

  async function startPolling(id: string) {
    startTimeRef.current = Date.now()

    pollRef.current = setInterval(async () => {
      // Timeout after 5 minutes
      if (Date.now() - startTimeRef.current > MAX_WAIT_MS) {
        clearInterval(pollRef.current!)
        setState('failed')
        setError('Timed out waiting for call to complete (5 min limit)')
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
          setError('Call failed — check the agent logs')
        }
      } catch {
        // Network error, keep polling
      }
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

      if (!res.ok) {
        setState('failed')
        setError(data.error || 'Failed to start call')
        return
      }

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

  // --- Completed view ---
  if (state === 'completed' && output) {
    return (
      <div className="space-y-4">
        <ResultsCard output={output} />
        <button
          onClick={reset}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Start Another Call
        </button>
      </div>
    )
  }

  // --- In-progress view ---
  if (state === 'in_progress') {
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-8 text-center space-y-4">
        <div className="flex justify-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-blue-900">Call Active</h2>
          <p className="mt-1 text-sm text-blue-700">
            Waiting for agent to finish and report results…
          </p>
          <p className="mt-1 text-xs text-blue-500">Checking every 5 seconds</p>
        </div>
      </div>
    )
  }

  // --- Initiating view ---
  if (state === 'initiating') {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <div className="flex justify-center mb-3">
          <svg className="h-6 w-6 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <p className="text-sm text-gray-600">Initiating call…</p>
      </div>
    )
  }

  // --- Idle / failed form view ---
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error banner */}
      {(state === 'failed' || error) && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error || 'Call failed. Try again.'}
          {state === 'failed' && (
            <button
              type="button"
              onClick={reset}
              className="ml-2 underline font-medium"
            >
              Reset
            </button>
          )}
        </div>
      )}

      {/* Section A: Variable form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
          Call Context
        </h2>
        <VariableForm
          fields={agent.templateContext}
          values={formValues}
          onChange={setFormValues}
        />
      </div>

      {/* Section B: Phone input */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
          Destination
        </h2>
        <PhoneInput value={phoneNumber} onChange={setPhoneNumber} />
      </div>

      {/* Section C: Submit */}
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        📞 Start Call
      </button>
    </form>
  )
}
