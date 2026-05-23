import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { createServiceClient } from '@/lib/supabase-server'
import Navbar from '@/components/Navbar'
import { CallRecord } from '@/lib/types'
import Link from 'next/link'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-KE', {
    timeZone: 'Africa/Nairobi',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const STATUS_BADGE: Record<string, string> = {
  in_progress: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
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
    <div className="min-h-screen">
      <Navbar userEmail={user.email} />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Call History</h1>
          <p className="mt-1 text-sm text-gray-500">{rows.length} call{rows.length !== 1 ? 's' : ''} recorded</p>
        </div>

        {rows.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <span className="text-3xl">📭</span>
            <p className="mt-3 text-sm text-gray-500">No calls yet. Start a demo from the dashboard.</p>
            <Link href="/dashboard" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
              Go to Dashboard →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Date (EAT)</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Agent</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Phone</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Output</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((call) => (
                  <tr key={call.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {formatDate(call.created_at)}
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-medium">{call.agent_slug}</td>
                    <td className="px-4 py-3 text-gray-700">{call.phone_number}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          STATUS_BADGE[call.status] ?? 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {call.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate text-gray-500">
                      {call.output
                        ? <span className="text-green-700">{Object.keys(call.output).length} fields</span>
                        : <span className="text-gray-400">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
