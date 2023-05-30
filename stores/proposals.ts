import { defineStore } from "pinia";
import _ from "lodash";
import { MProposal, ProposalState } from "@/lib/api";

export const useProposalsStore = defineStore("proposals", {
  state: () => ({
    data: useLocalStorage("m0.proposals", [] as MProposal[]),
  }),

  getters: {
    getProposals: (state) => state.data,

    getProposalById: (state) => {
      return (pId: string) =>
        state.data.find((p) => p.proposalId.toString() === pId);
    },
    getProposalsByState: (state) => {
      return (pState: keyof typeof ProposalState) =>
        state.data.filter((p) => p.state === pState);
    },
    getProposalsByExcludedState: (state) => {
      return (pState: keyof typeof ProposalState) =>
        state.data.filter((p) => p.state !== pState);
    },
  },

  actions: {
    setProposals(proposals: Array<MProposal>) {
      this.data = _.orderBy(
        _.uniqBy([...this.data, ...proposals], "proposalId"),
        "blockNumber",
        "desc"
      );
    },
  },
});
