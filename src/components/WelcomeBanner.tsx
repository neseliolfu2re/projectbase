'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'fortune-cookie-welcome-dismissed-v1'

export function WelcomeBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let cancelled = false
    const id = requestAnimationFrame(() => {
      try {
        if (cancelled) return
        if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true)
      } catch {
        /* private mode / blocked storage */
      }
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(id)
    }
  }, [])

  if (!visible) return null

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* ignore */
    }
    setVisible(false)
  }

  return (
    <div
      className="fc-fade-in relative overflow-hidden rounded-2xl border border-[#0052ff]/20 bg-gradient-to-br from-blue-50/95 via-white to-indigo-50/90 p-5 shadow-[0_2px_12px_rgba(0,82,255,0.08)]"
      role="region"
      aria-label="Welcome"
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#0052ff]/10 blur-2xl" />
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-zinc-900">Welcome to Fortune Cookie</p>
          <p className="max-w-lg text-sm leading-relaxed text-zinc-600">
            Connect a wallet, switch to <span className="font-medium text-zinc-800">Base</span>, then open a
            cookie. Your fortunes and history live onchain — this app just reads them.
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="fc-btn-secondary shrink-0 self-stretch sm:self-center"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
