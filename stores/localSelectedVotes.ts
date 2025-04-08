import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import keyBy from 'lodash/keyBy'

type SelectedVote = {
  vote: number
  proposalId: string
  reason?: string
}

/**
 *
 * Stores the information of the proposals that the user has selected their vote on
 * but not submitted to the blockchain yet
 */
export const useLocalSelectedVotes = defineStore('selectedVotes', {
  state: () => ({
    // Data-structure consideration for Array:
    // The number of selected votes is not expected to be in the thousands nor hundreds.
    selected: useLocalStorage(
      '__ttg_selected_votes__',
      [] as Array<SelectedVote>,
    ),
  }),

  getters: {
    length: (state) => state.selected.length,

    get:
      (state) =>
      (proposalId: SelectedVote['proposalId']): SelectedVote | undefined =>
        state.selected.find((v) => v.proposalId === proposalId),

    byKey: (state) => keyBy(state.selected, 'proposalId'),
  },

  actions: {
    has(proposalId: SelectedVote['proposalId']) {
      return Object.hasOwn(this.byKey, proposalId)
    },

    cast({ vote, proposalId }: SelectedVote) {
      if (this.has(proposalId)) {
        this.update({
          vote,
          proposalId,
        })
      } else {
        this.selected.push({ vote, proposalId })
      }
    },

    remove(proposalId: SelectedVote['proposalId']) {
      this.selected = this.selected.filter((v) => v.proposalId !== proposalId)
    },

    removeMany(proposalIds: Array<string>) {
      this.selected = this.selected.filter(
        (cast) => !proposalIds.includes(cast.proposalId),
      )
    },

    update(newCast: Partial<SelectedVote>) {
      this.selected = this.selected.map((cast) => {
        if (cast.proposalId === newCast.proposalId) {
          return { ...cast, ...newCast }
        }

        return cast
      })
    },
  },
})
