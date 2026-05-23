'use client'

import Link from 'next/link'
import { AgentConfig } from '@/config/agents'

const TAG_STYLE: Record<string, { bg: string; color: string }> = {
  Sales:       { bg: 'rgba(255,59,59,0.12)',   color: '#FF3B3B' },
  Collections: { bg: 'rgba(250,204,21,0.12)',  color: '#FACC15' },
  Outbound:    { bg: 'rgba(45,212,160,0.12)',  color: '#2DD4A0' },
  Inbound:     { bg: 'rgba(96,165,250,0.12)',  color: '#60A5FA' },
}

interface AgentCardProps {
  agent: AgentConfig
  index?: number
}

export default function AgentCard({ agent, index = 0 }: AgentCardProps) {
  const tag = TAG_STYLE[agent.tag] ?? { bg: 'rgba(255,255,255,0.06)', color: '#A0A4B0' }

  return (
    <Link href={`/demo/${agent.slug}`} style={{ textDecoration: 'none' }}>
      <div
        className="card card-hover"
        style={{
          padding: '20px 20px 16px',
          opacity: 0,
          animation: `enter 0.35s ease ${index * 0.06 + 0.1}s forwards`,
          position: 'relative',
        }}
      >
        {/* Red left accent bar */}
        <div style={{
          position: 'absolute', top: 12, left: 0, bottom: 12,
          width: 3, borderRadius: '0 2px 2px 0',
          background: tag.color,
          opacity: 0.6,
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="tag" style={{ background: tag.bg, color: tag.color }}>
            {agent.tag}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3 }}>
            <path d="M7 17L17 7M17 7H7M17 7v10" stroke="var(--text-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h3 style={{
          fontSize: 16, fontWeight: 700, color: 'var(--text)',
          marginBottom: 4, letterSpacing: '-0.01em',
        }}>
          {agent.name}
        </h3>

        <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>
          {agent.description}
        </p>
      </div>
    </Link>
  )
}
