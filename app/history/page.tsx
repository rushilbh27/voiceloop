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
  in_progress: { label: 'In Progress', cls: 'badge badge-in-progress' },
  completed:   { label: 'Completed',   cls: 'badge badge-completed' },
  failed:      { label: 'Failed',      cls: 'badge badge-failed' },
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
    <div className="page">
      <Navbar userEmail={user.email} />

      <main className="container" style={{ padding: '56px 32px 100px' }}>

        {/* Header */}
        <div className="animate-enter" style={{ marginBottom: 40 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 5vw, 60px)',
            fontWeight: 800,
            color: 'var(--text)',
            letterSpacing: '-0.035em',
            lineHeight: 1,
            marginBottom: 10,
          }}>
            History
          </h1>
          <p style={{
            fontSize: 13,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-3)',
            letterSpacing: '0.02em',
          }}>
            {rows.length} call{rows.length !== 1 ? 's' : ''} recorded
          </p>
        </div>

        {rows.length === 0 ? (
          <div className="card" style={{
            padding: '64px 24px',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18, fontWeight: 700,
              color: 'var(--text-2)',
              marginBottom: 8,
            }}>
              No calls yet
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>
              Deploy an agent to start making calls
            </p>
            <Link href="/dashboard" style={{
              textDecoration: 'none',
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              color: 'var(--red)',
              letterSpacing: '0.04em',
            }}>
              Go to Agents →
            </Link>
          </div>
        ) : (
          <div className="card animate-enter" style={{ overflow: 'hidden', animationDelay: '0.06s' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Date (EAT)', 'Agent', 'Phone', 'Status', 'Output'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left',
                      padding: '12px 20px',
                      fontSize: 10,
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--text-3)',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((call, i) => {
                  const s = STATUS[call.status] ?? { label: call.status, cls: 'badge' }
                  return (
                    <tr
                      key={call.id}
                      className="history-row"
                      style={{
                        borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
                      }}
                    >
                      <td style={{
                        padding: '14px 20px',
                        fontSize: 12,
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-3)',
                        whiteSpace: 'nowrap',
                      }}>
                        {formatDate(call.created_at)}
                      </td>
                      <td style={{
                        padding: '14px 20px',
                        fontSize: 14,
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        letterSpacing: '-0.01em',
                        color: 'var(--text)',
                      }}>
                        {call.agent_slug.split('-').map(w => w.toUpperCase() === 'AI' ? 'AI' : w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </td>
                      <td style={{
                        padding: '14px 20px',
                        fontSize: 12,
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-2)',
                      }}>
                        {call.phone_number}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span className={s.cls}>{s.label}</span>
                      </td>
                      <td style={{
                        padding: '14px 20px',
                        fontSize: 12,
                        fontFamily: 'var(--font-mono)',
                      }}>
                        {call.output ? (
                          <span style={{ color: 'var(--green)' }}>
                            {Object.keys(call.output).length} fields
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-3)' }}>—</span>
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
