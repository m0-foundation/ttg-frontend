import { defineStore } from "pinia";
import { SPOG } from "@/lib/api";

export const useSpogClientStore = defineStore("client", () => {
  const network = useNetworkStore().getNetwork();

  const client = ref({} as SPOG);
  const rpc = useLocalStorage("m0.rpc", network.value.rpc.default);

  function setClient(newClient: SPOG) {
    client.value = newClient;
  }

  const getRpc = () => computed(() => rpc.value);

  function setRpc(newRpc: string) {
    rpc.value = newRpc;
  }

  return { client, rpc, setClient, setRpc, getRpc };
});
