'use client'

import Link from 'next/link'
import { AgentConfig } from '@/config/agents'

const TAG_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Sales:       { bg: 'rgba(124,58,237,0.15)',  text: '#9F67FF', dot: '#7C3AED' },
  Collections: { bg: 'rgba(239,68,68,0.15)',   text: '#F87171', dot: '#EF4444' },
  Outbound:    { bg: 'rgba(16,185,129,0.15)',   text: '#34D399', dot: '#10B981' },
  Inbound:     { bg: 'rgba(59,130,246,0.15)',   text: '#60A5FA', dot: '#3B82F6' },
}

interface AgentCardProps {
  agent: AgentConfig
  index?: number
}

export default function AgentCard({ agent, index = 0 }: AgentCardProps) {
  const tag = TAG_COLORS[agent.tag] ?? { bg: 'rgba(255,255,255,0.08)', text: '#94A3B8', dot: '#64748B' }

  return (
    <Link href={`/demo/${agent.slug}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: 24,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          position: 'relative',
          overflow: 'hidden',
          opacity: 0,
          animation: `fadeInUp 0.5s ease ${index * 0.07 + 0.1}s forwards`,
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'rgba(124,58,237,0.4)'
          el.style.background = 'rgba(124,58,237,0.06)'
          el.style.transform = 'translateY(-2px)'
          el.style.boxShadow = '0 8px 30px rgba(124,58,237,0.15)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'var(--border)'
          el.style.background = 'var(--surface)'
          el.style.transform = 'translateY(0)'
          el.style.boxShadow = 'none'
        }}
      >
        {/* Subtle gradient top bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, ${tag.dot}, transparent)`,
          opacity: 0.6,
        }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: tag.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1px solid ${tag.dot}30`,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.87 9.83 19.79 19.79 0 01.81 1.2 2 2 0 012.8 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke={tag.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <span style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
            background: tag.bg, color: tag.text,
            padding: '3px 9px', borderRadius: 20,
            border: `1px solid ${tag.dot}30`,
          }}>
            {agent.tag}
          </span>
        </div>

        {/* Content */}
        <h3 className="font-display" style={{
          fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 6
        }}>
          {agent.name}
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: 20 }}>
          {agent.description}
        </p>

        {/* CTA */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 13, fontWeight: 600, color: tag.text,
        }}>
          Start demo
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </Link>
  )
}
