import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { getAgentBySlug } from '@/config/agents'
import Navbar from '@/components/Navbar'
import DemoForm from './DemoForm'

interface PageProps {
  params: Promise<{ agentSlug: string }>
}

const TAG_COLORS: Record<string, string> = {
  Sales: '#9F67FF',
  Collections: '#F87171',
  Outbound: '#34D399',
  Inbound: '#60A5FA',
}

export default async function DemoPage({ params }: PageProps) {
  const { agentSlug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const agent = getAgentBySlug(agentSlug)
  if (!agent) notFound()

  const accentColor = TAG_COLORS[agent.tag] ?? '#9F67FF'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }} className="grid-bg">
      <Navbar userEmail={user.email} />

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Back */}
        <div style={{ marginBottom: 32, opacity: 0, animation: 'fadeInUp 0.4s ease 0.05s forwards' }}>
          <Link href="/dashboard" style={{
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, color: 'var(--text-muted)',
            transition: 'color 0.15s',
          }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to agents
          </Link>
        </div>

        {/* Page header */}
        <div style={{ marginBottom: 32, opacity: 0, animation: 'fadeInUp 0.4s ease 0.1s forwards' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: `${accentColor}18`,
              border: `1px solid ${accentColor}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.87 9.83 19.79 19.79 0 01.81 1.2 2 2 0 012.8 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <span style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                color: accentColor, display: 'block', marginBottom: 4,
              }}>
                {agent.tag}
              </span>
              <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
                {agent.name}
              </h1>
            </div>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {agent.description}
          </p>
        </div>

        {/* Form */}
        <div style={{ opacity: 0, animation: 'fadeInUp 0.4s ease 0.18s forwards' }}>
          <DemoForm agent={agent} />
        </div>
      </main>
    </div>
  )
}
