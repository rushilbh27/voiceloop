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
  const locked = agent.locked === true
  const delay = `${index * 0.07 + 0.08}s`

  const card = (
    <div
      className={locked ? 'card' : 'card card-hover'}
      style={{
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        opacity: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        animation: `enter 0.4s cubic-bezier(0.22,1,0.36,1) ${delay} forwards`,
        ...(locked ? { cursor: 'default' } : {}),
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute',
        top: 0, left: 24, right: 24, height: 1,
        background: locked
          ? 'rgba(255,255,255,0.03)'
          : `linear-gradient(90deg, transparent, ${tag.color}40, transparent)`,
      }} />

      {/* Tag + icon row */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 16,
      }}>
        <span className="tag" style={{
          background: locked ? 'rgba(255,255,255,0.05)' : tag.bg,
          color: locked ? '#505470' : tag.color,
          border: locked ? '1px solid rgba(255,255,255,0.08)' : `1px solid ${tag.color}28`,
        }}>
          {agent.tag}
        </span>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: 'rgba(255,255,255,0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {locked ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="var(--text-3)" strokeWidth="1.5"/>
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="var(--text-3)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7v10" stroke="var(--text-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      </div>

      {/* Name */}
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 18, fontWeight: 700,
        color: locked ? '#484C66' : 'var(--text)',
        letterSpacing: '-0.02em',
        marginBottom: 6, lineHeight: 1.2,
      }}>
        {agent.name}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: 13,
        color: locked ? '#3E4260' : 'var(--text-2)',
        lineHeight: 1.55,
        flex: 1,
        marginBottom: locked ? 14 : 0,
      }}>
        {agent.description}
      </p>

      {/* Not in demo badge */}
      {locked && (
        <span style={{
          display: 'inline-block',
          alignSelf: 'flex-start',
          fontFamily: 'var(--font-mono)',
          fontSize: 9, fontWeight: 700,
          letterSpacing: '0.1em',
          color: '#505470',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 4, padding: '3px 8px',
        }}>
          NOT IN DEMO
        </span>
      )}
    </div>
  )

  if (locked) return card

  return (
    <Link href={`/demo/${agent.slug}`} style={{ textDecoration: 'none' }}>
      {card}
    </Link>
  )
}
