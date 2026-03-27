'use client'

import { useEffect } from 'react'
import {
  useAccount,
  useChainId,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import { base } from 'wagmi/chains'
import { FORTUNE_COOKIE_ADDRESS, fortuneCookieAbi } from '@/config/fortuneCookie'

export function OpenCookie() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const { data: hash, isPending, writeContract, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })
  const queryClient = useQueryClient()

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

  if (FORTUNE_COOKIE_ADDRESS === '0x0000000000000000000000000000000000000000') {
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
        <p className="text-sm text-zinc-600">Switch to Base to open a cookie.</p>
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

  return (
    <div className="flex flex-col items-center gap-3 sm:items-start">
      <button
        type="button"
        onClick={() =>
          writeContract({
            address: FORTUNE_COOKIE_ADDRESS,
            abi: fortuneCookieAbi,
            functionName: 'openCookie',
            chainId: base.id,
            value: BigInt(0),
          })
        }
        disabled={isPending || isConfirming}
        className="fc-btn-primary min-h-[48px] min-w-[200px]"
      >
        {isPending ? 'Confirm in wallet…' : isConfirming ? 'Confirming…' : 'Open fortune cookie'}
      </button>
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
          rel="noreferrer"
        >
          View on Basescan →
        </a>
      )}
    </div>
  )
}
