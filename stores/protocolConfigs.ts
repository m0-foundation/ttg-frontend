import { defineStore } from "pinia";
import { MProtocolConfig } from "@/lib/api";

export const useProtocolConfigsStore = defineStore("protocol", {
  state: () => ({
    configs: {} as MProtocolConfig,
  }),

  getters: {
    getConfigsAsArray(state) {
      return Object.keys(state.configs).map((key) => {
        const event = state.configs[key];
        return {
          valueName: key,
          value: event.value,
          timestamp: event.timestamp,
        };
      });
    },
  },

  actions: {
    setProtocolConfigs(configs: MProtocolConfig) {
      this.configs = configs;
    },
  },
});
