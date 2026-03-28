import { NextResponse } from 'next/server'
import { buildFarcasterManifest } from '@/lib/farcasterManifest'

export const dynamic = 'force-dynamic'

export function GET() {
  const body = buildFarcasterManifest()
  return NextResponse.json(body, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
