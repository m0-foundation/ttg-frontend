import { defineStore } from "pinia";
import { SPOG } from "@/lib/api";

export const useSpogClientStore = defineStore("client", () => {
  const client = ref({} as SPOG);
  const config = useRuntimeConfig();
  const rpc = useLocalStorage("m0.rpc", config.public.rpc.default);

  function setClient(newClient: SPOG) {
    client.value = newClient;
  }

  function setRpc(newRpc: string) {
    rpc.value = newRpc;
  }

  return { client, rpc, setClient, setRpc };
});
