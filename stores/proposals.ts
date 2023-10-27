import { defineStore } from "pinia";
import _ from "lodash";
import { MProposal, ProposalState } from "@/lib/api/types";

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
    getProposalsByState: (state) => (status: keyof typeof ProposalState) =>
      state.data.filter((p) => p.state === status),
    getProposalsByExcludedState: (state) => {
      return (pState: keyof typeof ProposalState) =>
        state.data.filter((p) => p.state !== pState);
    },

    getProposalsTypeEmergency: (state) => {
      return state.data.filter((p) => p.isEmergency);
    },

    getProposalsByProposer: (state) => {
      return (proposer: string) =>
        state.data.filter(
          (p) => p.proposer.toLowerCase() === proposer.toLowerCase()
        );
    },
  },

  actions: {
    setProposals(proposals: Array<MProposal>) {
      this.data = [];
      this.data = [
        ..._.orderBy(
          _.uniqBy([...this.data, ...proposals], "proposalId"),
          "blockNumber",
          "desc"
        ),
      ];
    },
    push(proposals: Array<MProposal>) {
      this.data = [
        ..._.orderBy(
          _.uniqBy([...this.data, ...proposals], "proposalId"),
          "blockNumber",
          "desc"
        ),
      ];
    },
  },
});
