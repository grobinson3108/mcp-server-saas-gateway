# Contributing

Thanks for considering a contribution!

## Issues first

This is a **template repo**, not a published package. Most users will fork and customize. Open an issue to discuss any change you think belongs upstream.

In-scope:
- Bug fixes in `api-client.ts`
- Better error messages
- Documentation improvements
- HTTP/SSE transport (for v1.0)
- New examples

Out of scope:
- OpenAPI / schema codegen (intentionally manual)
- Tool registry / discovery layer
- Domain-specific tools (those go in your fork)

## Pull requests

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Code + verify with `npx tsc --noEmit`
4. Commit with a clear message
5. Open PR against `main`

## License

By contributing, you agree your code is released under MIT.
