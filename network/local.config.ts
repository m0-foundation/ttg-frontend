import { NetworkConfig } from './types'

export default {
  network: 'hardhat',
  contracts: {
    registrar: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
    multicall3: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
    deploymentBlock: 0,
    zero: {
      allowedCashTokens: [
        '0x5FbDB2315678afecb367f032d93F642f64180aa3', // WETH,
        '0x057ef64E23666F000b34aE31332854aCBd1c8544', // M token
      ],
    },
  },
  rpc: {
    chainId: 31337,
    default: 'http://localhost:8545/',
    values: ['http://localhost:8545/'],
  },
} as NetworkConfig
