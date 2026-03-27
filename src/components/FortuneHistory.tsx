'use client'

import { useAccount, useReadContract } from 'wagmi'
import { base } from 'wagmi/chains'
import { useMemo, useState } from 'react'
import { FORTUNE_COOKIE_ADDRESS, fortuneCookieAbi, fortuneMessages } from '@/config/fortuneCookie'

const PAGE_SIZE = 6

function rarityLabel(rarity?: number) {
  if (rarity === undefined) return '—'
  if (rarity === 0) return 'Common'
  if (rarity === 1) return 'Rare'
  if (rarity === 2) return 'Legendary'
  return `Rarity ${rarity}`
}

function formatUnixSeconds(ts?: bigint) {
  if (ts === undefined) return '—'
  return new Date(Number(ts) * 1000).toLocaleString()
}

export function FortuneHistory() {
  const { address, isConnected } = useAccount()
  const [start, setStart] = useState(0)

  const queryEnabled =
    isConnected &&
    Boolean(address) &&
    FORTUNE_COOKIE_ADDRESS !== '0x0000000000000000000000000000000000000000'

  const { data, isLoading, isError } = useReadContract({
    address: FORTUNE_COOKIE_ADDRESS,
    abi: fortuneCookieAbi,
    functionName: 'getFortunes',
    args: [
      address ?? '0x0000000000000000000000000000000000000000',
      BigInt(start),
      BigInt(PAGE_SIZE),
    ],
    chainId: base.id,
    query: { enabled: queryEnabled },
  })

  const [rarityArr, messageIdArr, openedAtArr, totalOpened] = data ?? []

  const fortunes = useMemo(() => {
    if (!Array.isArray(rarityArr) || !Array.isArray(messageIdArr)) return []
    const len = Math.min(rarityArr.length, messageIdArr.length, Array.isArray(openedAtArr) ? openedAtArr.length : 0)
    return Array.from({ length: len }, (_, i) => {
      const rarity = Number(rarityArr[i] ?? 0n)
      const messageId = Number(messageIdArr[i] ?? 0n)
      const message = fortuneMessages[messageId % fortuneMessages.length]
      const openedAt = Array.isArray(openedAtArr) ? openedAtArr[i] : undefined
      return { i, rarity, messageId, message, openedAt }
    })
  }, [openedAtArr, messageIdArr, rarityArr])

  const totalOpenedNum = typeof totalOpened === 'bigint' ? Number(totalOpened) : 0
  const hasMore = totalOpenedNum > start + PAGE_SIZE

  if (!isConnected) return null
  if (isLoading && data === undefined) return <div className="text-zinc-600">Loading history...</div>
  if (isError && data === undefined) return <div className="text-zinc-600">History read failed.</div>

  return (
    <section className="flex flex-col gap-3 rounded-2xl border bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Your Cookie History</h2>
        <div className="text-sm text-zinc-600">
          Total opened:{' '}
          {typeof totalOpened === 'bigint' ? totalOpened.toString() : '—'}
        </div>
      </div>

      {fortunes.length === 0 ? (
        <p className="text-zinc-600">No cookies opened yet. Hit “Open Fortune Cookie” first.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {fortunes.map((f) => (
            <div
              key={f.i}
              className={[
                'rounded-xl border bg-zinc-50 p-3',
                f.rarity === 2
                  ? 'border-amber-200 bg-amber-50/60'
                  : f.rarity === 1
                    ? 'border-sky-200 bg-sky-50/60'
                    : 'border-zinc-200',
              ].join(' ')}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold">{rarityLabel(f.rarity)}</div>
                <div className="font-mono text-xs text-zinc-600">#{f.messageId}</div>
              </div>
              <div className="mt-1 text-sm text-zinc-800">{f.message}</div>
              <div className="mt-2 text-xs text-zinc-600">Time: {formatUnixSeconds(f.openedAt)}</div>
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <button
          onClick={() => setStart((s) => s + PAGE_SIZE)}
          className="mt-2 rounded-xl border bg-white px-4 py-2 text-sm hover:bg-zinc-50"
          disabled={isLoading}
        >
          Load more
        </button>
      )}
    </section>
  )
}

