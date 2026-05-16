# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| 0.1.x   | ✅ |
| < 0.1   | ❌ |

## Reporting a vulnerability

**Do not open a public GitHub issue for security problems.**

Email **greg@audelalia.fr** with:
- The vulnerability description
- Reproduction steps
- Potential impact
- Suggested fix (if you have one)

I'll respond within 72 hours.

## Scope

This template's attack surface:
- **Bearer tokens** are read from env vars (per app `{SLUG}_API_TOKEN`), never logged, never persisted
- **stdio transport** — the MCP client (Claude Desktop, etc.) controls the channel; we trust the OS process boundary
- **No HTTP server** by default — no exposed network surface

Out of scope:
- Vulnerabilities in upstream packages (`@modelcontextprotocol/sdk`, `zod`) — report those upstream
- Vulnerabilities in user-written tool callbacks — those are user code
- API security of the upstream SaaS the gateway fronts — that's the SaaS owners' problem
