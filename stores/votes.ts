import uniqBy from 'lodash/uniqBy'
import { MVote } from '@/lib/api/types'
import { defineStore } from 'pinia'
import { Hash } from 'viem'

export const useVotesStore = defineStore('votes', () => {
  const api = useApiClientStore()

  const votes = ref<Array<MVote>>([])

  function getBy(key: keyof MVote, value: string) {
    return computed(() => votes.value.filter((v) => v[key] === value))
  }

  function getByAddress(address: Hash) {
    return computed(() =>
      votes.value.filter(
        (v) => v.voter?.toLowerCase() === address.toLowerCase(),
      ),
    )
  }

  function add(newVotes: MVote[]) {
    votes.value = [...uniqBy([...votes.value, ...newVotes], 'voteId')]
  }

  async function fetchVotesStandard() {
    const votes = await api.client.standardGovernor!.voting!.getAllVotes()
    add(votes)
  }

  async function fetchVotesEmergency() {
    const votes = await api.client.emergencyGovernor!.voting!.getAllVotes()
    add(votes)
  }

  async function fetchVotesZero() {
    const votes = await api.client.zeroGovernor!.voting!.getAllVotes()
    add(votes)
  }

  async function fetchAllVotes() {
    await Promise.all([
      fetchVotesStandard(),
      fetchVotesEmergency(),
      fetchVotesZero(),
    ])
  }

  async function fetchVotes(votingType: 'Standard' | 'Emergency' | 'Zero') {
    return votingType === 'Standard'
      ? await fetchVotesStandard()
      : votingType === 'Emergency'
        ? await fetchVotesEmergency()
        : await fetchVotesZero()
  }

  return {
    votes,
    fetchAllVotes,
    fetchVotesStandard,
    fetchVotesEmergency,
    fetchVotesZero,
    fetchVotes,
    getBy,
    getByAddress,
    add,
  }
})
