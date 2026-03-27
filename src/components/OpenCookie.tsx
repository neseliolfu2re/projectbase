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
      // Refresh all contract reads (last fortune + history) after successful write.
      queryClient.invalidateQueries()
    }
  }, [isSuccess, queryClient])

  if (!isConnected) return null
  if (FORTUNE_COOKIE_ADDRESS === '0x0000000000000000000000000000000000000000') return null

  if (chainId !== base.id) {
    return (
      <button
        onClick={() => switchChain({ chainId: base.id })}
        className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-60"
        disabled={isSwitching}
      >
        {isSwitching ? 'Switching...' : 'Switch to Base'}
      </button>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
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
        className="rounded-xl bg-black px-5 py-2.5 text-white disabled:opacity-60"
      >
        {isPending ? 'Confirm in Wallet...' : isConfirming ? 'Confirming...' : 'Open Fortune Cookie'}
      </button>
      {isSuccess && <p className="text-sm text-zinc-600">Confirmed!</p>}
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      {hash && (
        <a
          className="text-sm underline"
          href={`https://basescan.org/tx/${hash}`}
          target="_blank"
          rel="noreferrer"
        >
          View on Basescan
        </a>
      )}
    </div>
  )
}
