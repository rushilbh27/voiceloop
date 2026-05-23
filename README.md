# AI Calling Demo Portal

Sales demo tool — trigger live AI voice calls and see structured output in the browser.

## Stack
- **Next.js 14** App Router + TypeScript + Tailwind
- **Supabase** Auth + Postgres
- **Ultravox** outbound SIP calls
- **Vercel** deployment

---

## Setup (10 minutes)

### 1. Supabase project
1. Create project at [supabase.com](https://supabase.com)
2. Run the migration: **SQL Editor** → paste `supabase/migrations/001_calls.sql`
3. Create your user: **Authentication → Users → Add User** → email + password
4. Copy keys from **Settings → API**

### 2. Environment variables
Fill in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

ULTRAVOX_API_KEY=your-key

SIP_TRUNK_HOST=41.221.83.230
SIP_FROM_NAME=NectorU

NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 3. Ultravox webhook
In Ultravox console, update your `saveOutput` tool URL to:
```
https://your-app.vercel.app/api/webhook/output?callId={{webhookCallId}}
```
`{{webhookCallId}}` is injected automatically per call via `templateContext`.

### 4. Run locally
```bash
npm run dev
# visit http://localhost:3000 → redirects to /login
```

### 5. Deploy to Vercel
```bash
npx vercel --prod
```
Set all env vars in Vercel dashboard. Update `NEXT_PUBLIC_APP_URL` to your Vercel URL.

---

## Adding agents

Edit `config/agents.ts` — append to `AGENTS[]`:

```typescript
{
  slug: 'my-agent',
  name: 'My Agent',
  agentId: 'ultravox-agent-uuid',
  description: 'What it does',
  tag: 'Sales',
  templateContext: [
    { key: 'customerName', label: 'Customer Name', placeholder: 'e.g. James', type: 'text', required: true },
  ],
  staticContext: {
    // Injected server-side — NOT shown in the form
    agent_name: 'Aisha',
    company_name: 'My Company',
  }
}
```

---

## How webhook matching works

1. API route creates Supabase row → gets UUID (`webhookCallId`)
2. UUID goes into `templateContext` sent to Ultravox
3. Agent's `saveOutput` tool URL must include `?callId={{webhookCallId}}`
4. Webhook receives POST → updates `status: completed` + `output`
5. Frontend polling (every 5s) picks up change → renders ResultsCard

---

## File structure
```
app/
  login/page.tsx           Auth page
  dashboard/page.tsx       Agent grid
  demo/[agentSlug]/        Demo form + polling + results
  history/page.tsx         Call log table
  api/
    trigger-call/          POST: fire Ultravox call
    webhook/output/        POST: receive saveOutput payload
    call-status/[callId]/  GET: poll status

config/agents.ts           All agent definitions
lib/
  supabase.ts              Browser client
  supabase-server.ts       Server + service clients
  ultravox.ts              Ultravox API + EAT datetime helper
  types.ts                 Shared TypeScript types
components/
  AgentCard, VariableForm, PhoneInput, ResultsCard, Navbar
supabase/migrations/       DB schema (run once in Supabase SQL Editor)
```
