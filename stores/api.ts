import { defineStore } from "pinia";
import { Api } from "@/lib/api";

export const useApiClientStore = defineStore("api", () => {
  const network = useNetworkStore().getNetwork();

  const client = ref({} as Api);
  const rpc = useLocalStorage("mzero.rpc", network.value.rpc.default);

  function setClient(newClient: Api) {
    client.value = newClient;
  }

  const getRpc = () => computed(() => rpc.value);

  function setRpc(newRpc: string) {
    rpc.value = newRpc;
  }

  return { client, rpc, setClient, setRpc, getRpc };
});
