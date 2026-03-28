/** Canonical site origin for manifests and meta tags (no trailing slash). */
export function getPublicBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  return raw.replace(/\/$/, '')
}
