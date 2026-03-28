import { NextResponse } from 'next/server'
import { ETH_USD_CACHE_SECONDS } from '@/lib/ethUsdCache'

/** Must equal `ETH_USD_CACHE_SECONDS` (Next.js requires a static literal here). */
export const revalidate = 600

const COINGECKO =
  'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'

export async function GET() {
  try {
    const res = await fetch(COINGECKO, {
      next: { revalidate: ETH_USD_CACHE_SECONDS },
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) {
      return NextResponse.json({ error: 'upstream' }, { status: 502 })
    }
    const data: { ethereum?: { usd?: number } } = await res.json()
    const usd = data?.ethereum?.usd
    if (typeof usd !== 'number' || !Number.isFinite(usd) || usd <= 0) {
      return NextResponse.json({ error: 'parse' }, { status: 502 })
    }
    return NextResponse.json({ usdPerEth: usd })
  } catch {
    return NextResponse.json({ error: 'network' }, { status: 502 })
  }
}
