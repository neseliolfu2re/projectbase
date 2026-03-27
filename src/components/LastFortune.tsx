'use client'

import { useAccount, useReadContract } from 'wagmi'
import { base } from 'wagmi/chains'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  FORTUNE_COOKIE_ADDRESS,
  fortuneCookieAbi,
  fortuneMessages,
} from '@/config/fortuneCookie'
import { ShareFortune } from '@/components/ShareFortune'

function rarityLabel(rarity?: number) {
  if (rarity === undefined) return '—'
  if (rarity === 0) return 'Common'
  if (rarity === 1) return 'Rare'
  if (rarity === 2) return 'Legendary'
  return `Rarity ${rarity}`
}

export function LastFortune() {
  const { address, isConnected } = useAccount()
  const [isRevealing, setIsRevealing] = useState(false)
  const prevTotalOpenedRef = useRef<bigint | undefined>(undefined)

  const { data, isLoading, isError } = useReadContract({
    address: FORTUNE_COOKIE_ADDRESS,
    abi: fortuneCookieAbi,
    functionName: 'getLastFortune',
    args: [address ?? '0x0000000000000000000000000000000000000000'],
    chainId: base.id,
    query: {
      enabled: isConnected && Boolean(address) && FORTUNE_COOKIE_ADDRESS !==
        '0x0000000000000000000000000000000000000000',
    },
  })

  const messageId = data?.[1]
  const rarity = data?.[0]
  const openedAt = data?.[2]
  const totalOpened = data?.[3]

  const rarityNum = useMemo(() => {
    if (typeof rarity === 'bigint') return Number(rarity)
    if (typeof rarity === 'number') return rarity
    return 0
  }, [rarity])

  const theme = useMemo(() => {
    if (rarityNum === 2) {
      return {
        pill: 'border-amber-200/70 bg-amber-50 text-amber-900',
        card: 'border-amber-200/70 bg-gradient-to-br from-amber-50 via-white to-amber-50',
        glow: 'shadow-[0_0_0_1px_rgba(251,191,36,0.25),0_0_40px_rgba(251,191,36,0.25)]',
      }
    }
    if (rarityNum === 1) {
      return {
        pill: 'border-sky-200/70 bg-sky-50 text-sky-900',
        card: 'border-sky-200/70 bg-gradient-to-br from-sky-50 via-white to-sky-50',
        glow: 'shadow-[0_0_0_1px_rgba(56,189,248,0.22),0_0_40px_rgba(56,189,248,0.15)]',
      }
    }
    return {
      pill: 'border-zinc-200/70 bg-zinc-50 text-zinc-900',
      card: 'border-zinc-200/70 bg-gradient-to-br from-white via-zinc-50 to-white',
      glow: 'shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_0_24px_rgba(0,0,0,0.05)]',
    }
  }, [rarityNum])

  const message = useMemo(() => {
    if (typeof messageId !== 'bigint') return undefined
    return fortuneMessages[Number(messageId) % fortuneMessages.length]
  }, [messageId])

  useEffect(() => {
    if (typeof totalOpened !== 'bigint') return
    const prev = prevTotalOpenedRef.current
    // Only animate when their counter increases.
    if (prev !== undefined && totalOpened > prev) {
      // Avoid calling setState directly in the effect body.
      void Promise.resolve().then(() => setIsRevealing(true))
    }
    prevTotalOpenedRef.current = totalOpened
  }, [totalOpened])

  useEffect(() => {
    if (!isRevealing) return
    const t = setTimeout(() => setIsRevealing(false), 900)
    return () => clearTimeout(t)
  }, [isRevealing])

  if (!isConnected) {
    return (
      <section className="fc-card">
        <h2 className="text-base font-semibold text-zinc-900">Latest cookie</h2>
        <p className="mt-2 text-sm text-zinc-600">Connect your wallet to see your fortune.</p>
      </section>
    )
  }
  if (FORTUNE_COOKIE_ADDRESS === '0x0000000000000000000000000000000000000000') {
    return (
      <section className="fc-card">
        <h2 className="text-base font-semibold text-zinc-900">Latest cookie</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Contract address missing. Add{' '}
          <code className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-xs">NEXT_PUBLIC_FORTUNE_COOKIE_ADDRESS</code>{' '}
          to <code className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-xs">.env.local</code>.
        </p>
      </section>
    )
  }
  if (isLoading && data === undefined) {
    return (
      <section className="fc-card">
        <h2 className="text-base font-semibold text-zinc-900">Latest cookie</h2>
        <p className="mt-2 text-sm text-zinc-500">Loading…</p>
      </section>
    )
  }
  if (isError && data === undefined) {
    return (
      <section className="fc-card">
        <h2 className="text-base font-semibold text-zinc-900">Latest cookie</h2>
        <p className="mt-2 text-sm text-red-600">Could not read the contract.</p>
      </section>
    )
  }

  const totalForUser = totalOpened
  const hasFortune = typeof totalOpened === 'bigint' ? totalOpened > 0 : false
  const isLegendaryReveal = isRevealing && rarityNum === 2

  return (
    <div
      className={[
        'fc-card relative w-full transition-all duration-300',
        theme.card,
        theme.glow,
        isRevealing ? 'scale-[1.01] opacity-100' : 'opacity-100',
      ].join(' ')}
    >
      {isLegendaryReveal && (
        <div className="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2">
          <div className="rounded-full bg-black/90 px-4 py-1 text-sm font-bold text-amber-50 shadow-[0_0_60px_rgba(251,191,36,0.35)]">
            LEGENDARY!
          </div>
        </div>
      )}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-zinc-900">Latest cookie</h2>
        <span className={['rounded-full border px-3 py-1 text-sm', theme.pill].join(' ')}>
          {rarityLabel(rarityNum)}
        </span>
      </div>
      <p
        className={[
          'mt-4 text-xl leading-8',
          isRevealing ? 'animate-pulse' : '',
        ].join(' ')}
      >
        {hasFortune ? message : 'No cookie yet. Use “Open a cookie” above.'}
      </p>
      <div className="mt-4 text-sm text-zinc-600">
        <div>
          Total opened:{' '}
          {typeof totalForUser === 'bigint' ? totalForUser.toString() : '—'}
        </div>
        <div>
          Time:{' '}
          {typeof openedAt === 'bigint'
            ? new Date(Number(openedAt) * 1000).toLocaleString()
            : '—'}
        </div>
      </div>
      {hasFortune && message ? (
        <ShareFortune fortuneText={message} rarityLabel={rarityLabel(rarityNum)} />
      ) : null}
    </div>
  )
}
