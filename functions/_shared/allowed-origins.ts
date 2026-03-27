/**
 * Shared origin allowlist for Cloudflare Pages Functions.
 *
 * Allows requests from:
 *  - The Chrome extension (chrome-extension://<id>)
 *  - The desktop app (http(s)://app.lovelofi.desktop)
 *  - localhost during development
 */

const ALLOWED_ORIGINS: string[] = [
  // Chrome extension (production)
  'chrome-extension://mendcekkmnbilibckdlilbpikmdjllic',
  // Tauri desktop app (macOS/Linux use http://, Windows uses https://)
  'http://app.lovelofi.desktop',
  'https://app.lovelofi.desktop',
];

const ALLOWED_ORIGIN_PREFIXES: string[] = [
  // Any Chrome extension in dev (unpacked extensions get a random ID)
  'chrome-extension://',
  // Local development
  'http://localhost',
  'http://127.0.0.1',
];

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  return ALLOWED_ORIGIN_PREFIXES.some((prefix) => origin.startsWith(prefix));
}

export function withCors(response: Response, origin: string): Response {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Vary', 'Origin');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
