import { defineStore } from "pinia";
import _ from "lodash";
import { EpochState } from "@/lib/api";

export const useSpogStateStore = defineStore("spog", {
  state: () => ({
    epoch: {} as EpochState,
    // tax
    // cash address
    // inflator rate
  }),

  getters: {
    getEpoch: (state) => state.epoch,
  },

  actions: {
    setEpoch(epoch: EpochState) {
      this.epoch = epoch;
    },
  },
});
