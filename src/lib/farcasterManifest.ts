import { getPublicBaseUrl } from '@/lib/publicBaseUrl'

/**
 * Farcaster mini app manifest body for `/.well-known/farcaster.json`.
 * @see https://miniapps.farcaster.xyz/docs/specification
 *
 * Set `FARCASTER_ACCOUNT_ASSOCIATION_JSON` (full JSON object) when you have signed domain association;
 * without it, discovery may be limited until you complete publishing.
 */
export function buildFarcasterManifest(): Record<string, unknown> {
  const base = getPublicBaseUrl()

  const miniapp = {
    version: '1',
    name: 'Fortune Cookie',
    subtitle: 'Onchain fortunes on Base',
    description:
      'Connect a wallet on Base, open a cookie, get a rarity-weighted fortune. History and events stay onchain.',
    iconUrl: `${base}/opengraph-image`,
    homeUrl: `${base}/mini`,
    imageUrl: `${base}/opengraph-image`,
    buttonTitle: 'Open cookie',
    splashBackgroundColor: '#f4f6fb',
    primaryCategory: 'games',
    tags: ['base', 'fortune', 'onchain'],
    heroImageUrl: `${base}/opengraph-image`,
    tagline: 'Crack a cookie on Base',
    ogTitle: 'Fortune Cookie on Base',
    ogDescription: 'Onchain fortune cookies — rarity, history, and events on Base.',
    ogImageUrl: `${base}/opengraph-image`,
    requiredChains: ['eip155:8453'],
  }

  const manifest: Record<string, unknown> = { miniapp }

  const assoc = process.env.FARCASTER_ACCOUNT_ASSOCIATION_JSON
  if (assoc) {
    try {
      manifest.accountAssociation = JSON.parse(assoc) as unknown
    } catch {
      /* ignore invalid env */
    }
  }

  return manifest
}
