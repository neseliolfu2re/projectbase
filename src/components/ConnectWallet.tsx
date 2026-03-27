'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function ConnectWallet() {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isReconnecting) {
    return (
      <p className="text-sm text-zinc-500" role="status">
        Reconnecting…
      </p>
    )
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            type="button"
            onClick={() => connect({ connector })}
            disabled={isConnecting}
            className="fc-btn-secondary min-w-[10rem] disabled:opacity-60"
          >
            {isConnecting ? 'Connecting…' : `Connect ${connector.name}`}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 font-mono text-sm text-zinc-800">
        {address?.slice(0, 6)}…{address?.slice(-4)}
      </span>
      <button type="button" onClick={() => disconnect()} className="fc-btn-secondary py-2 text-zinc-700">
        Disconnect
      </button>
    </div>
  )
}
