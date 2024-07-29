import { defineStore } from "pinia";
import orderBy from "lodash/orderBy";
import uniqBy from "lodash/uniqBy";

import { MProposal, ProposalState } from "@/lib/api/types";

export const useProposalsStore = defineStore("proposals", {
  state: () => ({
    data: [] as MProposal[],
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

    getProposalsTypeZero: (state) => {
      return state.data.filter((p) => p.votingType === "Zero");
    },

    getProposalsByProposer: (state) => {
      return (proposer: string) =>
        state.data.filter(
          (p) => p.proposer.toLowerCase() === proposer.toLowerCase(),
        );
    },
  },

  actions: {
    setProposals(proposals: Array<MProposal>) {
      this.data = [];
      this.data = [
        ...orderBy(
          uniqBy([...this.data, ...proposals], "proposalId"),
          "blockNumber",
          "desc",
        ),
      ];
    },
    push(proposals: Array<MProposal>) {
      this.data = [
        ...orderBy(
          uniqBy([...this.data, ...proposals], "proposalId"),
          "blockNumber",
          "desc",
        ),
      ];
    },

    update(proposal: MProposal) {
      const proposalIndex = this.data.findIndex(
        (p) => p.proposalId === proposal.proposalId,
      );
      if (proposalIndex !== -1) {
        this.data[proposalIndex] = proposal;
      }
    },

    updateProposalByKey(proposalId: string, key: keyof MProposal, value: any) {
      const proposalStore = this.data.find((p) => p.proposalId === proposalId);
      if (proposalStore) {
        const newProposal = { ...proposalStore, [key]: value } as MProposal;
        this.update(newProposal);
      }
    },

    async fetchAllProposals() {
      const api = useApiClientStore();

      const [standard, emergency, zero] = await Promise.all([
        api.client.standardGovernor!.proposals.getProposals(),
        api.client.emergencyGovernor!.proposals.getProposals(),
        api.client.zeroGovernor!.proposals.getProposals(),
      ]);
      const allProposals = [...standard, ...emergency, ...zero];
      this.setProposals(allProposals);
    },

    async updateProposalById(proposalId: string) {
      const api = useApiClientStore();
      const proposalStored = this.getProposalById(proposalId);
      const client = api.getApiByGovernor(proposalStored!.votingType!);

      const proposalMutable =
        await client!.proposals!.getProposalMutableDataById(proposalId);

      const newProposal = {
        ...proposalStored,
        ...proposalMutable,
      } as MProposal;
      console.log("newProposal", { newProposal });
      this.update(newProposal);
    },
  },
});
