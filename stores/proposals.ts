import { defineStore } from "pinia";
import { MProposal } from "@/lib/sdk";

export const useProposalsStore = defineStore("proposals", {
  state: () => ({
    data: [] as MProposal[],
  }),

  getters: {
    getProposals: (state) => state.data,
  },

  actions: {
    setProposals(proposals: MProposal[]) {
      this.data = proposals;
    },
    getProposalById(pId: string) {
      return this.data.find((p) => p.proposalId.toString() === pId);
    },
  },
});
