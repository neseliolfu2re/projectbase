import { ConnectWallet } from '@/components/ConnectWallet'
import { LastFortune } from '@/components/LastFortune'
import { OpenCookie } from '@/components/OpenCookie'
import { FortuneHistory } from '@/components/FortuneHistory'
import { FortuneEventFeed } from '@/components/FortuneEventFeed'
import { WelcomeBanner } from '@/components/WelcomeBanner'
import { HowItWorks } from '@/components/HowItWorks'
import { SiteFooter } from '@/components/SiteFooter'

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
        <header className="flex flex-col gap-4 text-center sm:text-left">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-3">
            <span className="inline-flex items-center rounded-full border border-blue-200/80 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0052ff]">
              Base
            </span>
            <span className="hidden text-zinc-300 sm:inline">·</span>
            <span className="text-sm text-zinc-500">Onchain fortune cookies</span>
          </div>
          <div className="space-y-2">
            <h1 className="flex flex-wrap items-center justify-center gap-2 text-3xl font-bold tracking-tight text-zinc-900 sm:justify-start sm:text-4xl">
              <span aria-hidden className="select-none text-4xl sm:text-5xl">
                🥠
              </span>
              Fortune Cookie
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
              Connect your wallet, crack open a cookie, and see your rarity. History and events stay
              on Base.
            </p>
          </div>
        </header>

        <WelcomeBanner />

        <HowItWorks />

        <section className="fc-card space-y-4">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">Wallet</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Pick a connector, then use <span className="font-medium text-zinc-700">Base mainnet</span> for
              opens.
            </p>
          </div>
          <ConnectWallet />
        </section>

        <section className="fc-card space-y-4">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">Open a cookie</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Transactions run on Base — you pay gas (and the onchain price if the contract sets one).
            </p>
          </div>
          <OpenCookie />
        </section>

        <LastFortune />

        <FortuneHistory />

        <FortuneEventFeed />

        <section className="rounded-xl border border-dashed border-zinc-200 bg-white/40 px-4 py-3 text-center text-xs text-zinc-500 sm:text-left">
          <span className="font-medium text-zinc-600">Deploy tip:</span> set{' '}
          <code className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] text-zinc-800">
            NEXT_PUBLIC_FORTUNE_COOKIE_ADDRESS
          </code>{' '}
          in your{' '}
          <code className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] text-zinc-800">
            .env.local
          </code>{' '}
          after deploying the contract.
        </section>

        <SiteFooter />
      </div>
    </main>
  )
}
