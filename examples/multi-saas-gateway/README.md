# Multi-SaaS gateway example

Inspired by a real-world setup that exposes 4 internal SaaS apps (PostMaid, Daiv, Botlers, AGSteel) through a single MCP server.

## Idea

Each SaaS is a separate REST API behind its own Bearer token. Rather than wire 4 MCP servers into Claude Desktop, you wire **one gateway** that surfaces tools from all 4 — Claude can then orchestrate workflows across them in a single conversation.

## Wiring

```ts
// src/index.ts
const config = loadConfigFromEnv('automatehub-gateway', [
  { slug: 'postmaid', name: 'PostMaid', defaultBaseUrl: 'https://automatehub.fr/api/postmaid' },
  { slug: 'daiv', name: 'Daiv', defaultBaseUrl: 'https://automatehub.fr/api/v1/daiv' },
  { slug: 'botlers', name: 'Botlers', defaultBaseUrl: 'https://app.botlers.app/api/v1' },
  { slug: 'agsteel', name: 'AGSteel', defaultBaseUrl: 'https://api.example.com' },
]);

// Per-app tools
server.tool('postmaid_get_profile', '...', {}, async () => {
  const result = await clients.postmaid.get('/profile');
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});

server.tool('daiv_list_projects', '...', {}, async () => {
  const result = await clients.daiv.get('/projects');
  return { content: [{ type: 'text', text: JSON.stringify(result.data, null, 2) }] };
});

// ... etc, ~30 tools total
```

## Env vars

```env
POSTMAID_API_TOKEN=1|xxx
DAIV_API_TOKEN=2|yyy
BOTLERS_API_TOKEN=3|zzz
AGSTEEL_API_TOKEN=4|aaa
```

URLs default to the production endpoints — override with `*_API_URL` for staging.

## Claude config

```json
{
  "mcpServers": {
    "automatehub": {
      "command": "node",
      "args": ["/absolute/path/to/dist/index.js"],
      "env": {
        "POSTMAID_API_TOKEN": "1|xxx",
        "DAIV_API_TOKEN": "2|yyy",
        "BOTLERS_API_TOKEN": "3|zzz",
        "AGSTEEL_API_TOKEN": "4|aaa"
      }
    }
  }
}
```

## Patterns this enables

- **Cross-SaaS workflows**: "Take last week's PostMaid posts, check which ones converted in Botlers leads, then create a Daiv task to follow up"
- **Centralized auth surface**: rotate one .env file, all 4 apps stay accessible
- **Single MCP server entry in Claude config**: cleaner than 4 separate entries
