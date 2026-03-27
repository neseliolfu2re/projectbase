export const FORTUNE_COOKIE_ADDRESS = (process.env
  .NEXT_PUBLIC_FORTUNE_COOKIE_ADDRESS ??
  '0x0000000000000000000000000000000000000000') as `0x${string}`

export const fortuneCookieAbi = [
  {
    type: 'function',
    name: 'openCookie',
    inputs: [],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'event',
    name: 'CookieOpened',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'rarity', type: 'uint8', indexed: false },
      { name: 'messageId', type: 'uint16', indexed: false },
      { name: 'openedAt', type: 'uint64', indexed: false },
      { name: 'totalOpened', type: 'uint64', indexed: false },
    ],
    anonymous: false,
  },
  {
    type: 'function',
    name: 'openedCount',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getLastFortune',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      { name: 'rarity', type: 'uint8' },
      { name: 'messageId', type: 'uint16' },
      { name: 'openedAt', type: 'uint64' },
      { name: 'totalOpened', type: 'uint64' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getFortunes',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'start', type: 'uint256' },
      { name: 'count', type: 'uint256' },
    ],
    outputs: [
      { name: 'rarity', type: 'uint8[]' },
      { name: 'messageId', type: 'uint16[]' },
      { name: 'openedAt', type: 'uint64[]' },
      { name: 'totalOpened', type: 'uint64' },
    ],
    stateMutability: 'view',
  },
] as const

export const fortuneMessages = [
  'WAGMI energy: may your onchain adventures feel smooth and fun.',
  'Green candles ahead. Your curiosity is the best strategy.',
  'May your wallet stay safe and your transactions be kind (and fast).',
  'Fortune on Base: something delightful is landing in your next block.',
  'DeFi vibes: yields are cool, and learning is even cooler.',
  'Onchain heart: keep building, keep experimenting, keep smiling.',
  'Gas-friendly moments: your next move should cost you less hassle.',
  "Say 'GM' and let the mempool do its magic (in a good way).",
  'Self-custody love: you are holding your future in your hands.',
  'Next trade or swap, or just next idea: it will be a sweet one.',
] as const
