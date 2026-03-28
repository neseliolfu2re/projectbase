'use client'

import { useEffect } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

/**
 * Signals the Farcaster / Base App host to hide the splash screen once the UI is ready.
 * No-op outside a mini-app WebView (SDK handles it).
 */
export function MiniAppReady() {
  useEffect(() => {
    void (async () => {
      try {
        await sdk.actions.ready()
      } catch {
        /* not running inside a mini-app host */
      }
    })()
  }, [])

  return null
}
