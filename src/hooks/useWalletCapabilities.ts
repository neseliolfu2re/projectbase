import { useCapabilities } from 'wagmi'
import { base } from 'wagmi/chains'
import { useMemo } from 'react'

export function useWalletCapabilities() {
  const { data: capabilities } = useCapabilities()

  const supportsBatching = useMemo(() => {
    const atomic = capabilities?.[base.id]?.atomic
    return atomic?.status === 'ready' || atomic?.status === 'supported'
  }, [capabilities])

  const supportsPaymaster = useMemo(() => {
    return capabilities?.[base.id]?.paymasterService?.supported === true
  }, [capabilities])

  return { supportsBatching, supportsPaymaster }
}
