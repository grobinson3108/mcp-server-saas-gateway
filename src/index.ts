#!/usr/bin/env node

/**
 * Example entry point — this file is meant to be COPIED and CUSTOMIZED.
 *
 * It demonstrates how to wire ApiClient + GatewayConfig into an MCP server
 * with a small set of generic tools (one per app: list resources, get resource).
 *
 * For a real deployment, fork the project, edit the `appDefinitions` array
 * below, and register your real tools using the McpServer API.
 *
 * See examples/ for richer scenarios.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { ApiClient } from './api-client.js';
import { loadConfigFromEnv } from './config.js';

const config = loadConfigFromEnv('saas-gateway', [
  {
    slug: 'example',
    name: 'Example API',
    defaultBaseUrl: 'https://api.example.com/v1',
    type: 'internal',
  },
]);

const clients: Record<string, ApiClient> = {};
for (const [slug, appConfig] of Object.entries(config.apps)) {
  clients[slug] = new ApiClient(appConfig);
}

const server = new McpServer({
  name: config.serverName,
  version: '0.1.0',
});

// ───────────────────────────────────────────────
// Gateway-level tool: list registered apps
// ───────────────────────────────────────────────

server.tool(
  'gateway_list_apps',
  'List all SaaS apps wired into this gateway, with their type and configuration status.',
  {},
  async () => {
    const apps = Object.entries(config.apps).map(([slug, app]) => ({
      slug,
      name: app.name,
      baseUrl: app.baseUrl,
      type: app.type ?? 'unspecified',
      authenticated: Boolean(app.token),
    }));

    return {
      content: [{ type: 'text' as const, text: JSON.stringify(apps, null, 2) }],
    };
  },
);

// ───────────────────────────────────────────────
// Example per-app tool (replace with yours)
// ───────────────────────────────────────────────

server.tool(
  'example_get_resource',
  'Fetch a resource from the Example API by ID.',
  {
    resource_id: z.string().describe('The resource ID to fetch'),
  },
  async ({ resource_id }) => {
    const result = await clients.example.get(`/resources/${resource_id}`);
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
    };
  },
);

// ───────────────────────────────────────────────
// Start
// ───────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`[${config.serverName}] running on stdio`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
