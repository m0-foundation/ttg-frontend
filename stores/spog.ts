import { defineStore } from "pinia";
import { formatEther } from "viem";
import { MEpoch } from "~/lib/api/modules/governor/modules/epoch/epoch.types";

interface SpogContracts {
  registrar?: string;
  governor?: string;
  zeroToken?: string;
  powerToken?: string;
  cashToken?: string;
}

interface SpogValues {
  minProposalFee?: string;
  maxProposalFee?: string;
  proposalFee?: string;
  powerTokenQuorumRatio?: string;
  zeroTokenQuorumRatio?: string;
  clock?: number;
  votingDelay?: number;
  votingPeriod?: number;
}

export const useSpogStore = defineStore("spog", {
  state: () => ({
    epoch: {} as MEpoch,
    contracts: {} as SpogContracts,
    values: {} as SpogValues,
  }),

  getters: {
    getEpoch: (state) => state.epoch,

    valuesForProposal: (state) => {
      const values = {
        changeTax: formatEther(BigInt(state.values?.proposalFee || 0n)),
        changeTaxRange: [
          formatEther(BigInt(state.values?.minProposalFee || 0n)),
          formatEther(BigInt(state.values?.maxProposalFee || 0n)),
        ],

        updateVoteQuorumNumerator: state.values?.powerTokenQuorumRatio,
        updateValueQuorumNumerator: state.values?.zeroTokenQuorumRatio,
      };

      return values;
    },
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
