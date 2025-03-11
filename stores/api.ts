import { defineStore } from 'pinia'
import { Hash, erc20Abi, formatUnits } from 'viem'
import { Api } from '@/lib/api'

export const useApiClientStore = defineStore('api', () => {
  const network = useNetworkStore().getNetwork()

  const client = ref({} as Api)
  const rpc = useLocalStorage('mzero.rpc', network.value.rpc.default)

  function setClient(newClient: Api) {
    client.value = newClient
  }

  const getRpc = () => computed(() => rpc.value)

  function setRpc(newRpc: string) {
    rpc.value = newRpc
  }

  function getApiByGovernor(governor: string) {
    if (governor === 'Standard') {
      return client.value.standardGovernor
    }
    if (governor === 'Emergency') {
      return client.value.emergencyGovernor
    }
    if (governor === 'Zero') {
      return client.value.zeroGovernor
    }
  }

  async function getToken(address: Hash) {
    const contractConfig = { address, abi: erc20Abi }

    const [decimals, name, symbol, totalSupply] =
      await client.value.context.client.multicall({
        multicallAddress: client.value.context.config.multicall3,
        contracts: [
          { ...contractConfig, functionName: 'decimals' },
          { ...contractConfig, functionName: 'name' },
          { ...contractConfig, functionName: 'symbol' },
          { ...contractConfig, functionName: 'totalSupply' },
        ],
      })

    return {
      address,
      decimals: decimals.result,
      name: name.result,
      symbol: symbol.result,
      totalSupply: {
        formatted: formatUnits(totalSupply.result!, decimals.result!),
        value: totalSupply.result,
      },
    }
  }

  return { client, rpc, setClient, setRpc, getRpc, getApiByGovernor, getToken }
})
