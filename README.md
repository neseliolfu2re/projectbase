# Fortune Cookie (Base)

A small onchain “fortune cookie” dApp on [Base](https://base.org): connect a wallet, open a cookie (transaction), and read a rarity-weighted message. Includes onchain history (`getFortunes`) and an event feed (past logs + live `CookieOpened` events).

## Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, [wagmi](https://wagmi.sh/) + [viem](https://viem.sh/), TanStack Query, `@base-org/account`
- **Contracts:** Solidity, [Hardhat](https://hardhat.org/)

## CI

GitHub Actions runs `npm run lint` and `npm run build` on pushes and pull requests to `main` / `master`.

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

Create **`.env.local`** for the Next.js app:

```env
NEXT_PUBLIC_FORTUNE_COOKIE_ADDRESS=0x...
# Optional: canonical URL for social share + WalletConnect metadata
# NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
# Optional: production RPC (Alchemy, Infura, …); default is public Base RPC
# NEXT_PUBLIC_BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/...
# Optional: WalletConnect Project ID (enables QR / mobile wallets)
# NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
```

**Vercel (or similar):** add the same `NEXT_PUBLIC_*` variables in the project settings so production builds pick up the contract address and optional RPC / WalletConnect.

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run hh:compile` | Compile Solidity |
| `npm run hh:test` | Hardhat tests for `FortuneCookie` |
| `npm run hh:deploy:base` | Deploy `FortuneCookie` to Base mainnet |
| `npm run hh:deploy:baseSepolia` | Deploy to Base Sepolia (if configured) |
| `npm run hh:verify:base` | Verify deployed contract on [Basescan](https://basescan.org) (needs `BASESCAN_API_KEY` + `CONTRACT_ADDRESS`) |
| `npm run hh:verify:baseSepolia` | Same for Base Sepolia |

After deploy, copy the printed address into `NEXT_PUBLIC_FORTUNE_COOKIE_ADDRESS` in `.env.local` and restart `npm run dev`.

### Contract verification

1. Get an API key from [basescan.org/apis](https://basescan.org/apis) and set `BASESCAN_API_KEY` in `.env`.
2. Set `CONTRACT_ADDRESS` to the deployed address, then run `npm run hh:verify:base`.

PowerShell:

```powershell
$env:CONTRACT_ADDRESS="0xYourDeployedAddress"
npm run hh:verify:base
```

Constructor arguments must match `scripts/deploy.js` (currently `priceWei = 0`, `messageCount = 10`). If you change deploy params, update `scripts/verify.js` accordingly.

## Contract

- Source: `contracts/FortuneCookie.sol`
- Deploy script: `scripts/deploy.js`
- Owner can call `cancelPendingOwnership()` to abort a two-step ownership handover if the pending address was wrong.

## Security notes

- Do **not** push `.env` or `.env.local` (they are ignored).
- `DEPLOYER_PRIVATE_KEY` is only for deploying from your machine.
- The fortune text is resolved off-chain from `messageId` in `src/config/fortuneCookie.ts`; onchain you store ids and rarity.
- **Contract (onchain):** plain ETH transfers to the contract (no calldata / wrong selector) revert; `withdraw` rejects the zero address; `getFortunes` pages are capped (`MAX_FORTUNE_PAGE`) to limit heavy `eth_call` requests; admin price changes emit `PriceUpdated`. After changing `contracts/FortuneCookie.sol`, **redeploy** and update `NEXT_PUBLIC_FORTUNE_COOKIE_ADDRESS`.
- **App:** HTTP security headers are set in `next.config.ts`. The UI reads `priceWei` and `paused` from the chain and uses `useSimulateContract` before sending so the wallet matches current rules.

## Repo

Remote: [github.com/neseliolfu2re/projectbase](https://github.com/neseliolfu2re/projectbase)
