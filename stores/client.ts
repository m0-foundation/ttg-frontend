import { defineStore } from "pinia";
import { SPOG } from "@/lib/api";

const defaultRpc = import.meta.env.VITE_NETWORK_DEFAULT_RPC as string;

export const useSpogClientStore = defineStore("client", {
  state: () => ({
    client: {} as SPOG,
    rpc: useLocalStorage("m0.rpc", defaultRpc),
  }),

  actions: {
    setClient(newClient: SPOG) {
      this.client = newClient;
    },
    setRpc(newRpc: string) {
      this.rpc = newRpc;
    },
  },
});
