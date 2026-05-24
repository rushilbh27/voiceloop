'use client'

import Link from 'next/link'
import { AgentConfig } from '@/config/agents'

const TAG_STYLE: Record<string, { color: string; bg: string }> = {
  Sales:       { color: '#FF3B3B', bg: 'rgba(255,59,59,0.1)' },
  Collections: { color: '#FACC15', bg: 'rgba(250,204,21,0.1)' },
  Outbound:    { color: '#2DD4A0', bg: 'rgba(45,212,160,0.1)' },
  Inbound:     { color: '#60A5FA', bg: 'rgba(96,165,250,0.1)' },
}

interface AgentCardProps {
  agent: AgentConfig
  index?: number
}

export default function AgentCard({ agent, index = 0 }: AgentCardProps) {
  const tag = TAG_STYLE[agent.tag] ?? { color: '#888CA8', bg: 'rgba(136,140,168,0.1)' }

  return (
    <Link href={`/demo/${agent.slug}`} style={{ textDecoration: 'none' }}>
      <div
        className="card card-hover"
        style={{
          padding: '24px',
          opacity: 0,
          animation: `enter 0.4s cubic-bezier(0.22,1,0.36,1) ${index * 0.07 + 0.08}s forwards`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle top accent line */}
        <div style={{
          position: 'absolute',
          top: 0, left: 24, right: 24,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${tag.color}40, transparent)`,
        }} />

        {/* Top row: tag + arrow */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}>
          <span className="tag" style={{
            background: tag.bg,
            color: tag.color,
            border: `1px solid ${tag.color}28`,
          }}>
            {agent.tag}
          </span>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: 'rgba(255,255,255,0.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7v10" stroke="var(--text-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Name */}
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 18, fontWeight: 700,
          color: 'var(--text)',
          letterSpacing: '-0.02em',
          marginBottom: 6,
          lineHeight: 1.2,
        }}>
          {agent.name}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: 13,
          color: 'var(--text-2)',
          lineHeight: 1.55,
        }}>
          {agent.description}
        </p>
      </div>
    </Link>
  )
}
