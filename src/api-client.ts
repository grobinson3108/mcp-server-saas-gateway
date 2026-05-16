import { AppConfig } from './config.js';

/**
 * Lightweight HTTP client used by registered tools.
 *
 * Holds the per-app baseUrl + Bearer token, exposes the four common verbs
 * with consistent error handling, and lets each tool decide how to shape
 * the response.
 */
export class ApiClient {
  constructor(private readonly config: AppConfig) {}

  async get(path: string, params?: Record<string, string>): Promise<any> {
    const url = new URL(`${this.config.baseUrl}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== '') {
          url.searchParams.set(key, value);
        }
      }
    }

    const response = await fetch(url.toString(), { headers: this.headers() });
    return this.handle(response, 'GET', path);
  }

  async post(path: string, body?: Record<string, any>): Promise<any> {
    return this.bodyVerb('POST', path, body);
  }

  async put(path: string, body?: Record<string, any>): Promise<any> {
    return this.bodyVerb('PUT', path, body);
  }

  async patch(path: string, body?: Record<string, any>): Promise<any> {
    return this.bodyVerb('PATCH', path, body);
  }

  async delete(path: string): Promise<any> {
    const response = await fetch(`${this.config.baseUrl}${path}`, {
      method: 'DELETE',
      headers: this.headers(),
    });
    return this.handle(response, 'DELETE', path);
  }

  private async bodyVerb(
    method: 'POST' | 'PUT' | 'PATCH',
    path: string,
    body?: Record<string, any>,
  ): Promise<any> {
    const response = await fetch(`${this.config.baseUrl}${path}`, {
      method,
      headers: { ...this.headers(), 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handle(response, method, path);
  }

  private async handle(response: Response, method: string, path: string): Promise<any> {
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(
        `[${this.config.name}] ${method} ${path} → ${response.status} ${response.statusText}` +
          (text ? ` — ${text.slice(0, 500)}` : ''),
      );
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return response.json();
    }
    return response.text();
  }

  private headers(): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };
    if (this.config.token) {
      headers.Authorization = `Bearer ${this.config.token}`;
    }
    return headers;
  }
}
