import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { createServiceClient } from '@/lib/supabase-server'
import Navbar from '@/components/Navbar'
import { CallRecord } from '@/lib/types'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-KE', {
    timeZone: 'Africa/Nairobi',
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const STATUS: Record<string, { label: string; cls: string }> = {
  in_progress: { label: 'In Progress', cls: 'badge-in-progress' },
  completed:   { label: 'Completed',   cls: 'badge-completed' },
  failed:      { label: 'Failed',      cls: 'badge-failed' },
}

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const serviceClient = await createServiceClient()
  const { data: calls } = await serviceClient
    .from('calls')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  const rows = (calls ?? []) as CallRecord[]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }} className="grid-bg">
      <Navbar userEmail={user.email} />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 40, opacity: 0, animation: 'fadeInUp 0.5s ease 0.05s forwards' }}>
          <div className="section-tag" style={{ marginBottom: 14 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Call Log
          </div>
          <h1 className="font-display" style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 8 }}>
            History
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            {rows.length} call{rows.length !== 1 ? 's' : ''} recorded
          </p>
        </div>

        {rows.length === 0 ? (
          <div className="glass" style={{ borderRadius: 20, padding: '64px 24px', textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'var(--surface)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.87 9.83 19.79 19.79 0 01.81 1.2 2 2 0 012.8 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 20 }}>No calls yet</p>
            <Link href="/dashboard" style={{
              textDecoration: 'none', fontSize: 13, fontWeight: 600, color: 'var(--primary-light)',
            }}>
              Start your first demo →
            </Link>
          </div>
        ) : (
          <div className="glass" style={{ borderRadius: 20, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Date (EAT)', 'Agent', 'Phone', 'Status', 'Output'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '14px 20px',
                      fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      background: 'rgba(255,255,255,0.02)',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((call, i) => {
                  const s = STATUS[call.status] ?? { label: call.status, cls: '' }
                  return (
                    <tr key={call.id} className="history-row" style={{
                      borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
                    }}>
                      <td style={{ padding: '14px 20px', fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {formatDate(call.created_at)}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span className="font-display" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                          {call.agent_slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        {call.phone_number}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span className={s.cls} style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 12 }}>
                          {s.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: 13 }}>
                        {call.output ? (
                          <span style={{ color: '#10B981' }}>
                            {Object.keys(call.output).length} fields
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-subtle)' }}>—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
