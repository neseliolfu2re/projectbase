export function HowItWorks() {
  const steps = [
    {
      n: '1',
      title: 'Connect on Base',
      body: 'Use MetaMask, Phantom, Base Account, or WalletConnect. The app is built for Base mainnet.',
    },
    {
      n: '2',
      title: 'Open a cookie',
      body: 'Confirm the transaction in your wallet. You pay gas; if the contract sets a price, that amount is sent too.',
    },
    {
      n: '3',
      title: 'See rarity & history',
      body: 'Common, rare, or legendary — your last fortune, full history, and live events update from the chain.',
    },
  ] as const

  return (
    <details className="fc-card group open:shadow-md">
      <summary className="cursor-pointer list-none text-base font-semibold text-zinc-900 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-2">
          <span>How it works</span>
          <span
            className="text-zinc-400 transition group-open:rotate-180"
            aria-hidden
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
      </summary>
      <ol className="mt-5 space-y-4 border-t border-zinc-100 pt-5">
        {steps.map((s) => (
          <li key={s.n} className="flex gap-4">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0052ff]/10 text-sm font-bold text-[#0052ff]"
              aria-hidden
            >
              {s.n}
            </span>
            <div>
              <p className="font-medium text-zinc-900">{s.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </details>
  )
}
