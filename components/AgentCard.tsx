import Link from 'next/link'
import { AgentConfig } from '@/config/agents'

const TAG_COLORS: Record<string, string> = {
  Sales: 'bg-blue-100 text-blue-700',
  Collections: 'bg-red-100 text-red-700',
  Outbound: 'bg-green-100 text-green-700',
  Inbound: 'bg-purple-100 text-purple-700',
}

interface AgentCardProps {
  agent: AgentConfig
}

export default function AgentCard({ agent }: AgentCardProps) {
  const tagColor = TAG_COLORS[agent.tag] ?? 'bg-gray-100 text-gray-700'

  return (
    <Link href={`/demo/${agent.slug}`}>
      <div className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="text-2xl">📞</div>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tagColor}`}
          >
            {agent.tag}
          </span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">{agent.name}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{agent.description}</p>
        <div className="mt-4 flex items-center text-sm text-blue-600 font-medium group-hover:text-blue-700">
          Start demo
          <svg className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
