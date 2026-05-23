import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { AGENTS } from '@/config/agents'
import AgentCard from '@/components/AgentCard'
import Navbar from '@/components/Navbar'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }} className="grid-bg">
      <Navbar userEmail={user.email} />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 48, opacity: 0, animation: 'fadeInUp 0.5s ease 0.05s forwards' }}>
          <div className="section-tag" style={{ marginBottom: 16 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse-dot 2s ease-in-out infinite' }} />
            Live Demo Portal
          </div>
          <h1 className="font-display" style={{ fontSize: 36, fontWeight: 800, color: 'var(--text)', marginBottom: 10, letterSpacing: '-0.02em' }}>
            Select an Agent
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 480 }}>
            Pick any configured AI voice agent below to trigger a live outbound call and watch the output stream in real time.
          </p>
        </div>

        {/* Agent grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 16,
        }}>
          {AGENTS.map((agent, i) => (
            <AgentCard key={agent.slug} agent={agent} index={i} />
          ))}
        </div>

        {/* Footer hint */}
        <div style={{ marginTop: 64, paddingTop: 32, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, opacity: 0, animation: 'fadeIn 0.5s ease 0.4s forwards' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="var(--text-subtle)" strokeWidth="1.5"/>
            <path d="M12 8v4M12 16h.01" stroke="var(--text-subtle)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 12, color: 'var(--text-subtle)' }}>
            Add more agents in <code style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>config/agents.ts</code>
          </span>
        </div>
      </main>
    </div>
  )
}
