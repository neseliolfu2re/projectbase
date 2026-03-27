'use client'

import { useAccount, useWatchContractEvent } from 'wagmi'
import { base } from 'wagmi/chains'
import { useMemo, useState } from 'react'
import { FORTUNE_COOKIE_ADDRESS, fortuneCookieAbi, fortuneMessages } from '@/config/fortuneCookie'

function rarityLabel(rarity?: number) {
  if (rarity === undefined) return '—'
  if (rarity === 0) return 'Common'
  if (rarity === 1) return 'Rare'
  if (rarity === 2) return 'Legendary'
  return `Rarity ${rarity}`
}

export function FortuneEventFeed() {
  const { address, isConnected } = useAccount()
  const [items, setItems] = useState<
    Array<{ user: string; rarity: number; messageId: number; openedAt: bigint; totalOpened: bigint; txHash?: string }>
  >([])

  type CookieOpenedArgs = {
    user: string
    rarity: bigint
    messageId: bigint
    openedAt: bigint
    totalOpened: bigint
  }

  useWatchContractEvent({
    address: FORTUNE_COOKIE_ADDRESS,
    abi: fortuneCookieAbi,
    eventName: 'CookieOpened',
    chainId: base.id,
    // Filter live feed to your wallet (indexed user).
    // wagmi args matching can be finicky across versions; we also filter in JS for safety.
    onLogs: (logs) => {
      if (!logs?.length) return
      setItems((prev) => {
        const next = [...prev]
        for (const log of logs) {
          const args = log.args as unknown as Partial<CookieOpenedArgs> | undefined
          const user = args?.user
          if (!address || !user || user.toLowerCase() !== address.toLowerCase()) continue

          const rarity = Number(args?.rarity ?? 0n)
          const messageId = Number(args?.messageId ?? 0n)
          const openedAt = (args?.openedAt ?? 0n) as bigint
          const totalOpened = (args?.totalOpened ?? 0n) as bigint
          next.unshift({
            user,
            rarity,
            messageId,
            openedAt,
            totalOpened,
            txHash: log.transactionHash,
          })
        }
        return next.slice(0, 12)
      })
    },
  })

  const hasItems = items.length > 0
  const title = useMemo(() => {
    if (!isConnected) return 'Onchain event feed'
    return `Onchain events (${address?.slice(0, 6)}...${address?.slice(-4)})`
  }, [address, isConnected])

  if (!isConnected) return null
  if (!hasItems) {
    return (
      <section className="flex flex-col gap-3 rounded-2xl border bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <div className="text-xs text-zinc-600">Live updates (new opens).</div>
        </div>
        <p className="text-zinc-600">No new cookie opens yet. Open one to see it here.</p>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-3 rounded-2xl border bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="text-xs text-zinc-600">Latest {items.length} events.</div>
      </div>

      <div className="flex flex-col gap-2">
        {items.map((it, idx) => {
          const message = fortuneMessages[it.messageId % fortuneMessages.length]
          return (
            <div key={`${it.txHash ?? 'evt'}_${idx}`} className="rounded-xl border bg-zinc-50 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold">{rarityLabel(it.rarity)}</div>
                <div className="font-mono text-xs text-zinc-600">#{it.messageId}</div>
              </div>
              <div className="mt-1 text-sm text-zinc-800">{message}</div>
              <div className="mt-2 text-xs text-zinc-600">
                Total opened: {it.totalOpened.toString()} • Time:{' '}
                {new Date(Number(it.openedAt) * 1000).toLocaleString()}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

