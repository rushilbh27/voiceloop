import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  try {
    const callId = req.nextUrl.searchParams.get('callId')

    if (!callId) {
      return NextResponse.json({ error: 'Missing callId param' }, { status: 400 })
    }

    const output = await req.json()

    const supabase = getServiceClient()

    const { error } = await supabase
      .from('calls')
      .update({
        status: 'completed',
        output,
        completed_at: new Date().toISOString(),
      })
      .eq('id', callId)

    if (error) {
      console.error('Webhook update error:', error)
      return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
