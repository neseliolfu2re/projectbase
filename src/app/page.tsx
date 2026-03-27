import { ConnectWallet } from '@/components/ConnectWallet'
import { LastFortune } from '@/components/LastFortune'
import { OpenCookie } from '@/components/OpenCookie'
import { FortuneHistory } from '@/components/FortuneHistory'
import { FortuneEventFeed } from '@/components/FortuneEventFeed'

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-14">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Fortune Cookie</h1>
          <p className="text-zinc-600">
            A tiny onchain fortune cookie on Base. Connect your wallet, open a cookie, and read your
            rarity.
          </p>
        </header>

        <section className="flex flex-col gap-4 rounded-2xl border bg-white p-5">
          <h2 className="text-lg font-semibold">Wallet</h2>
          <ConnectWallet />
        </section>

        <LastFortune />

        <FortuneHistory />

        <FortuneEventFeed />

        <section className="flex flex-col items-center gap-3">
          <OpenCookie />
          <p className="text-xs text-zinc-500">
            If the button is hidden, set <code className="rounded bg-zinc-100 px-1">NEXT_PUBLIC_FORTUNE_COOKIE_ADDRESS</code> in{' '}
            <code className="rounded bg-zinc-100 px-1">.env.local</code> after deploy.
          </p>
        </section>
      </div>
    </main>
  )
}
