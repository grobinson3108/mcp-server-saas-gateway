# AGENTS.md — Instructions for coding agents

If you're an AI coding agent (Claude Code, Cursor, etc.) working on this template, read this first.

## Project shape

`mcp-server-saas-gateway` is a **TypeScript template** (not a published npm package) for building MCP servers that aggregate multiple REST APIs. It's meant to be **forked and customized**, not installed.

Three files only:
- `src/api-client.ts` — HTTP client (Bearer auth, ~75 lines)
- `src/config.ts` — env-driven app registry (~50 lines)
- `src/index.ts` — entry point + tool registration (~100 lines, customize this)

## Conventions

- TypeScript 5.7+, strict mode on
- ESM modules (`"type": "module"`)
- Node 20+
- Each tool callback is a 3-line lambda — no clever abstractions
- One `server.tool()` call per endpoint, named `{app_slug}_{action}`

## What NOT to do

- Don't add OpenAPI codegen — kept intentionally manual
- Don't add a tool registry / discovery layer — explicit > clever
- Don't add HTTP transport in v0.x — stdio only by design
- Don't merge tools from different apps into one — keep the `app_slug_` prefix

## Testing

`npx tsc --noEmit` checks compilation. There's no test runner — tools are validated by Claude usage.

## When in doubt

Open an issue first. The whole point of this repo is "simple and readable" — don't trade that for features.
