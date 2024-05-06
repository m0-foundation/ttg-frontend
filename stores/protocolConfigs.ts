import { defineStore } from "pinia";
import { MProtocolConfig } from "@/lib/api/types";

export const useProtocolConfigsStore = defineStore("protocol", {
  state: () => ({
    configs: [] as MProtocolConfig[],
  }),

  getters: {
    getProtocolGuidances(): MProtocolConfig[] {
      return this.configs.filter((config) => config.key.includes("guidance"));
    },
    getProtocolConfigsWithoutGuidances(): MProtocolConfig[] {
      return this.configs.filter((config) => !config.key.includes("guidance"));
    },
  },

  actions: {
    setProtocolConfigs(configs: MProtocolConfig[]) {
      this.configs = [...configs];
    },
  },
});
