const ULTRAVOX_API_BASE = 'https://api.ultravox.ai/api'

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.ULTRAVOX_API_KEY!,
  }
}

// Durable tool ID for voiceloop_saveOutput
export const VOICELOOP_SAVE_OUTPUT_TOOL_ID = '9eb72144-4a0e-4458-a636-5e961e948ca4'

export interface CreateCallParams {
  agentId: string
  phoneNumber: string
  templateContext: Record<string, string>
  webhookCallId: string
}

export interface UltravoxCallResponse {
  callId: string
  status: string
  [key: string]: unknown
}

/** Strip leading + from phone number for SIP URI */
function toSipNumber(phone: string): string {
  return phone.replace(/^\+/, '')
}

/** Get current datetime in East Africa Time (UTC+3) */
export function getEATDateTime(): {
  current_date: string
  current_day: string
  current_time: string
  time_of_day: string
} {
  const now = new Date()
  const parts = new Intl.DateTimeFormat('en-KE', {
    timeZone: 'Africa/Nairobi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now)

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''

  const hour = get('hour') === '24' ? '00' : get('hour')
  const hourNum = parseInt(hour, 10)
  const current_date = `${get('year')}-${get('month')}-${get('day')}`
  const current_day = get('weekday')
  const current_time = `${hour}:${get('minute')}`
  const time_of_day =
    hourNum < 12 ? 'Morning' : hourNum < 17 ? 'Afternoon' : 'Evening'

  return { current_date, current_day, current_time, time_of_day }
}

export async function createOutboundCall(
  params: CreateCallParams
): Promise<UltravoxCallResponse> {
  const { agentId, phoneNumber, templateContext, webhookCallId } = params
  const sipHost = process.env.SIP_TRUNK_HOST!
  const sipFrom = process.env.SIP_FROM_NAME!
  const sipNumber = toSipNumber(phoneNumber)

  const body = {
    medium: {
      sip: {
        outgoing: {
          to: `sip:${sipNumber}@${sipHost}`,
          from: sipFrom,
        },
      },
    },
    initialOutputMedium: 'MESSAGE_MEDIUM_VOICE',
    recordingEnabled: true,
    templateContext,
    // Inject saveOutput tool with callId override so webhook routing works
    selectedTools: [
      {
        toolId: VOICELOOP_SAVE_OUTPUT_TOOL_ID,
        parameterOverrides: { callId: webhookCallId },
      },
    ],
  }

  const res = await fetch(`${ULTRAVOX_API_BASE}/agents/${agentId}/calls`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Ultravox API error ${res.status}: ${text}`)
  }

  return res.json()
}
