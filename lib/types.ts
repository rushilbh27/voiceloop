export interface CallRecord {
  id: string
  call_id: string | null
  agent_slug: string
  agent_id: string
  phone_number: string
  template_context: Record<string, string>
  status: 'in_progress' | 'completed' | 'failed'
  output: Record<string, unknown> | null
  created_at: string
  completed_at: string | null
}

export interface TriggerCallRequest {
  agentId: string
  agentSlug: string
  templateContext: Record<string, string>
  phoneNumber: string
}

export interface CallStatusResponse {
  status: 'in_progress' | 'completed' | 'failed'
  output: Record<string, unknown> | null
}
