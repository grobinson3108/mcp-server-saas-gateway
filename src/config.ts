export interface AppConfig {
  /** Display name surfaced in error messages and the hub_list_apps tool. */
  name: string;
  /** Base URL of the API. Concatenated with each tool's path. */
  baseUrl: string;
  /** Bearer token. Empty string disables the Authorization header. */
  token: string;
  /** Free-form category: 'internal', 'external', 'saas', whatever you want. */
  type?: string;
}

export interface GatewayConfig {
  /** Public name of the MCP server, surfaced to Claude. */
  serverName: string;
  /** App registry, keyed by slug (used by tools to address an app). */
  apps: Record<string, AppConfig>;
}

/**
 * Build a config from environment variables.
 *
 * Convention: each app contributes two env vars: `{SLUG}_API_URL` and `{SLUG}_API_TOKEN`.
 * Override per-app baseUrl defaults in the array below.
 */
export function loadConfigFromEnv(serverName: string, appDefinitions: Array<{
  slug: string;
  name: string;
  defaultBaseUrl?: string;
  type?: string;
}>): GatewayConfig {
  const apps: Record<string, AppConfig> = {};

  for (const def of appDefinitions) {
    const envPrefix = def.slug.toUpperCase();
    apps[def.slug] = {
      name: def.name,
      baseUrl: process.env[`${envPrefix}_API_URL`] ?? def.defaultBaseUrl ?? '',
      token: process.env[`${envPrefix}_API_TOKEN`] ?? '',
      type: def.type,
    };

    if (!apps[def.slug].baseUrl) {
      console.error(
        `[mcp-server-saas-gateway] Warning: ${def.slug} has no baseUrl (set ${envPrefix}_API_URL or defaultBaseUrl).`,
      );
    }
  }

  return { serverName, apps };
}
