import { defineStore } from "pinia";
import { NetworkConfig, getNetworkConfig } from "@/network";

export const useNetworkStore = defineStore("network", () => {
  const networkConfig: NetworkConfig = getNetworkConfig();

  const network = useLocalStorage("m0.network", {
    rpc: { ...networkConfig.rpc },
    contracts: { ...networkConfig.contracts },
  });

  function setNetwork(newNetwork: NetworkConfig) {
    network.value = newNetwork;
  }

  const getNetwork = () => computed(() => network.value);
  const getSpogAddress = () =>
    computed(() => network.value.contracts.registrar);

  return { network, setNetwork, getNetwork, getSpogAddress };
});
