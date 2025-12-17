<template>
  <div>
    <ProposalList
      :proposals="emergencyProposals"
      :loading="isLoading"
      @on-cast="onCast"
      @on-uncast="onUncast"
      @update-reason-for-vote="updateReasonForVote">
      <template #emptyState>
        <ProposalListEmptyState>
          No active emergency proposals
        </ProposalListEmptyState>
      </template>
    </ProposalList>

    <div
      v-show="hasProposals && isConnected"
      class="lg:flex justify-end items-center gap-4 mt-6 py-4 px-8"
      :class="{
        'bg-grey-200': isSelectedCastProposalsFull,
      }">
      <span v-if="!isSelectedCastProposalsFull" class="text-xxs">
        Select YES or NO to submit your vote
      </span>
      <UButton
        id="button-cast-submit"
        class="w-full lg:w-40 flex justify-center"
        :disabled="
          !isSelectedCastProposalsFull || hasVotedOnAllProposals || isLoading
        "
        :is-loading="isLoading"
        data-test="proposal-button-submit-votes"
        color="primary"
        size="lg"
        @click="onCastBatchVotes">
        Submit
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Hash } from 'viem'
  import keyBy from 'lodash/keyBy'
  import { useAccount, useReadContracts } from 'use-wagmi'
  import { waitForTransactionReceipt } from '@wagmi/core'
  import { writeEmergencyGovernor, emergencyGovernorAbi } from '@/lib/sdk'

  const isLoading = ref(false)

  const proposalsStore = useProposalsStore()
  const selectedVotesStore = useLocalSelectedVotes()
  const ttg = useTtgStore()

  // keep a raw version to use as source on watchEffect
  const rawEmergencyProposals = computed(() =>
    proposalsStore
      .getProposalsByState('Active')
      .filter((p) => p.votingType === 'Emergency'),
  )

  const emergencyProposals = computed(() =>
    rawEmergencyProposals.value.map((p) => ({
      ...p,
      hasVoted: proposalsVotedStatus.value[p.proposalId] || false,
    })),
  )

  const proposalsToVoteOn = computed(() =>
    emergencyProposals.value.filter((p) => !p.hasVoted),
  )

  const emergencyProposalsByKeys = computed(() =>
    keyBy(proposalsToVoteOn.value, 'proposalId'),
  )

  const emergencyProposalsVotes = computed(() =>
    selectedVotesStore.selected.filter(
      (vote) => emergencyProposalsByKeys.value[vote.proposalId] != undefined,
    ),
  )

  const hasProposals = computed(() => emergencyProposals.value?.length > 0)

  const isSelectedCastProposalsFull = computed(() => {
    if (proposalsToVoteOn.value.length === 0) return false
    return proposalsToVoteOn.value.every((item) =>
      selectedVotesStore.has(item.proposalId),
    )
  })

  const hasVotedOnAllProposals = computed(() => {
    return (
      emergencyProposals.value.length > 0 &&
      proposalsToVoteOn.value.length === 0
    )
  })

  const { address: userAccount, isConnected } = useAccount()
  const { forceSwitchChain } = useCorrectChain()
  const wagmiConfig = useWagmiConfig()
  const alerts = useAlertsStore()

  useHead({
    titleTemplate: '%s - Priority proposals',
  })

  function onCast(vote: number, proposalId: string) {
    selectedVotesStore.cast({ proposalId, vote })
  }

  function onUncast(proposalId: string) {
    selectedVotesStore.remove(proposalId)
  }

  function updateReasonForVote(value: string, proposalId: string) {
    selectedVotesStore.update({ proposalId, reason: value })
  }

  const votedStatusContracts = computed(() => {
    if (!isConnected.value || !userAccount.value) return []
    return rawEmergencyProposals.value.map((p) => {
      return {
        address: ttg.contracts.emergencyGovernor as `0x${string}`,
        abi: emergencyGovernorAbi,
        functionName: 'hasVoted',
        args: [BigInt(p.proposalId), userAccount.value],
      }
    })
  })

  const { data: votedStatusResults } = useReadContracts({
    contracts: votedStatusContracts,
    query: {
      enabled: computed(() => votedStatusContracts.value.length > 0),
    },
  })

  const proposalsVotedStatus = computed<Record<string, boolean>>(() => {
    if (!votedStatusResults.value) return {}

    const proposalStatus: Record<string, boolean> = {}
    votedStatusResults.value.forEach((r, index) => {
      const proposalId = rawEmergencyProposals.value[index].proposalId
      proposalStatus[proposalId] = r.result as boolean
    })
    return proposalStatus
  })

  async function onCastBatchVotes() {
    await forceSwitchChain()

    isLoading.value = true

    try {
      let hash
      const { reasons, proposalIds, votes } =
        emergencyProposalsVotes.value.reduce(
          (result, vote) => {
            result.reasons.push(vote.reason || '')
            result.proposalIds.push(BigInt(vote.proposalId))
            result.votes.push(vote.vote)
            return result
          },
          {
            reasons: [] as string[],
            proposalIds: [] as bigint[],
            votes: [] as number[],
          },
        )

      const isOnlyOneVote = emergencyProposalsVotes.value.length === 1
      const anyProposalHasReason = emergencyProposalsVotes.value.some(
        (p) => p.reason,
      )

      if (anyProposalHasReason && isOnlyOneVote) {
        hash = await castSingleVoteWithReason(
          proposalIds[0],
          votes[0],
          reasons[0],
        )
      } else if (anyProposalHasReason) {
        hash = await castVotesWithReason(proposalIds, votes, reasons)
      } else if (isOnlyOneVote) {
        hash = await castSingleVote(proposalIds[0], votes[0])
      } else {
        hash = await castVotes(proposalIds, votes)
      }

      const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
        confirmations: 1,
        hash,
      })

      if (txReceipt.status !== 'success') {
        throw txReceipt
      }

      alerts.successAlert('Vote casted successfully!')
      selectedVotesStore.removeMany(proposalIds.map(String))

      await ttg.fetchTokens()
    } catch (error: any) {
      if (error.transactionHash) {
        alerts.errorAlert(
          `Error when casting vote! <br/> See <a class="underline" target="_blank" href=${useBlockExplorer('tx', error.transactionHash)}>transaction</a>.`,
        )
      } else {
        alerts.errorAlert(`Transaction not sent! ${error.shortMessage}`)
      }
    } finally {
      isLoading.value = false
    }
  }

  const castSingleVoteWithReason = (
    proposalId: bigint,
    vote: number,
    reason: string,
  ) => {
    return writeEmergencyGovernor(wagmiConfig, {
      address: ttg.contracts.emergencyGovernor as Hash,
      functionName: 'castVoteWithReason',
      args: [proposalId, vote, reason], // uint256 proposalId, uint8 support, string reason
      account: userAccount.value,
    })
  }

  const castVotesWithReason = (
    proposalIds: bigint[],
    votes: number[],
    reasons: string[],
  ) => {
    return writeEmergencyGovernor(wagmiConfig, {
      address: ttg.contracts.emergencyGovernor as Hash,
      functionName: 'castVotesWithReason',
      args: [proposalIds, votes, reasons], // uint256[] proposalId, uint8[] support, string[] reason
      account: userAccount.value,
    })
  }

  const castSingleVote = (proposalId: bigint, vote: number) => {
    return writeEmergencyGovernor(wagmiConfig, {
      address: ttg.contracts.emergencyGovernor as Hash,
      functionName: 'castVote',
      args: [proposalId, vote], // uint256 proposalId, uint8 support, string reason
      account: userAccount.value,
    })
  }

  const castVotes = (proposalIds: bigint[], votes: number[]) => {
    return writeEmergencyGovernor(wagmiConfig, {
      address: ttg.contracts.emergencyGovernor as Hash,
      functionName: 'castVotes',
      args: [proposalIds, votes], // uint256[] proposalId, uint8[] support
      account: userAccount.value,
    })
  }
</script>
