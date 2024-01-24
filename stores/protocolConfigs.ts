import { defineStore } from "pinia";
import { MProtocolConfig } from "@/lib/api/types";

export const useProtocolConfigsStore = defineStore("protocol", {
  state: () => ({
    configs: [] as MProtocolConfig[],
  }),

  actions: {
    setProtocolConfigs(configs: MProtocolConfig[]) {
      this.configs = [...configs];
    },
  },
});
