# Changelog

All notable changes to `mcp-server-saas-gateway` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- HTTP/SSE transport (currently stdio only)
- OpenAPI codegen helper (opt-in)
- Per-tool auth scopes

## [0.1.0] — 2026-05-16

### Added
- `src/api-client.ts` — generic HTTP client with Bearer auth (GET/POST/PUT/PATCH/DELETE)
- `src/config.ts` — env-driven gateway config with `loadConfigFromEnv()` helper
- `src/index.ts` — entry point template demonstrating tool registration
- Example: `multi-saas-gateway/` — real-world 4-app gateway pattern
- Example: `stripe-only/` — minimal single-API setup
- MIT License

### Origin
Pattern extracted from a production setup fronting 4 internal SaaS (PostMaid, Daiv, Botlers, AGSteel) through a single MCP server.

[Unreleased]: https://github.com/grobinson3108/mcp-server-saas-gateway/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/grobinson3108/mcp-server-saas-gateway/releases/tag/v0.1.0
