'use client'

import { useEffect } from 'react'
import {
  useAccount,
  useChainId,
  useReadContract,
  useSimulateContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import { formatEther } from 'viem'
import { base } from 'wagmi/chains'
import { FORTUNE_COOKIE_ADDRESS, fortuneCookieAbi } from '@/config/fortuneCookie'
import { useEthUsd } from '@/hooks/useEthUsd'

const ZERO = '0x0000000000000000000000000000000000000000' as const

/** Optional rough USD/ETH for display only (not a price oracle). */
function usdApproxLabel(wei: bigint, usdPerEth: number): string {
  const eth = Number(formatEther(wei))
  if (!Number.isFinite(eth) || !Number.isFinite(usdPerEth)) return ''
  const usd = eth * usdPerEth
  return `≈ $${usd < 0.01 ? usd.toFixed(4) : usd.toFixed(2)} USD`
}

export function OpenCookie() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const { data: hash, isPending, writeContract, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })
  const queryClient = useQueryClient()

  const contractConfigured = FORTUNE_COOKIE_ADDRESS !== ZERO

  const { data: priceWei, isLoading: priceLoading } = useReadContract({
    address: FORTUNE_COOKIE_ADDRESS,
    abi: fortuneCookieAbi,
    functionName: 'priceWei',
    chainId: base.id,
    query: {
      enabled: isConnected && contractConfigured && chainId === base.id,
    },
  })

  const { data: paused, isLoading: pausedLoading } = useReadContract({
    address: FORTUNE_COOKIE_ADDRESS,
    abi: fortuneCookieAbi,
    functionName: 'paused',
    chainId: base.id,
    query: {
      enabled: isConnected && contractConfigured && chainId === base.id,
    },
  })

  const stateReady =
    !priceLoading &&
    !pausedLoading &&
    priceWei !== undefined &&
    paused !== undefined

  const canSimulate =
    isConnected &&
    contractConfigured &&
    chainId === base.id &&
    stateReady &&
    !paused

  const needUsdApprox =
    isConnected &&
    contractConfigured &&
    chainId === base.id &&
    stateReady &&
    !paused &&
    priceWei !== undefined &&
    priceWei > 0n

  const { data: liveUsdPerEth, isError: usdLiveFailed } = useEthUsd({
    enabled: needUsdApprox,
  })

  const { data: simulateData, error: simulateError, isFetching: simFetching } =
    useSimulateContract({
      address: FORTUNE_COOKIE_ADDRESS,
      abi: fortuneCookieAbi,
      functionName: 'openCookie',
      value: priceWei ?? 0n,
      chainId: base.id,
      query: {
        enabled: canSimulate,
      },
    })

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries()
    }
  }, [isSuccess, queryClient])

  if (!isConnected) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-3 text-center text-sm text-zinc-500">
        Connect your wallet above to open a cookie.
      </p>
    )
  }

  if (!contractConfigured) {
    return (
      <p className="text-sm text-amber-800">
        Contract address is not set. Add{' '}
        <code className="rounded bg-amber-100 px-1 font-mono text-xs">NEXT_PUBLIC_FORTUNE_COOKIE_ADDRESS</code> to{' '}
        <code className="rounded bg-amber-100 px-1 font-mono text-xs">.env.local</code>.
      </p>
    )
  }

  if (chainId !== base.id) {
    return (
      <div className="flex flex-col items-stretch gap-2 sm:items-start">
        <p className="text-sm text-zinc-600">
          This app uses <span className="font-medium text-zinc-800">Base</span> (chain {base.id}). Switch
          network to continue.
        </p>
        <button
          type="button"
          onClick={() => switchChain({ chainId: base.id })}
          className="fc-btn-primary w-full sm:w-auto"
          disabled={isSwitching}
        >
          {isSwitching ? 'Switching…' : 'Switch to Base'}
        </button>
      </div>
    )
  }

  if (priceLoading || pausedLoading) {
    return (
      <p className="text-sm text-zinc-500" role="status">
        Loading contract state…
      </p>
    )
  }

  if (paused) {
    return (
      <p className="rounded-lg border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
        This fortune cookie contract is paused. Opens are temporarily disabled.
      </p>
    )
  }

  const priceLabel =
    priceWei !== undefined && priceWei > 0n
      ? `${formatEther(priceWei)} ETH`
      : 'free'

  const envUsdFallback = Number(process.env.NEXT_PUBLIC_ETH_USD_HINT)
  const resolvedUsdPerEth =
    liveUsdPerEth !== undefined && Number.isFinite(liveUsdPerEth) && liveUsdPerEth > 0
      ? liveUsdPerEth
      : Number.isFinite(envUsdFallback) && envUsdFallback > 0
        ? envUsdFallback
        : NaN
  const usdExtra =
    priceWei !== undefined &&
    priceWei > 0n &&
    Number.isFinite(resolvedUsdPerEth) &&
    resolvedUsdPerEth > 0
      ? usdApproxLabel(priceWei, resolvedUsdPerEth)
      : ''
  const usdSourceLabel =
    usdExtra && needUsdApprox
      ? usdLiveFailed && Number.isFinite(envUsdFallback)
        ? 'env fallback'
        : !usdLiveFailed && liveUsdPerEth !== undefined
          ? 'CoinGecko · ~1m'
          : null
      : null

  return (
    <div className="flex flex-col items-center gap-3 sm:items-start">
      <p className="text-center text-sm text-zinc-600 sm:text-left">
        Price: <span className="font-medium text-zinc-800">{priceLabel}</span>
        {usdExtra ? (
          <>
            {' '}
            <span className="text-zinc-500">({usdExtra})</span>
          </>
        ) : null}
      </p>
      {usdSourceLabel && (
        <p className="text-center text-xs text-zinc-400 sm:text-left">{usdSourceLabel}</p>
      )}
      <button
        type="button"
        onClick={() => {
          if (simulateData?.request) writeContract(simulateData.request)
        }}
        disabled={
          isPending ||
          isConfirming ||
          simFetching ||
          !simulateData?.request ||
          !canSimulate
        }
        className="fc-btn-primary min-h-[48px] min-w-[200px]"
      >
        {isPending
          ? 'Confirm in wallet…'
          : isConfirming
            ? 'Confirming…'
            : simFetching
              ? 'Preparing…'
              : 'Open fortune cookie'}
      </button>
      {simulateError && (
        <p className="max-w-full text-center text-sm text-red-600 sm:text-left" role="alert">
          {simulateError.message}
        </p>
      )}
      {isSuccess && (
        <p className="text-sm font-medium text-emerald-700" role="status">
          Confirmed on Base.
        </p>
      )}
      {error && <p className="max-w-full text-center text-sm text-red-600 sm:text-left">{error.message}</p>}
      {hash && (
        <a
          className="text-sm font-medium text-[#0052ff] underline decoration-blue-200 underline-offset-2 hover:decoration-[#0052ff]"
          href={`https://basescan.org/tx/${hash}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          View on Basescan →
        </a>
      )}
    </div>
  )
}
