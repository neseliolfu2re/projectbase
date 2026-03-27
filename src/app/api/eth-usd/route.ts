import { NextResponse } from 'next/server'

export const revalidate = 60

const COINGECKO =
  'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'

export async function GET() {
  try {
    const res = await fetch(COINGECKO, {
      next: { revalidate: 60 },
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
