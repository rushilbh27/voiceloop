import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { createClient } from '@supabase/supabase-js'
import { CallStatusResponse } from '@/lib/types'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ callId: string }> }
) {
  const { callId } = await params

  if (!callId) {
    return NextResponse.json({ error: 'Missing callId' }, { status: 400 })
  }

  const supabase = getServiceClient()

  const { data, error } = await supabase
    .from('calls')
    .select('status, output')
    .eq('id', callId)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Call not found' }, { status: 404 })
  }

  const response: CallStatusResponse = {
    status: data.status,
    output: data.output,
  }

  return NextResponse.json(response)
}
