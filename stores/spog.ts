import { defineStore } from "pinia";
import { formatEther } from "viem";
import { MGovernorContracts, MGovernorValues, MEpoch } from "@/lib/api/types";

export const useSpogStore = defineStore("spog", {
  state: () => ({
    epoch: {} as MEpoch,
    contracts: {} as Partial<MGovernorContracts>,
    values: {} as Partial<MGovernorValues>,
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
    setContracts(params: Partial<MGovernorContracts>) {
      this.contracts = params;
    },
    setValues(params: Partial<MGovernorValues>) {
      this.values = params;
    },
  },
});
