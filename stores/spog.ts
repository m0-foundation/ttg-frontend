import { defineStore } from "pinia";
import { EpochState, SpogUnmutableValues, SpogMutableValues } from "@/lib/api";

export const useSpogStore = defineStore("spog", {
  state: () => ({
    epoch: {} as EpochState,
    contracts: {} as SpogUnmutableValues,
    values: {} as SpogMutableValues,
  }),

  getters: {
    getEpoch: (state) => state.epoch,
  },

  actions: {
    setEpoch(epoch: EpochState) {
      this.epoch = epoch;
    },
    setContracts(params: SpogUnmutableValues) {
      this.contracts = params;
    },
    setValues(params: SpogMutableValues) {
      this.values = params;
    },
  },
});
