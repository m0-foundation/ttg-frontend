import { sepolia } from '@wagmi/core/chains'
import { NetworkConfig } from './types'

const RPC_URL_MAIN = import.meta.env.VITE_APP_RPC_URL_MAIN
const RPC_URL_FALLBACK =
  import.meta.env.VITE_APP_RPC_URL_FALLBACK || sepolia.rpcUrls.default.http[0]

export default {
  network: 'sepolia',
  contracts: {
    registrar: '0x99Fb2fB21922465F1c2ab50Fd37f9780FFbF3d17',
    multicall3: sepolia.contracts.multicall3.address,
    deploymentBlock: 5584949,
    zero: {
      allowedCashTokens: [
        '0xE67ABDA0D43f7AC8f37876bBF00D1DFadbB93aaa', // WETH,
        '0x7Ab57b830e85A878F877486597Bcb28d52A825a8', // M token
      ],
    },
  },
  rpc: {
    chainId: 11155111,
    default: RPC_URL_MAIN,
    values: [RPC_URL_MAIN, RPC_URL_FALLBACK],
  },
} as NetworkConfig
