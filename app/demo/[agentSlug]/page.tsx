import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { getAgentBySlug } from '@/config/agents'
import Navbar from '@/components/Navbar'
import DemoForm from './DemoForm'

interface PageProps {
  params: Promise<{ agentSlug: string }>
}

export default async function DemoPage({ params }: PageProps) {
  const { agentSlug } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const agent = getAgentBySlug(agentSlug)
  if (!agent) notFound()

  return (
    <div className="min-h-screen">
      <Navbar userEmail={user.email} />
      <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to agents
          </a>
          <h1 className="mt-3 text-2xl font-semibold text-gray-900">{agent.name}</h1>
          <p className="mt-1 text-sm text-gray-500">{agent.description}</p>
        </div>
        <DemoForm agent={agent} />
      </main>
    </div>
  )
}
