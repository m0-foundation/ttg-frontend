import { defineStore } from "pinia";
import { NetworkConfig, getNetworkConfig } from "../network";

export const useNetworkStore = defineStore("network", () => {
  const config: NetworkConfig = getNetworkConfig();
  console.log({ config });

  const network = ref({
    rpc: { ...config.rpc },
    contracts: { ...config.contracts },
  });


  const getNetwork = () => computed(() => network.value);
  const getSpogAddress = () =>
    computed(() => network.value.contracts.registrar);

  return { network, getNetwork, getSpogAddress };
});
