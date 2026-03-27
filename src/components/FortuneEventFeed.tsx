'use client'

import { useAccount, usePublicClient, useWatchContractEvent } from 'wagmi'
import { base } from 'wagmi/chains'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FORTUNE_COOKIE_ADDRESS, fortuneCookieAbi, fortuneMessages } from '@/config/fortuneCookie'

const MAX_BLOCKS_LOOKBACK = 25_000n

type FeedItem = {
  user: string
  rarity: number
  messageId: number
  openedAt: bigint
  totalOpened: bigint
  txHash?: string
  logIndex?: number
}

function rarityLabel(rarity?: number) {
  if (rarity === undefined) return '—'
  if (rarity === 0) return 'Common'
  if (rarity === 1) return 'Rare'
  if (rarity === 2) return 'Legendary'
  return `Rarity ${rarity}`
}

function itemKey(it: FeedItem) {
  return `${it.txHash ?? 'tx'}_${it.logIndex ?? 0}`
}

function mergeFeed(prev: FeedItem[], incoming: FeedItem[]): FeedItem[] {
  const seen = new Set(prev.map(itemKey))
  const next = [...prev]
  for (const it of incoming) {
    const k = itemKey(it)
    if (seen.has(k)) continue
    seen.add(k)
    next.push(it)
  }
  next.sort((a, b) => {
    if (a.openedAt !== b.openedAt) return Number(b.openedAt - a.openedAt)
    return (b.txHash ?? '').localeCompare(a.txHash ?? '')
  })
  return next.slice(0, 24)
}

export function FortuneEventFeed() {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient({ chainId: base.id })
  const [items, setItems] = useState<FeedItem[]>([])
  const [pastError, setPastError] = useState<string | null>(null)
  const [pastLoading, setPastLoading] = useState(false)

  type CookieOpenedArgs = {
    user: string
    rarity: bigint
    messageId: bigint
    openedAt: bigint
    totalOpened: bigint
  }

  const mapLogToItem = useCallback((log: { args?: unknown; transactionHash?: `0x${string}`; logIndex?: number }) => {
    const args = log.args as Partial<CookieOpenedArgs> | undefined
    if (!args?.user) return null
    return {
      user: args.user,
      rarity: Number(args.rarity ?? 0n),
      messageId: Number(args.messageId ?? 0n),
      openedAt: (args.openedAt ?? 0n) as bigint,
      totalOpened: (args.totalOpened ?? 0n) as bigint,
      txHash: log.transactionHash,
      logIndex: log.logIndex,
    } satisfies FeedItem
  }, [])

  const loadPastEvents = useCallback(async () => {
    if (!publicClient || !address || FORTUNE_COOKIE_ADDRESS === '0x0000000000000000000000000000000000000000') return
    setPastLoading(true)
    setPastError(null)
    try {
      const latest = await publicClient.getBlockNumber()
      const from = latest > MAX_BLOCKS_LOOKBACK ? latest - MAX_BLOCKS_LOOKBACK : 0n
      const logs = await publicClient.getContractEvents({
        address: FORTUNE_COOKIE_ADDRESS,
        abi: fortuneCookieAbi,
        eventName: 'CookieOpened',
        args: { user: address },
        fromBlock: from,
        toBlock: latest,
      })
      const mapped: FeedItem[] = []
      for (const log of logs) {
        const it = mapLogToItem(log as Parameters<typeof mapLogToItem>[0])
        if (it) mapped.push(it)
      }
      setItems((prev) => mergeFeed(prev, mapped))
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load past events'
      setPastError(msg)
    } finally {
      setPastLoading(false)
    }
  }, [address, mapLogToItem, publicClient])

  useEffect(() => {
    if (!isConnected || !address) {
      setItems([])
      return
    }
    void loadPastEvents()
  }, [address, isConnected, loadPastEvents])

  useWatchContractEvent({
    address: FORTUNE_COOKIE_ADDRESS,
    abi: fortuneCookieAbi,
    eventName: 'CookieOpened',
    chainId: base.id,
    onLogs: (logs) => {
      if (!logs?.length || !address) return
      setItems((prev) => {
        const incoming: FeedItem[] = []
        for (const log of logs) {
          const args = log.args as unknown as Partial<CookieOpenedArgs> | undefined
          const user = args?.user
          if (!user || user.toLowerCase() !== address.toLowerCase()) continue
          const it = mapLogToItem(log)
          if (it) incoming.push(it)
        }
        if (incoming.length === 0) return prev
        return mergeFeed(prev, incoming)
      })
    },
  })

  const title = useMemo(() => {
    if (!isConnected) return 'Onchain events'
    return `Events · ${address?.slice(0, 6)}…${address?.slice(-4)}`
  }, [address, isConnected])

  if (!isConnected) return null

  return (
    <section className="fc-card flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-100 pb-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Last ~{MAX_BLOCKS_LOOKBACK.toString()} blocks + live updates
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadPastEvents()}
          disabled={pastLoading}
          className="fc-btn-secondary shrink-0 py-2 text-xs"
        >
          {pastLoading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {pastError && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Past logs: {pastError} Live updates still work.
        </p>
      )}

      {items.length === 0 && !pastLoading ? (
        <p className="text-sm text-zinc-600">
          No <code className="rounded bg-zinc-100 px-1 font-mono text-xs">CookieOpened</code> events in this
          range yet. Open a cookie or try Refresh.
        </p>
      ) : null}

      {pastLoading && items.length === 0 ? (
        <p className="text-sm text-zinc-500">Loading onchain history…</p>
      ) : null}

      {items.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            Newest first · {items.length} shown
          </div>
          {items.map((it) => {
            const message = fortuneMessages[it.messageId % fortuneMessages.length]
            return (
              <div key={itemKey(it)} className="rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold">{rarityLabel(it.rarity)}</div>
                  <div className="font-mono text-xs text-zinc-600">#{it.messageId}</div>
                </div>
                <div className="mt-1 text-sm text-zinc-800">{message}</div>
                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-600">
                  <span>Total opened: {it.totalOpened.toString()}</span>
                  <span>•</span>
                  <span>Time: {new Date(Number(it.openedAt) * 1000).toLocaleString()}</span>
                  {it.txHash && (
                    <>
                      <span>•</span>
                      <a
                        className="underline"
                        href={`https://basescan.org/tx/${it.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Basescan
                      </a>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
