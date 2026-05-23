import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createOutboundCall, getEATDateTime } from '@/lib/ultravox'
import { getAgentBySlug } from '@/config/agents'
import { TriggerCallRequest } from '@/lib/types'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  try {
    const body: TriggerCallRequest = await req.json()
    const { agentId, agentSlug, templateContext: formContext, phoneNumber } = body

    if (!agentId || !phoneNumber || !agentSlug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const agentConfig = getAgentBySlug(agentSlug)
    if (!agentConfig) {
      return NextResponse.json({ error: 'Unknown agent' }, { status: 400 })
    }

    // Get current EAT datetime
    const { current_date, current_day, current_time, time_of_day } = getEATDateTime()

    // Build full templateContext: static + form + dynamic datetime
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // We'll use our Supabase row ID as the webhookCallId so the webhook can match
    // Insert placeholder row first to get the UUID
    const supabase = getServiceClient()

    const { data: callRow, error: insertError } = await supabase
      .from('calls')
      .insert({
        agent_slug: agentSlug,
        agent_id: agentId,
        phone_number: phoneNumber,
        template_context: formContext,
        status: 'in_progress',
      })
      .select('id')
      .single()

    if (insertError || !callRow) {
      console.error('Supabase insert error:', insertError)
      return NextResponse.json({ error: 'Failed to create call record' }, { status: 500 })
    }

    const webhookCallId = callRow.id

    const fullTemplateContext: Record<string, string> = {
      // Static agent context
      ...(agentConfig.staticContext ?? {}),
      // Form-submitted context
      ...formContext,
      // Dynamic datetime
      current_date,
      current_day,
      current_time,
      time: time_of_day,
      // Phone number fields
      to: phoneNumber.replace(/^\+/, ''),
      client_number: phoneNumber,
      // Webhook routing
      webhookCallId,
      webhookUrl: `${appUrl}/api/webhook/output?callId=${webhookCallId}`,
    }

    // Fire Ultravox call
    let ultravoxResponse
    try {
      ultravoxResponse = await createOutboundCall({
        agentId,
        phoneNumber,
        templateContext: fullTemplateContext,
        webhookCallId,
      })
    } catch (err) {
      // Mark call as failed if Ultravox errors
      await supabase
        .from('calls')
        .update({ status: 'failed' })
        .eq('id', webhookCallId)

      console.error('Ultravox error:', err)
      return NextResponse.json(
        { error: err instanceof Error ? err.message : 'Ultravox call failed' },
        { status: 502 }
      )
    }

    // Store Ultravox callId
    await supabase
      .from('calls')
      .update({ call_id: ultravoxResponse.callId })
      .eq('id', webhookCallId)

    return NextResponse.json({ callId: webhookCallId })
  } catch (err) {
    console.error('trigger-call error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
