# Fortune Cookie (Base)

A small onchain “fortune cookie” dApp on [Base](https://base.org): connect a wallet, open a cookie (transaction), and read a rarity-weighted message. Includes onchain history (`getFortunes`) and an event feed (past logs + live `CookieOpened` events).

## Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, [wagmi](https://wagmi.sh/) + [viem](https://viem.sh/), TanStack Query, `@base-org/account`
- **Contracts:** Solidity, [Hardhat](https://hardhat.org/)

## Prerequisites

- Node.js 20+ (LTS recommended)
- A wallet with **Base mainnet ETH** for transactions (gas)
- Never commit private keys. `.env` / `.env.local` are gitignored.

## Setup

```bash
npm install
```

### Environment

Create **`.env`** in the project root (deploy / Hardhat):

```env
DEPLOYER_PRIVATE_KEY=0x...
BASE_MAINNET_RPC_URL=https://mainnet.base.org
```

Create **`.env.local`** for the Next.js app (public contract address only):

```env
NEXT_PUBLIC_FORTUNE_COOKIE_ADDRESS=0x...
# Optional: canonical URL for social share links (e.g. https://your-app.vercel.app)
# NEXT_PUBLIC_APP_URL=https://...
```

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run hh:compile` | Compile Solidity |
| `npm run hh:deploy:base` | Deploy `FortuneCookie` to Base mainnet |
| `npm run hh:deploy:baseSepolia` | Deploy to Base Sepolia (if configured) |

After deploy, copy the printed address into `NEXT_PUBLIC_FORTUNE_COOKIE_ADDRESS` in `.env.local` and restart `npm run dev`.

## Contract

- Source: `contracts/FortuneCookie.sol`
- Deploy script: `scripts/deploy.js`

## Security notes

- Do **not** push `.env` or `.env.local` (they are ignored).
- `DEPLOYER_PRIVATE_KEY` is only for deploying from your machine.
- The fortune text is resolved off-chain from `messageId` in `src/config/fortuneCookie.ts`; onchain you store ids and rarity.

## Repo

Remote: [github.com/neseliolfu2re/projectbase](https://github.com/neseliolfu2re/projectbase)
