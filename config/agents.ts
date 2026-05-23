export interface TemplateField {
  key: string
  label: string
  placeholder: string
  type: 'text' | 'number' | 'select'
  required: boolean
  options?: string[]
}

export interface AgentConfig {
  slug: string
  name: string
  agentId: string
  description: string
  tag: string
  templateContext: TemplateField[]
  /** Static context injected server-side — never shown in form */
  staticContext?: Record<string, string>
  /** Override SIP from name for this agent */
  sipFrom?: string
}

export const AGENTS: AgentConfig[] = [
  {
    slug: 'sales-ai',
    name: 'Sales AI',
    agentId: '65ae3d7d-5a1f-4880-89f4-1ce690efae89',
    description: 'Outbound sales agent for property/product demos',
    tag: 'Sales',
    templateContext: [
      {
        key: 'customerName',
        label: 'Customer Name',
        placeholder: 'e.g. James Omondi',
        type: 'text',
        required: true,
      },
      {
        key: 'product',
        label: 'Product / Service',
        placeholder: 'e.g. 2BHK Apartment',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    slug: 'opm-outbound',
    name: 'OPM Outbound',
    agentId: 'fd16bcbb-4c92-4983-8d86-653003bb9a68',
    description: 'Outbound order-taking agent for Tender Rongai sauces & condiments',
    tag: 'Outbound',
    sipFrom: 'NectorU',
    templateContext: [
      {
        key: 'client_name',
        label: 'Customer Name',
        placeholder: 'e.g. Moses Okello',
        type: 'text',
        required: true,
      },
      {
        key: 'client_channel',
        label: 'Customer Channel',
        placeholder: 'Select channel type',
        type: 'select',
        required: true,
        options: ['DUKA OR KIOSK', 'HOTEL AND CAFE', 'WHOLESALER', 'DISTRIBUTOR'],
      },
      {
        key: 'is_returning_customer',
        label: 'Returning Customer?',
        placeholder: 'Select',
        type: 'select',
        required: true,
        options: ['false', 'true'],
      },
      {
        key: 'delivery_address',
        label: 'Known Delivery Address',
        placeholder: 'e.g. Nalufenya Road, near Shell station (leave blank if unknown)',
        type: 'text',
        required: false,
      },
    ],
    staticContext: {
      from: 'NectorU',
      call_type: 'outbound',
      agent_name: 'Amara',
      company_name: 'Tender Rongai',
      company_short_name: 'Tender',
      product_or_service: 'sauces and condiments',
      context:
        'AVAILABLE PRODUCTS (present only these to the customer):\n- Tomato Sauce Large (12x1kg) — In Stock\n- Tomato Sauce (24x400g) — In Stock\n- Tomato Sauce (24x250g) — In Stock\n- Tomato Sauce (12x700g) — In Stock\n- Tomato Sauce Sachet (360x20g) — In Stock\n- Premium Tomato Sauce Sachet (360x20g) — In Stock\n- Choma Sauce (24x400g) — In Stock\n- Hot and Sweet Sauce (24x400g) — In Stock\n- Hot and Sweet Sauce (24x250g) — In Stock\n- Hot and Sweet Sauce (12x700g) — In Stock\n- Tomato Garlic Sauce (12x700g) — In Stock\n- Tomato Ketchup (24x400g) — In Stock\n- Tomato Ketchup (12x700g) — In Stock\n- Tomato Ketchup in Gallons (1x5kg) — In Stock\n- Tomato Sauce in Gallons (1x5kg) — In Stock\n- Mamas Choice Chips Sauce Sachet (300x20g) — In Stock\n- Vinegar White (12x700ml) — In Stock\n- White Vinegar (1x5 Litres) — In Stock\n- Peptang Red Plum Jam (24x100g) — In Stock\n- Creamy Peanut Butter (400g x12) — In Stock\n\nPAYMENT METHODS: Cash on Delivery | M-Pesa | Bank Transfer\n\nDELIVERY: Available across Rongai area and surrounding zones. Same day or next day depending on order time and location. Rider calls customer when nearby.\n\nIf customer asks about pricing: let them know the team will confirm exact pricing on follow-up.',
    },
  },
  {
    slug: 'debt-collector',
    name: 'Debt Collection Agent',
    agentId: 'YOUR_AGENT_ID_HERE',
    description: 'Follows up on outstanding payments politely but firmly',
    tag: 'Collections',
    templateContext: [
      {
        key: 'debtorName',
        label: 'Debtor Name',
        placeholder: 'e.g. Sarah Nakato',
        type: 'text',
        required: true,
      },
      {
        key: 'amountOwed',
        label: 'Amount Owed (UGX)',
        placeholder: 'e.g. 250000',
        type: 'number',
        required: true,
      },
      {
        key: 'dueDate',
        label: 'Due Date',
        placeholder: 'e.g. 30 May 2026',
        type: 'text',
        required: true,
      },
    ],
  },
]

export function getAgentBySlug(slug: string): AgentConfig | undefined {
  return AGENTS.find((a) => a.slug === slug)
}
