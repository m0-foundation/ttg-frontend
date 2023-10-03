import { defineStore } from "pinia";
import { MEpoch } from "~/lib/api/modules/governor/modules/epoch/epoch.types";

interface SpogContracts {
  registrar?: string;
  governor?: string;
  zeroToken?: string;
  powerToken?: string;
  cashToken?: string;
  clock?: string;
}

interface SpogValues {
  minProposalFee?: string | BigInt | number;
  maxProposalFee?: string | BigInt | number;
  proposalFee?: string | BigInt | number;
  powerTokenQuorumRatio?: string | BigInt | number;
  zeroTokenQuorumRatio?: string | BigInt | number;
}

export const useSpogStore = defineStore("spog", {
  state: () => ({
    epoch: {} as MEpoch,
    contracts: {} as SpogContracts,
    values: {} as SpogValues,
  }),

  getters: {
    getEpoch: (state) => state.epoch,
  },

  actions: {
    setEpoch(epoch: MEpoch) {
      this.epoch = epoch;
    },
    setContracts(params: SpogContracts) {
      this.contracts = params;
    },
    setValues(params: SpogValues) {
      this.values = params;
    },
  },
});
