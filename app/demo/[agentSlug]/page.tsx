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
  Sales: '#FF3B3B',
  Collections: '#FACC15',
  Outbound: '#2DD4A0',
  Inbound: '#60A5FA',
}

export default async function DemoPage({ params }: PageProps) {
  const { agentSlug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const agent = getAgentBySlug(agentSlug)
  if (!agent) notFound()

  const accent = TAG_COLORS[agent.tag] ?? '#FF3B3B'

  return (
    <div className="page">
      <Navbar userEmail={user.email} />

      <main className="container" style={{ maxWidth: 720, padding: '32px 24px 80px' }}>
        {/* Back */}
        <div className="animate-enter" style={{ marginBottom: 24 }}>
          <Link href="/dashboard" style={{
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--font-mono)',
            transition: 'color 0.1s',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            back
          </Link>
        </div>

        {/* Header */}
        <div className="animate-enter" style={{ marginBottom: 28, animationDelay: '0.04s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 8, height: 8, borderRadius: 2,
              background: accent,
            }} />
            <span style={{
              fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: accent,
            }}>
              {agent.tag}
            </span>
          </div>
          <h1 style={{
            fontSize: 22, fontWeight: 700, color: 'var(--text)',
            letterSpacing: '-0.02em', marginBottom: 4,
          }}>
            {agent.name}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-2)' }}>
            {agent.description}
          </p>
        </div>

        {/* Form */}
        <div className="animate-enter" style={{ animationDelay: '0.08s' }}>
          <DemoForm agent={agent} />
        </div>
      </main>
    </div>
  )
}
