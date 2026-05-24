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
    <div className="page">
      <Navbar userEmail={user.email} />

      <main className="container" style={{ padding: '56px 32px 100px' }}>

        {/* Header */}
        <div className="animate-enter" style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 10, flexWrap: 'wrap' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 5vw, 60px)',
              fontWeight: 800,
              color: 'var(--text)',
              letterSpacing: '-0.035em',
              lineHeight: 1,
            }}>
              Agents
            </h1>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 20,
              padding: '4px 12px',
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--green)',
                boxShadow: '0 0 6px rgba(45,212,160,0.8)',
                animation: 'breathe 2.5s ease-in-out infinite',
              }} />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10, color: 'var(--green)',
                letterSpacing: '0.06em',
              }}>
                {AGENTS.length} active
              </span>
            </div>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-2)', letterSpacing: '-0.01em' }}>
            Select an agent to deploy a live outbound call
          </p>
        </div>

        {/* Grid */}
        <div className="stagger" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 16,
        }}>
          {AGENTS.map((agent, i) => (
            <AgentCard key={agent.slug} agent={agent} index={i} />
          ))}
        </div>

      </main>
    </div>
  )
}
