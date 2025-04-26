import '@nomicfoundation/hardhat-toolbox-viem'
import '@nomicfoundation/hardhat-verify'
import 'dotenv/config'
import { HardhatUserConfig } from 'hardhat/config'

const DEPLOYER_KEY = process.env.DEPLOYER_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

if (!DEPLOYER_KEY) throw new Error('DEPLOYER_KEY must be set')
if (!ETHERSCAN_API_KEY) throw new Error('ETHERSCAN_API_KEY must be set')

const config: HardhatUserConfig = {
  networks: {
    localhost: {
      accounts: [DEPLOYER_KEY],
    },
    sepolia: {
      url:
        process.env.SEPOLIA_RPC_URL ??
        'https://ethereum-sepolia-rpc.publicnode.com',
      accounts: [DEPLOYER_KEY],
    },
    mainnet: {
      url: process.env.MAINNET_RPC_URL ?? 'https://ethereum-rpc.publicnode.com',
      accounts: [DEPLOYER_KEY],
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.8.28',
        settings: {
          optimizer: {
            enabled: true,
            runs: 100000,
          },
        },
      },
    ],
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  paths: {
    sources: './src',
  },
}

export default config
