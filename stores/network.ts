import { defineStore } from 'pinia'
import { NetworkConfig, getNetworkConfig } from '../network'

export const useNetworkStore = defineStore('network', () => {
  const config: NetworkConfig = getNetworkConfig()

  const network = ref({
    rpc: { ...config.rpc },
    contracts: { ...config.contracts },
  })

  const getNetwork = () => computed(() => network.value)
  const getTtgAddress = () => computed(() => network.value.contracts.registrar)
  const getMToken = () =>
    computed(() => network.value.contracts.zero?.allowedCashTokens?.[1])

  return { network, getNetwork, getTtgAddress, getMToken }
})
