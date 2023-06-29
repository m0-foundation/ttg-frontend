import { defineStore } from "pinia";
import { EpochState, SpogImmutableValues, SpogMutableValues } from "@/lib/api";

export const useSpogStore = defineStore("spog", {
  state: () => ({
    epoch: {} as EpochState,
    contracts: {} as SpogImmutableValues,
    values: {} as SpogMutableValues,
  }),

  getters: {
    getEpoch: (state) => state.epoch,
  },

  actions: {
    setEpoch(epoch: EpochState) {
      this.epoch = epoch;
    },
    setContracts(params: SpogImmutableValues) {
      this.contracts = params;
    },
    setValues(params: SpogMutableValues) {
      this.values = params;
    },
  },
});
