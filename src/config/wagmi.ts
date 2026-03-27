import { http, createConfig, createStorage, cookieStorage } from 'wagmi'
import { base } from 'wagmi/chains'
import { baseAccount, injected, walletConnect } from 'wagmi/connectors'

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

const wcProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

const baseRpcUrl =
  process.env.NEXT_PUBLIC_BASE_RPC_URL ?? 'https://mainnet.base.org'

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected(),
    injected({ target: phantomTarget }),
    ...(wcProjectId
      ? [
          walletConnect({
            projectId: wcProjectId,
            metadata: {
              name: 'Fortune Cookie',
              description: 'Open a fortune on Base',
              url:
                process.env.NEXT_PUBLIC_APP_URL ??
                (typeof window !== 'undefined'
                  ? window.location.origin
                  : 'https://base.org'),
              icons: [],
            },
          }),
        ]
      : []),
    baseAccount({
      appName: 'Fortune Cookie',
    }),
  ],
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  transports: {
    [base.id]: http(baseRpcUrl),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}
