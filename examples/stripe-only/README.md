# Single-API example (Stripe)

Smallest possible setup — one third-party API behind one Bearer token.

## Wiring

```ts
// src/index.ts (minimal version)
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { ApiClient } from './api-client.js';
import { loadConfigFromEnv } from './config.js';

const config = loadConfigFromEnv('stripe-mcp', [
  {
    slug: 'stripe',
    name: 'Stripe',
    defaultBaseUrl: 'https://api.stripe.com/v1',
    type: 'external',
  },
]);

const stripe = new ApiClient(config.apps.stripe);

const server = new McpServer({ name: config.serverName, version: '0.1.0' });

server.tool(
  'stripe_list_customers',
  'List recent Stripe customers (max 10 per call).',
  { limit: z.number().int().min(1).max(100).optional() },
  async ({ limit }) => {
    const result = await stripe.get('/customers', { limit: String(limit ?? 10) });
    return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
  },
);

server.tool(
  'stripe_create_payment_link',
  'Create a one-off payment link for a price.',
  { price_id: z.string(), quantity: z.number().int().min(1).default(1) },
  async ({ price_id, quantity }) => {
    const result = await stripe.post('/payment_links', {
      'line_items[0][price]': price_id,
      'line_items[0][quantity]': String(quantity),
    });
    return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
  },
);

await server.connect(new StdioServerTransport());
console.error('Stripe MCP gateway running');
```

## Env

```env
STRIPE_API_TOKEN=sk_live_xxxxx
```

> ⚠️ Production note: Stripe tokens have **full account permissions**. For a real setup, use a [restricted key](https://docs.stripe.com/keys#limit-access) scoped to the resources you need.
