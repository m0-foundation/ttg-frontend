<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="flex flex-col gap-4">
    <CommonCard>
      <article>
        <div class="flex lg:flex-row flex-col gap-16">
          <div class="w-full lg:w-2/3">
            <div class="markdown-body mb-8" v-html="onlyDescriptionHtml"></div>
            <ProposalTechnical
              :proposal="proposal"
              :current-proposal-values="currentProposalValuesFormatted" />
          </div>
          <div class="w-full lg:w-1/3">
            <div v-if="isLoading" class="h-4">Loading...</div>
            <div v-else>
              <ProposalVoteProgress
                v-if="proposal?.state !== 'Pending'"
                :yes-votes="proposal?.yesVotes"
                :no-votes="proposal?.noVotes"
                :version="proposal?.votingType"
                :threshold="proposal?.quorum"
                :threshold-bps="proposal?.quorumNumerator"
                :power-total-supply="totalSupplyAt[0]"
                :zero-total-supply="totalSupplyAt[1]"
                class="font-inter" />
            </div>
            <hr class="border-gray-200 my-6" />
            <div class="flex justify-between gap-3">
              <ProposalStatusTimeline
                :proposal="proposal"
                :version="proposal?.state"
                class="overflow-x-auto" />
            </div>
            <hr class="border-gray-200 my-6" />
            <div>
              <ProposalMenu :proposal="proposal" :asList="true" />
            </div>
          </div>
        </div>
      </article>
    </CommonCard>
    <CommonCard title="Voters">
      <div class="overflow-x-hidden overflow-y-auto">
        <ProposalTableVotes :votes="votes?.value" />
      </div>
    </CommonCard>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { Hash } from 'viem'
  import { readPowerToken, readZeroToken } from '@/lib/sdk'
  import { watchVoteCast } from '@/lib/watchers'

  export interface ProposalDetailsProps {
    proposalId: string
  }

  const props = defineProps<ProposalDetailsProps>()

  const proposalStore = useProposalsStore()

  const proposal = computed(() =>
    proposalStore.getProposalById(props.proposalId),
  )
  const proposalId = computed(() => props.proposalId)

  const { onlyDescriptionHtml, title } = useParsedDescriptionTitle(
    proposal?.value?.description!,
  )

  const ttg = useTtgStore()
  const wagmiConfig = useWagmiConfig()

  const { getValuesFormatted: currentProposalValuesFormatted } =
    storeToRefs(ttg)

  useHead({
    titleTemplate: `%s - Proposal #${proposalId.value}`,
  })

  const { toFormat } = useDate(proposal.value!.timestamp!)
  const proposalCreatedFormatedDate = computed(() => toFormat('LLL'))

  const votesStore = useVotesStore()
  const votes = computed(() => {
    if (proposalId.value) {
      return votesStore.getBy('proposalId', proposalId.value)
    }
  })

  const pastProposalEpoch = computed(() =>
    BigInt(proposal.value!.voteStart! - 1),
  )

  const { state: totalSupplyAt, isLoading } = useAsyncState(
    Promise.all([
      readPowerToken(wagmiConfig, {
        address: ttg!.contracts!.powerToken! as Hash,
        functionName: 'pastTotalSupply',
        args: [pastProposalEpoch.value],
      }),
      readZeroToken(wagmiConfig, {
        address: ttg!.contracts!.zeroToken! as Hash,
        functionName: 'pastTotalSupply',
        args: [pastProposalEpoch.value],
      }),
    ]),
    [0n, 0n],
  )

  /*
votesStore.fetchAllVotes request takes a lot of requests since for each vote event it needs to find the Block timestamp then is a RPC request for each vote
Improve this would need to find only events for that proposalI but the event signature does have proposalId as indexed.
Thus need to find all events. What could be done is to fetch only votes of proposal voting type: Standard, Emergency or Zero;
*/
  votesStore.fetchVotes(proposal.value!.votingType!)

  // update tally on mount
  proposalStore.updateProposalById(props.proposalId)

  const { unwatchAll } = watchVoteCast(proposal.value!.votingType!)

  onUnmounted(() => {
    unwatchAll()
  })
</script>
