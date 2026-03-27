import { type HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import 'dotenv/config'
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.23',
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    base: {
      url: process.env.BASE_MAINNET_RPC_URL ?? 'https://mainnet.base.org',
      chainId: 8453,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL ?? 'https://sepolia.base.org',
      chainId: 84532,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      base: process.env.BASESCAN_API_KEY ?? '',
      baseSepolia: process.env.BASESCAN_API_KEY ?? '',
    },
    customChains: [
      {
        network: 'base',
        chainId: 8453,
        urls: {
          apiURL: 'https://api.basescan.org/api',
          browserURL: 'https://basescan.org',
        },
      },
      {
        network: 'baseSepolia',
        chainId: 84532,
        urls: {
          apiURL: 'https://api-sepolia.basescan.org/api',
          browserURL: 'https://sepolia.basescan.org',
        },
      },
    ],
  },
}

export default config
