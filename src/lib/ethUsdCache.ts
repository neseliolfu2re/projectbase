/**
 * CoinGecko proxy cache duration (seconds). UI hint only — longer cache reduces rate limits.
 * Keep in sync with `useEthUsd` staleTime and `export const revalidate` in
 * `src/app/api/eth-usd/route.ts` (Next.js requires a numeric literal there).
 */
export const ETH_USD_CACHE_SECONDS = 600
