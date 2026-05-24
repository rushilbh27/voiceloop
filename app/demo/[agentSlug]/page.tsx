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

      <main className="container" style={{ maxWidth: 740, padding: '44px 32px 100px' }}>

        {/* Back */}
        <div className="animate-enter" style={{ marginBottom: 32 }}>
          <Link href="/dashboard" style={{
            textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 12,
            color: 'var(--text-3)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.04em',
            transition: 'color 0.15s',
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            back
          </Link>
        </div>

        {/* Agent header */}
        <div className="animate-enter" style={{ marginBottom: 32, animationDelay: '0.05s' }}>
          {/* Tag */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            marginBottom: 16,
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: accent,
              boxShadow: `0 0 8px ${accent}99`,
              animation: 'breathe 2.5s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10, fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: accent,
            }}>
              {agent.tag}
            </span>
          </div>

          {/* Name */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4vw, 44px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            lineHeight: 1.05,
            marginBottom: 10,
          }}>
            {agent.name}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>
            {agent.description}
          </p>
        </div>

        {/* Form */}
        <div className="animate-enter" style={{ animationDelay: '0.1s' }}>
          <DemoForm agent={agent} />
        </div>

      </main>
    </div>
  )
}
