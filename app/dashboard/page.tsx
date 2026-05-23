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
    <div className="min-h-screen">
      <Navbar userEmail={user.email} />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Agents</h1>
          <p className="mt-1 text-sm text-gray-500">
            Pick an agent to start a live demo call
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map((agent) => (
            <AgentCard key={agent.slug} agent={agent} />
          ))}
        </div>
      </main>
    </div>
  )
}
