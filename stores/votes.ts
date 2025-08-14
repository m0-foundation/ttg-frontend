import uniqBy from 'lodash/uniqBy'
import { MVote } from '@/lib/api/types'
import { defineStore } from 'pinia'
import { Hash } from 'viem'
import { acceptHMRUpdate } from 'pinia'

export const useVotesStore = defineStore('votes', () => {
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

  type VoteCastLike = {
    proposalId?: string | number | bigint
    reason?: string | null
    support?: boolean | number | null
    voter?: string | null
    weight?: bigint | string | number | null
    transactionHash?: string | null
    blockNumber?: number | string | bigint | null
  }

  function formatVotes(
    items: ReadonlyArray<VoteCastLike> = [],
    type: 'Standard' | 'Emergency' | 'Zero',
  ): MVote[] {
    const token = ['Standard', 'Emergency'].includes(type) ? 'power' : 'zero'

    return items.map((data) => {
      const vote = {
        proposalId: data?.proposalId?.toString(),
        reason: data?.reason ?? undefined,
        support: Boolean(data?.support ?? false),
        voter: data?.voter?.toString(),
        weight: data?.weight as unknown as bigint | undefined,
        transactionHash: data?.transactionHash?.toString(),
        blockNumber: data?.blockNumber != null ? Number(data.blockNumber) : 0,
        eventName: 'VoteCast',
        data: '',
        token: token,
      } as unknown as MVote

      vote.voteId = `${vote.proposalId}_${vote.voter}`

      return vote
    })
  }

  async function fetchVotesStandard() {
    const data = await GqlStandardGovernorVoteCasts()
    const formattedVotes = formatVotes(data?.voteCasts, 'Standard')
    add(formattedVotes)
  }

  async function fetchVotesEmergency() {
    const data = await GqlEmergencyGovernorVoteCasts()
    const formattedVotes = formatVotes(
      data?.emergencyGovernorVoteCasts,
      'Emergency',
    )
    add(formattedVotes)
  }

  async function fetchVotesZero() {
    const data = await GqlZeroGovernorVoteCasts()
    const formattedVotes = formatVotes(data?.zeroGovernorVoteCasts, 'Zero')
    add(formattedVotes)
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
    formatVotes,
  }
})

// HOT RELOAD OF STORE
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useVotesStore, import.meta.hot))
}
