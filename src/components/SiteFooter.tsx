import { FORTUNE_COOKIE_ADDRESS } from '@/config/fortuneCookie'

const ZERO = '0x0000000000000000000000000000000000000000' as const

const githubDefault = 'https://github.com/neseliolfu2re/projectbase'

function linkClass() {
  return 'font-medium text-[#0052ff] underline decoration-blue-200 underline-offset-2 hover:decoration-[#0052ff]'
}

export function SiteFooter() {
  const hasContract = FORTUNE_COOKIE_ADDRESS !== ZERO
  const basescanUrl = `https://basescan.org/address/${FORTUNE_COOKIE_ADDRESS}`
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_REPO_URL ?? githubDefault

  return (
    <footer className="mt-6 border-t border-zinc-200/80 pt-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Grow & explore</p>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-600">
        <span className="font-medium text-zinc-700">Built on Base.</span>{' '}
        Ship fast, low fees, Ethereum-aligned security — see{' '}
        <a
          href="https://base.org"
          target="_blank"
          rel="noreferrer noopener"
          className={linkClass()}
        >
          base.org
        </a>{' '}
        and the{' '}
        <a
          href="https://docs.base.org"
          target="_blank"
          rel="noreferrer noopener"
          className={linkClass()}
        >
          Base docs
        </a>
        .
      </p>
      <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm sm:justify-start">
        <li>
          <a
            href="https://www.base.org/build"
            target="_blank"
            rel="noreferrer noopener"
            className={linkClass()}
          >
            Build on Base
          </a>
        </li>
        <li>
          <a href={githubUrl} target="_blank" rel="noreferrer noopener" className={linkClass()}>
            Source on GitHub
          </a>
        </li>
        {hasContract ? (
          <li>
            <a href={basescanUrl} target="_blank" rel="noreferrer noopener" className={linkClass()}>
              Contract on Basescan
            </a>
          </li>
        ) : null}
      </ul>
      <p className="mt-4 text-xs text-zinc-400">
        Share your fortune from the share button after an open — great for casts and timelines.
      </p>
    </footer>
  )
}
