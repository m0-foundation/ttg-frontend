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
              <div
                v-if="proposal?.state === 'Succeeded'"
                class="flex w-full bg-[#CDF7E4] font-inter flex-col gap-3 text-slate-900 mb-6 border-slate-200 border">
                <div class="flex flex-row gap-6 py-4 px-4 font-semibold">
                  Proposal has succeeded and is ready to be executed.
                  <img
                    src="/img/common/succeeded.svg"
                    class="w-[56px] lg:block hidden" />
                </div>

                <div class="w-full bg-white py-4 px-4" role="group">
                  <MButton
                    id="button-proposal-execute"
                    data-test="proposal-button-execute"
                    class="w-full flex items-center justify-center"
                    :disabled="isDisconnected || isLoadingTx"
                    @click="onExecuteProposal()">
                    Execute
                  </MButton>
                </div>
              </div>

              <div
                v-if="proposal?.state !== 'Pending'"
                class="mb-6 p-4 bg-slate-50">
                <ProposalVoteProgress
                  :yes-votes="proposal?.yesVotes"
                  :no-votes="proposal?.noVotes"
                  :version="proposal?.votingType"
                  :threshold="proposal?.quorum"
                  :threshold-bps="proposal?.quorumNumerator"
                  :power-total-supply="totalSupplyAt[0]"
                  :zero-total-supply="totalSupplyAt[1]"
                  class="font-inter" />
              </div>
            </div>

            <div class="mb-6 p-4 bg-slate-50 flex justify-between gap-3">
              <ProposalStatusTimeline
                :proposal="proposal"
                :version="proposal?.state"
                class="overflow-x-auto" />
            </div>

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
  import { useAccount } from 'use-wagmi'
  import { readPowerToken, readZeroToken } from '@/lib/sdk'
  import { watchVoteCast } from '@/lib/watchers'

  import { keccak256, toHex, Hash, Abi } from 'viem'
  import { waitForTransactionReceipt, writeContract } from '@wagmi/core'

  const { address: userAccount, isConnected, isDisconnected } = useAccount()
  const { forceSwitchChain } = useCorrectChain()
  const alerts = useAlertsStore()

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

  const isLoadingTx = ref(false)
  const selectedProposal = ref<string | undefined>(undefined)

  async function onExecuteProposal() {
    await forceSwitchChain()

    const p = proposal.value
    if (!p) return

    const governor = useGovernor({ proposalId: p.proposalId })

    const { description, calldatas } = p
    const hashedDescription = keccak256(toHex(description))
    const targets = [governor?.address as Hash]
    const values = [BigInt(0)] // do not change

    selectedProposal.value = p.proposalId
    isLoadingTx.value = true
    try {
      const hash = await writeContract(wagmiConfig, {
        abi: governor!.abi as Abi,
        address: governor!.address as Hash,
        functionName: 'execute',
        args: [targets, values, calldatas as Hash[], hashedDescription], // (targets, values, calldatas, hashedDescription
        account: userAccount.value,
        value: BigInt(0),
      })

      const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
        confirmations: 1,
        hash,
      })

      if (txReceipt.status !== 'success') {
        throw txReceipt
      }

      alerts.successAlert('Proposal executed successfully!')

      proposalStore.updateProposalById(p.proposalId)
    } catch (error: any) {
      console.error('Error executing proposal', error)
      if (error.transactionHash) {
        alerts.errorAlert(
          `Error while executing proposal! <br/> See <a class="underline" target="_blank" href=${useBlockExplorer('tx', error.transactionHash)}>transaction</a>.`,
        )
      } else {
        alerts.errorAlert(`Transaction not sent! ${error.shortMessage}`)
      }
    } finally {
      isLoadingTx.value = false
      selectedProposal.value = undefined
    }
  }
</script>
