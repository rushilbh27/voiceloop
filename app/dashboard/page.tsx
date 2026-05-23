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

      <main className="container" style={{ padding: '40px 24px 80px' }}>
        {/* Header */}
        <div className="animate-enter" style={{ marginBottom: 36 }}>
          <h1 style={{
            fontSize: 24, fontWeight: 700, color: 'var(--text)',
            letterSpacing: '-0.02em', marginBottom: 6,
          }}>
            Agents
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-2)' }}>
            Select an agent to start a live outbound call
          </p>
        </div>

        {/* Grid */}
        <div className="stagger" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 12,
        }}>
          {AGENTS.map((agent, i) => (
            <AgentCard key={agent.slug} agent={agent} index={i} />
          ))}
        </div>

        {/* Footer */}
        <div className="animate-enter" style={{
          marginTop: 48, paddingTop: 20,
          borderTop: '1px solid var(--border)',
          animationDelay: '0.3s',
        }}>
          <span style={{
            fontSize: 11, color: 'var(--text-3)',
            fontFamily: 'var(--font-mono)',
          }}>
            Add agents in config/agents.ts
          </span>
        </div>
      </main>
    </div>
  )
}
