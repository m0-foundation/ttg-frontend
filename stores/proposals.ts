import { defineStore } from "pinia";
import _ from "lodash";
import { MProposal } from "@/lib/sdk";

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
