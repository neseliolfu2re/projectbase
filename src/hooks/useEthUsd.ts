'use client'

import { useQuery } from '@tanstack/react-query'
import { ETH_USD_CACHE_SECONDS } from '@/lib/ethUsdCache'

type Opts = { enabled?: boolean }

const staleMs = ETH_USD_CACHE_SECONDS * 1000

/**
 * Approximate ETH/USD for UI only. Tries `/api/eth-usd` (CoinGecko via server),
 * falls back to env hint in consumers when query fails.
 */
export function useEthUsd(opts?: Opts) {
  return useQuery({
    queryKey: ['eth-usd'],
    queryFn: async () => {
      const res = await fetch('/api/eth-usd')
      if (!res.ok) throw new Error('eth-usd')
      const json: { usdPerEth?: number } = await res.json()
      if (typeof json.usdPerEth !== 'number' || !Number.isFinite(json.usdPerEth)) {
        throw new Error('parse')
      }
      return json.usdPerEth
    },
    staleTime: staleMs,
    gcTime: staleMs * 2,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: opts?.enabled !== false,
  })
}
