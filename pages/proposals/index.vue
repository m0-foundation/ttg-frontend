<template>
  <div class="flex lg:flex-row flex-col items-start gap-4">
    <div
      v-if="
        !hasVotedOnAllProposals &&
        isConnected &&
        hasProposals &&
        hasPowerVotingPower
      "
      class="lg:hidden flex w-full py-4 px-4 bg-[#E0ECF5] font-inter flex-col gap-3 text-[#00315B]">
      <div>
        <h3 class="lg:text-xl text-base font-medium">
          Voting is in progress...
        </h3>
        <div class="lg:text-base text-sm text-slate-500 mt-4">
          By voting on all standard proposals, you will
          <strong>preserve your voting power</strong>
          and
          <span v-if="Number(powerInflation) != 0">
            increase your balance by
            <strong>{{ useNumberFormatterPrice(powerInflation) }} POWER</strong>
            in the next epoch as inflation.
          </span>
          <span v-if="Number(zeroInflation) != 0">
            <strong>
              receive {{ useNumberFormatterPrice(zeroInflation) }} ZERO
            </strong>
            as rewards.
          </span>
        </div>
        <a
          class="text-xs text-slate-500 underline hover:no-underline mt-3 lg:block hidden"
          href="https://docs.m0.org/home/fundamentals/whitepaper/governance/"
          target="_blank">
          Learn more
        </a>
      </div>
    </div>
    <div class="w-full">
      <ProposalList
        :proposals="standardProposals"
        :loading="isLoading"
        @on-cast="onCast"
        @on-uncast="onUncast"
        @update-reason-for-vote="updateReasonForVote">
        <template #emptyState>
          <ProposalListEmptyState>
            No active standard proposals
          </ProposalListEmptyState>
        </template>
      </ProposalList>
    </div>
    <div
      v-if="
        !hasVotedOnAllProposals &&
        isConnected &&
        hasProposals &&
        hasPowerVotingPower
      "
      class="lg:w-2/5 w-full py-4 px-6 lg:py-9 lg:px-9 bg-[#E0ECF5] font-inter flex flex-col gap-3 text-[#00315B] sticky lg:top-[86px] bottom-0">
      <div>
        <img
          src="/img/common/banner-m.svg"
          class="w-[56px] -mt-4 mb-4 lg:block hidden" />
        <div>
          <h3
            class="lg:text-xl text-base font-medium lg:block hidden font-inter">
            Voting is in progress...
          </h3>
          <div class="lg:text-sm text-sm text-slate-500 mt-2 lg:block hidden">
            By voting on all standard proposals, you will
            <strong>preserve your voting power</strong>
            and
            <span v-if="Number(powerInflation) != 0">
              increase your balance by
              <strong>
                {{ useNumberFormatterPrice(powerInflation) }} POWER
              </strong>
              in the next epoch as inflation.
            </span>
            <span v-if="Number(zeroInflation) != 0">
              <strong>
                receive {{ useNumberFormatterPrice(zeroInflation) }} ZERO
              </strong>
              as rewards.
            </span>
          </div>
          <a
            class="text-xs text-slate-500 underline hover:no-underline mt-1 lg:block hidden"
            href="https://docs.m0.org/home/fundamentals/whitepaper/governance/"
            target="_blank">
            Learn more
          </a>

          <div
            class="text-xs w-full flex flex-col items-stretch gap-2 lg:pt-6 pt-0 lg:mb-0">
            <div class="flex gap-8 w-full items-center">
              <div class="w-full flex flex-col gap-1">
                <span class="text-slate-500">Votes selected:</span>
                <div class="w-full bg-white h-1">
                  <div
                    class="bg-accent-blue h-1"
                    :style="`width: ${hasVotedOnAllProposals ? 100 : progressBarWidth}%`"></div>
                </div>
              </div>
              <span class="whitespace-nowrap font-ppformula text-lg">
                {{ standardProposalsVotes.length }} /
                {{ mandatoryToVoteProposals.length }}
              </span>
            </div>
          </div>
        </div>

        <div
          class="mt-6"
          :class="{
            '!bg-slate-200': isSelectedCastProposalsFull,
          }">
          <MButton
            :disabled="
              !isSelectedCastProposalsFull ||
              hasVotedOnAllProposals ||
              isLoading
            "
            id="button-cast-submit"
            class="w-full flex justify-center"
            :is-loading="isLoading"
            :class="{ '!bg-grey-200 cursor-not-allowed': isLoading }"
            data-test="proposal-button-submit-votes"
            color="primary"
            size="lg"
            @click="onCastBatchVotes">
            Submit
          </MButton>
        </div>
      </div>
    </div>
    <div
      v-if="!isConnected && hasProposals"
      class="lg:w-1/3 w-full py-4 px-6 lg:py-9 lg:px-9 bg-[#E0ECF5] font-inter flex flex-col gap-3 text-[#00315B] sticky lg:top-[86px] bottom-0">
      <div>
        <img
          src="/img/common/banner-m.svg"
          class="w-[64px] -mt-4 mb-4 lg:block hidden" />
        <div>
          <h3 class="lg:text-xl text-base font-medium lg:block hidden">
            Voting is in progress...
          </h3>
          <div class="lg:text-sm text-sm text-slate-500 mt-4 lg:block hidden">
            Voting is currently in progress under M0 onchain governance system,
            the Two Token Governor (TTG). This mechanism uses two utility
            tokens—POWER and ZERO—to ensure active, accountable participation
            and credible neutrality in governance.
          </div>
          <a
            class="text-xs text-slate-500 underline hover:no-underline mt-3 lg:block hidden"
            href="https://docs.m0.org/home/fundamentals/whitepaper/governance/"
            target="_blank">
            Learn more
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Hash } from 'viem'
  import keyBy from 'lodash/keyBy'
  import { useAccount, useReadContract } from 'use-wagmi'
  import { waitForTransactionReceipt } from '@wagmi/core'
  import { standardGovernorAbi, writeStandardGovernor } from '@/lib/sdk'
  import {
    useMBalances,
    useMInflationPowerToken,
    useMInflationZeroToken,
    useMVotingPower,
  } from '@/lib/hooks'

  const isLoading = ref(false)

  const proposalsStore = useProposalsStore()
  const selectedVotesStore = useLocalSelectedVotes()
  const ttg = useTtgStore()

  const activeProposals = computed(() =>
    proposalsStore.getProposalsByState('Active'),
  )

  const standardProposals = computed(() =>
    activeProposals.value.filter((p) => p.votingType === 'Standard'),
  )

  const standardProposalsByKeys = computed(() =>
    keyBy(standardProposals.value, 'proposalId'),
  )

  const standardProposalsVotes = computed(() =>
    selectedVotesStore.selected.filter(
      (vote) => standardProposalsByKeys.value[vote.proposalId] != undefined,
    ),
  )

  const mandatoryToVoteProposals = computed(() =>
    activeProposals.value.filter((p) => p.votingType === 'Standard'),
  )

  const hasProposals = computed(
    () => mandatoryToVoteProposals && mandatoryToVoteProposals.value.length > 0,
  )

  const isSelectedCastProposalsFull = computed(() => {
    return mandatoryToVoteProposals.value.every((item) =>
      selectedVotesStore.has(item.proposalId),
    )
  })

  const progressBarWidth = computed(() => {
    return (
      (standardProposalsVotes.value.length /
        mandatoryToVoteProposals.value.length) *
      100
    )
  })

  const { address: userAccount, isConnected } = useAccount()
  const { forceSwitchChain } = useCorrectChain()
  const wagmiConfig = useWagmiConfig()
  const alerts = useAlertsStore()

  const powerInflation = useMInflationPowerToken()
  const zeroInflation = useMInflationZeroToken()
  const balances = useMBalances(userAccount)

  const { power: powerVotingPower } = useMVotingPower(userAccount)
  const hasPowerVotingPower = computed(
    () => powerVotingPower.data.value?.hasVotingPower,
  )
  const isDelegatee = computed(
    () =>
      powerVotingPower.data?.value?.value! >
      balances.powerToken.data?.value?.value!,
  )

  useHead({
    titleTemplate: '%s - Proposals',
  })

  function onCast(vote: number, proposalId: string) {
    selectedVotesStore.cast({ proposalId, vote })
  }

  function updateReasonForVote(value: string, proposalId: string) {
    selectedVotesStore.update({ proposalId, reason: value })
  }

  function onUncast(proposalId: string) {
    selectedVotesStore.remove(proposalId)
  }

  const { data: hasVotedOnAllProposals, ...votedOnAllProposals } =
    useReadContract({
      address: ttg.contracts.standardGovernor as Hash,
      abi: standardGovernorAbi,
      functionName: 'hasVotedOnAllProposals',
      args: [
        userAccount as Ref<Hash>,
        BigInt(ttg.epoch?.current?.asNumber || 0),
      ],
      query: {
        enabled: isConnected,
      },
    })
  // batch is only for standard proposals
  async function onCastBatchVotes() {
    await forceSwitchChain()

    isLoading.value = true
    // slight chance after confirmation the voting power is updated before the check is done,
    // thus making a copy of value before the transaction
    const isDelegateeStored = isDelegatee.value

    try {
      let hash
      const { reasons, proposalIds, votes } =
        standardProposalsVotes.value.reduce(
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

      const isOnlyOneVote = standardProposalsVotes.value.length === 1
      const anyProposalHasReason = standardProposalsVotes.value.some(
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

      alerts.successAlert(
        `Your Balance has received the reward of ${useNumberFormatterPrice(
          toValue(zeroInflation),
        )} ZERO tokens.`,
      )

      if (isDelegateeStored) {
        alerts.successAlert(
          'Vote casted successfully! Your POWER voting power has increased.',
        )
      } else {
        alerts.successAlert(
          `Vote casted successfully! Your will receive ${useNumberFormatterPrice(
            toValue(powerInflation),
          )} POWER tokens in the next epoch.`,
        )
      }

      selectedVotesStore.removeMany(proposalIds.map(String))
      await ttg.fetchTokens()
      balances.refetch()
      votedOnAllProposals.refetch()
    } catch (error: any) {
      console.log('Error casting vote', { error })
      if (error.transactionHash) {
        alerts.errorAlert(
          `Error when casting vote! <br/> See <a class="underline" target="_blank" href=${useBlockExplorer('tx', error.transactionHash)}>transaction</a>.`,
        )
      } else {
        alerts.errorAlert(`Transaction not sent! ${error.shortMessage}`)
      }
    }

    isLoading.value = false
  }

  const castSingleVoteWithReason = (
    proposalId: bigint,
    vote: number,
    reason: string,
  ) => {
    return writeStandardGovernor(wagmiConfig, {
      address: ttg.contracts.standardGovernor as Hash,
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
    return writeStandardGovernor(wagmiConfig, {
      address: ttg.contracts.standardGovernor as Hash,
      functionName: 'castVotesWithReason',
      args: [proposalIds, votes, reasons], // uint256[] proposalId, uint8[] support, string[] reason
      account: userAccount.value,
    })
  }

  const castSingleVote = (proposalId: bigint, vote: number) => {
    return writeStandardGovernor(wagmiConfig, {
      address: ttg.contracts.standardGovernor as Hash,
      functionName: 'castVote',
      args: [proposalId, vote], // uint256 proposalId, uint8 support, string reason
      account: userAccount.value,
    })
  }

  const castVotes = (proposalIds: bigint[], votes: number[]) => {
    return writeStandardGovernor(wagmiConfig, {
      address: ttg.contracts.standardGovernor as Hash,
      functionName: 'castVotes',
      args: [proposalIds, votes], // uint256[] proposalId, uint8[] support
      account: userAccount.value,
    })
  }
</script>
