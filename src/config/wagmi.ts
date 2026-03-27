import { http, createConfig, createStorage, cookieStorage } from 'wagmi'
import { base } from 'wagmi/chains'
import { baseAccount, injected } from 'wagmi/connectors'

/** Phantom exposes Ethereum at `window.phantom.ethereum`, not always `window.ethereum`. */
function phantomTarget() {
  if (typeof window === 'undefined') return undefined
  const w = window as Window & { phantom?: { ethereum?: import('viem').EIP1193Provider } }
  const provider = w.phantom?.ethereum
  if (!provider) return undefined
  return {
    id: 'phantom',
    name: 'Phantom',
    provider,
  } as const
}

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected(),
    injected({ target: phantomTarget }),
    baseAccount({
      appName: 'Fortune Cookie',
    }),
  ],
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  transports: {
    [base.id]: http('https://mainnet.base.org'),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}
