import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

type SelectedVote = {
  vote: number;
  proposalId: string;
  reason?: string;
};

/**
 *
 * Stores the information of the proposals that the user has selected their vote on
 * but not submitted to the blockchain yet
 */
export const useLocalSelectedVotes = defineStore("selectedVotes", {
  state: () => ({
    // Data-structure consideration for Array:
    // The number of selected votes is not expected to be in the thousands nor hundreds.
    selected: useLocalStorage(
      "__ttg_selected_votes__",
      [] as Array<SelectedVote>,
    ),
  }),

  getters: {
    length: (state) => state.selected.length,

    /**
     * Returns the vote of the selected proposal
     *
     * @param proposalId - The proposal id
     * @returns The vote of the selected proposal
     * @returns `null` if the proposal is not selected
     * @returns `true` if the proposal is selected with a vote of `1`
     * @returns `false` if the proposal is selected with a vote of `0`
     */
    get:
      (state) =>
      (proposalId: SelectedVote["proposalId"]): boolean | null => {
        const selected = state.selected.find(
          (v) => v.proposalId === proposalId,
        );

        return selected ? (selected.vote === 0 ? false : true) : null;
      },
  },

  actions: {
    add({ vote, proposalId }: SelectedVote) {
      this.selected.push({ vote, proposalId });
    },

    remove(proposalId: SelectedVote["proposalId"]) {
      this.selected = this.selected.filter((v) => v.proposalId !== proposalId);
    },

    update(newSelect: Partial<SelectedVote>) {
      this.selected = this.selected.map((select) => {
        if (select.proposalId === newSelect.proposalId) {
          return { ...select, ...newSelect };
        }

        return select;
      });
    },

    clean() {
      this.selected = [];
    },
  },
});
