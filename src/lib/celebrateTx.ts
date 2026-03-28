import confetti from 'canvas-confetti'

/** One-shot confetti for a confirmed open; skips when user prefers reduced motion. */
export function celebrateOpenCookieTx(): void {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const colors = ['#0052ff', '#60a5fa', '#a5b4fc', '#fde68a', '#34d399', '#ffffff']

  void confetti({
    particleCount: 88,
    spread: 74,
    origin: { y: 0.72 },
    colors,
    ticks: 220,
    scalar: 0.92,
    gravity: 1.05,
  })

  window.setTimeout(() => {
    void confetti({
      particleCount: 48,
      angle: 118,
      spread: 58,
      origin: { x: 0.92, y: 0.76 },
      colors: ['#0052ff', '#93c5fd', '#fde68a'],
      ticks: 160,
      scalar: 0.85,
    })
  }, 220)
}
