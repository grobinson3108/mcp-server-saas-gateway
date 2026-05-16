<div align="center">

# 🌉 MCP Server: SaaS Gateway

**A small TypeScript template for building one [Model Context Protocol](https://modelcontextprotocol.io) server that fronts many REST APIs.**

One gateway, N apps. Drop tokens in env vars, expose each API as a slug, ship a single MCP entry to Claude Desktop / Claude Code.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node 20+](https://img.shields.io/badge/Node-20+-339933.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178C6.svg)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-compatible-10b981.svg)](https://modelcontextprotocol.io)

</div>

---

## Why this exists

The default pattern in the MCP ecosystem is one server per backend. That works fine when you only need Slack OR GitHub. It gets messy fast when you actually want Claude to orchestrate **across** several of your own SaaS APIs in a single conversation — every backend becomes another entry in `claude_desktop_config.json`, with its own token to rotate.

This template flips the model: **one gateway server, N apps**. Each app is a slug + baseUrl + Bearer token. Tools are named `{app_slug}_{action}` so Claude understands which API does what.

Born from a real production setup that fronts 4 internal SaaS (PostMaid, Daiv, Botlers, AGSteel) and exposes ~30 tools through one MCP entry — total config footprint in Claude Desktop: 6 lines.

This is **not** a published npm package — it's a **template**. Fork it, edit `src/index.ts` and `src/config.ts`, ship your own gateway.

---

## Quick start

```bash
# 1. Clone the template
git clone https://github.com/grobinson3108/mcp-server-saas-gateway.git my-gateway
cd my-gateway

# 2. Install + build
npm install
npm run build

# 3. Run with your tokens
EXAMPLE_API_TOKEN=your-token npm start
```

Wire into Claude Desktop:

```json
{
  "mcpServers": {
    "my-gateway": {
      "command": "node",
      "args": ["/absolute/path/to/my-gateway/dist/index.js"],
      "env": {
        "EXAMPLE_API_TOKEN": "your-token"
      }
    }
  }
}
```

Restart Claude Desktop. Your tools appear under the 🔌 icon.

---

## What's inside

| File | Role |
|------|------|
| `src/api-client.ts` | Tiny generic HTTP client. Bearer auth, JSON in/out, consistent error format. |
| `src/config.ts` | Config schema + `loadConfigFromEnv()` helper. Per-app convention: `{SLUG}_API_URL` + `{SLUG}_API_TOKEN`. |
| `src/index.ts` | The entry point — also the example. **This is the file you edit** to register your apps and tools. |
| `examples/multi-saas-gateway/` | Real-world example: 4 apps, ~30 tools. |
| `examples/stripe-only/` | Smallest possible setup: one third-party API, two tools. |

---

## The pattern

```ts
// 1. Declare your apps
const config = loadConfigFromEnv('my-gateway', [
  { slug: 'postmaid', name: 'PostMaid',  defaultBaseUrl: '...', type: 'internal' },
  { slug: 'stripe',   name: 'Stripe',    defaultBaseUrl: 'https://api.stripe.com/v1', type: 'external' },
]);

// 2. Build a client per app
const clients = Object.fromEntries(
  Object.entries(config.apps).map(([slug, app]) => [slug, new ApiClient(app)])
);

// 3. Register tools, namespaced by slug
server.tool('postmaid_get_profile', 'Get PostMaid editorial profile', {}, async () => {
  return wrap(await clients.postmaid.get('/profile'));
});

server.tool('stripe_list_customers', 'List recent Stripe customers',
  { limit: z.number().optional() },
  async ({ limit }) => wrap(await clients.stripe.get('/customers', { limit: String(limit ?? 10) }))
);
```

That's it. No registry magic, no codegen, no schema crawling. Each tool is a 3-line lambda that calls one endpoint.

---

## When to use this template vs alternatives

| Setup | Best for |
|-------|----------|
| **This template** | You own / use several REST APIs and want Claude to orchestrate across them. |
| One MCP server per API ([punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers)) | You only need one backend and want to use someone else's published server. |
| [Anthropic TS SDK](https://github.com/modelcontextprotocol/typescript-sdk) raw | You're building something significantly more complex than HTTP gateway. |
| [laravel-mcp-server](https://github.com/grobinson3108/laravel-mcp-server) (PHP/Laravel) | Your app **is** the backend and is built in Laravel. |

---

## Trade-offs we made

- **No schema introspection / OpenAPI codegen.** Adding it would buy you 10 minutes per tool while costing a lot of maintenance complexity. Tools are 3 lines of TypeScript — writing them by hand stays fast and readable.
- **stdio only.** HTTP/SSE transport is on the roadmap if a real use case shows up.
- **No per-tool authorization.** All apps share the gateway's spawn-time env. If you need per-call scopes, do it inside the tool callback (the Bearer token of the app is yours to scope however you want).
- **Not on npm.** This is a starter template — fork-and-edit beats install-and-configure for this kind of code.

---

## Examples

- [`examples/multi-saas-gateway/`](examples/multi-saas-gateway/) — A 4-app gateway inspired by a real production setup
- [`examples/stripe-only/`](examples/stripe-only/) — Minimal Stripe wrapper

---

## License

MIT — see [`LICENSE`](LICENSE).

---

## About the author

**Greg Robinson** — AI Architect, RAG and agentic systems, [Audelalia](https://audelalia.fr) (🇫🇷 Montpellier).

Companion package for the PHP side: [laravel-mcp-server](https://github.com/grobinson3108/laravel-mcp-server) — same idea, but for Laravel apps where the SaaS itself is the backend.

⭐ If this saved you an hour, drop a star.
