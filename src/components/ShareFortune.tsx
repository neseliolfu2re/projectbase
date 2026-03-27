'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

type Props = {
  fortuneText: string
  rarityLabel: string
}

function buildShareText(fortuneText: string, rarityLabel: string, pageUrl: string) {
  const lines = [
    `"${fortuneText}"`,
    '',
    `— ${rarityLabel} · Fortune Cookie on Base`,
    pageUrl,
    '',
    '#Base #Onchain',
  ]
  return lines.join('\n')
}

function truncateForTwitter(text: string, max = 260) {
  if (text.length <= max) return text
  return `${text.slice(0, max - 1)}…`
}

export function ShareFortune({ fortuneText, rarityLabel }: Props) {
  const [pageUrl, setPageUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [shareError, setShareError] = useState<string | null>(null)

  useEffect(() => {
    void Promise.resolve().then(() => {
      const env = process.env.NEXT_PUBLIC_APP_URL?.trim()
      if (env) {
        setPageUrl(env.endsWith('/') ? env.slice(0, -1) : env)
        return
      }
      setPageUrl(typeof window !== 'undefined' ? window.location.href : '')
    })
  }, [])

  const fullText = useMemo(
    () => buildShareText(fortuneText, rarityLabel, pageUrl || 'https://www.base.org'),
    [fortuneText, rarityLabel, pageUrl]
  )

  const twitterUrl = useMemo(() => {
    const text = truncateForTwitter(fullText)
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
  }, [fullText])

  const canNativeShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  const handleNativeShare = useCallback(async () => {
    setShareError(null)
    try {
      await navigator.share({
        title: 'Fortune Cookie on Base',
        text: buildShareText(fortuneText, rarityLabel, pageUrl),
        url: pageUrl || undefined,
      })
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return
      setShareError(e instanceof Error ? e.message : 'Share failed')
    }
  }, [fortuneText, pageUrl, rarityLabel])

  const handleCopy = useCallback(async () => {
    setShareError(null)
    try {
      await navigator.clipboard.writeText(fullText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      setShareError(e instanceof Error ? e.message : 'Copy failed')
    }
  }, [fullText])

  return (
    <div className="mt-5 border-t border-zinc-200/80 pt-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-500">Share</p>
      <div className="flex flex-wrap gap-2">
        {canNativeShare && (
          <button type="button" className="fc-btn-primary py-2 text-sm" onClick={() => void handleNativeShare()}>
            Share…
          </button>
        )}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fc-btn-secondary inline-flex py-2 text-sm text-zinc-800 no-underline hover:no-underline"
        >
          Post on X
        </a>
        <button type="button" className="fc-btn-secondary py-2 text-sm" onClick={() => void handleCopy()}>
          {copied ? 'Copied!' : 'Copy text'}
        </button>
      </div>
      {shareError && <p className="mt-2 text-xs text-red-600">{shareError}</p>}
      <p className="mt-2 text-[11px] leading-relaxed text-zinc-400">
        Tip: on mobile, “Share…” opens your system sheet. On desktop, use Post on X or Copy text.
      </p>
    </div>
  )
}
