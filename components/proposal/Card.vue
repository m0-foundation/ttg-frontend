<template>
  <article
    data-test="proposal-card"
    class="mb-4 bg-transparent"
    :class="{ 'border border-red-500': isProposalWithError }">
    <NuxtLink :to="`/proposal/${proposal.proposalId}`" class="block">
      <CommonCard
        :data-test="hasVoted ? 'voted' : 'not-voted'"
        class="dark:text-white dark:bg-grey-800 hover:bg-[#F8FCFF] transition-all ease-in-out shadow-none group border-b-0">
        <div
          v-if="isProposalWithError"
          class="flex items-center gap-2 mb-2 bg-red-500 p-2 leading-tight">
          <span class="-mb-1">CAUTION: Suspicious or wrong proposal</span>
          <VTooltip placement="right">
            <img src="/img/icon-info.svg" class="w-6 h-6" alt="" />
            <template #popper>
              <div class="max-w-80 text-sm">
                This proposal has been labeled as suspicious or wrong by the M0
                Foundation. We recommend to vote
                <b>NO</b>
                .
              </div>
            </template>
          </VTooltip>
        </div>

        <div class="mb-1 text-xl flex justify-between">
          <h3 class="font-medium font-inter break-words">
            {{ title }}
          </h3>
          <svg
            class="h-6 hidden group-hover:block text-slate-900"
            width="24"
            height="24"
            viewBox="0 0 18 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="17" height="14"></rect>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M 14.767 3.938 L 14.767 3.108 L 13.936 3.108 L 8.767 3.108 L 8.767 4.108 L 12.935 4.108 L 8.767 8.274 L 9.602 9.108 L 13.767 4.939 L 13.767 9.108 L 14.767 9.108 L 14.767 3.938 Z"
              fill="currentColor"></path>
          </svg>
        </div>

        <div class="text-slate-500 text-sm font-inter mb-4 break-words">
          Proposed by
          <MAddressAvatar :address="proposal?.proposer" />
        </div>

        <div class="text-grey-1000 max-lg:text-sm font-inter break-words">
          {{
            expanded
              ? truncate(onlyDescription, { length: 1300 })
              : truncate(onlyDescription, { length: 500 })
          }}
        </div>

        <span
          v-if="onlyDescription?.length > 500 && !expanded"
          @click.stop.prevent="expanded = true"
          class="text-slate-500 cursor-pointer underline hover:no-underline text-xs z-50">
          Read more
        </span>
        <span
          v-if="onlyDescription?.length > 1000 && expanded"
          class="text-slate-500 cursor-pointer underline hover:no-underline text-xs z-50">
          Open details
        </span>
      </CommonCard>
    </NuxtLink>
    <CommonCard class="!py-0">
      <div class="flex flex-col xl:flex-row justify-between items-start">
        <div>
          <div
            v-if="proposal?.proposalLabel === 'Add to list'"
            class="flex xl:flex-row flex-col items-start xl:items-center text-sm">
            <div
              class="inline-flex font-inter px-2 py-1 border-none bg-[#EAF2FF]">
              Add {{ incomingValues[0] }}
            </div>
            <div class="text-slate-500 py-2 xl:px-2">
              {{ incomingValues[1] }}
            </div>
          </div>
          <div
            v-else
            class="flex flex-col xl:flex-row justify-between items-start xl:items-center">
            <div
              class="bg-[#87ECBF] text-sm inline-flex font-inter px-2 py-1 border-none whitespace-nowrap">
              {{ proposal?.proposalLabel }}
            </div>
            <div
              id="technical-proposal-incoming-change"
              class="text-sm py-2 xl:px-2">
              <div v-if="showParsed">
                <div
                  v-for="(param, index) in incomingValuesParsed"
                  :key="param">
                  <span v-if="param.includes('0x')">{{ param }}</span>
                  <span v-else>{{ param }} ({{ incomingValues[index] }})</span>
                </div>
              </div>

              <div v-else>
                <div v-if="incomingValues">
                  <span>
                    <span class="block text-slate-500">
                      This proposal sets
                      <strong>
                        {{ truncate(incomingValues[0], { length: 50 }) }}
                        {{
                          incomingValues[1]
                            ? ` to
                      ${incomingValues[1]}
                      `
                            : ''
                        }}
                      </strong>
                      as raw on-chain value.
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col xl:items-end items-start">
          <div
            v-if="proposal?.state === 'Active'"
            class="flex max-sm:flex-col justify-between lg:items-center gap-3">
            <div class="w-full xl:pt-0 pt-3">
              <div
                class="inline-flex gap-1 items-center w-full lg:mb-0"
                role="group">
                <ProposalButtonCastVote
                  id="button-cast-yes"
                  :batch="proposal?.votingType !== 'Zero'"
                  data-test="button-cast-yes"
                  :disabled="hasVoted || isDisconnected || !canVote || loading"
                  :version="isVoteYesActive"
                  :is-loading="loading && selectedVote"
                  class="cast-vote-button"
                  @click="onCast(true)">
                  YES
                </ProposalButtonCastVote>
                <ProposalButtonCastVote
                  id="button-cast-no"
                  :batch="proposal?.votingType !== 'Zero'"
                  class="cast-vote-button"
                  data-test="button-cast-no"
                  :disabled="hasVoted || isDisconnected || !canVote || loading"
                  :version="isVoteNoActive"
                  :is-loading="loading && !selectedVote"
                  @click="onCast(false)">
                  NO
                </ProposalButtonCastVote>
              </div>
            </div>
          </div>

          <div
            v-if="proposal?.state === 'Active'"
            class="text-xs text-grey-600 font-inter pt-2">
            <p v-show="!canVote">Not enough voting power</p>
            <p v-show="hasVoted">Your vote has been submitted</p>
          </div>

          <div v-if="!hasVoted && selectedVote !== null">
            <div class="mt-4 text-grey-600 font-inter">
              <label
                class="flex xl:flex-row flex-row-reverse items-center gap-2 text-xs leading-3 mb-0 rounded-none">
                Share a reason
                <input
                  v-model="reasonForVoteCheckbox"
                  type="checkbox"
                  class="w-3 h-3 accent-alert-success"
                  data-test="reason-vote-checkbox" />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <UTextarea
          v-if="!hasVoted && selectedVote !== null && reasonForVoteCheckbox"
          ref="reasonForVoteTextarea"
          :value="localStoredVote?.reason || ''"
          class="reason-textarea mt-2 rounded-none"
          data-test="reason-vote-textarea"
          placeholder="Feel free to explain your reasoning or what guided your decision…"
          @input="
            emit(
              'update-reason-for-vote',
              $event.target.value,
              props.proposal.proposalId,
            )
          "></UTextarea>
      </div>

      <div
        v-if="proposal?.state === 'Succeeded'"
        class="flex justify-between items-center">
        <div class="inline-flex gap-1" role="group">
          <MButton
            id="button-proposal-execute"
            data-test="proposal-button-execute"
            :disabled="isDisconnected || loading"
            :is-loading="loading"
            @click="onExecuteProposal()">
            Execute
          </MButton>
        </div>
      </div>
    </CommonCard>
  </article>
</template>

<script setup lang="ts">
  import truncate from 'lodash/truncate'
  import { useAccount, useReadContract, useBlockNumber } from 'use-wagmi'
  import { Hash, Abi } from 'viem'
  import { useMVotingPower } from '@/lib/hooks'
  import { MProposal } from '@/lib/api/types'
  import errorProposals from '@/assets/data/error-proposals.json'

  export interface ProposalCardProps {
    proposal: MProposal
    loading: boolean
  }

  const props = defineProps<ProposalCardProps>()
  const emit = defineEmits<{
    (e: 'on-cast', vote: number, proposaId: string): void
    (e: 'on-uncast', proposaId: string): void
    (e: 'on-execute', proposal: MProposal): void
    (e: 'update-reason-for-vote', value: string, proposalId: string): void
  }>()

  const apiStore = useApiClientStore()
  const localSelectedVotes = useLocalSelectedVotes()
  const { address: userAccount, isConnected, isDisconnected } = useAccount()

  const localStoredVote = computed(() =>
    localSelectedVotes.get(props.proposal.proposalId),
  )

  const selectedVote = computed(() =>
    localStoredVote.value != null
      ? localStoredVote.value.vote === 0
        ? false
        : true
      : null,
  )

  const reasonForVoteCheckbox = ref<boolean | undefined>(
    Boolean(localStoredVote.value?.reason),
  )
  const reasonForVoteTextarea = ref()

  watch(reasonForVoteCheckbox, async (value) => {
    if (value) {
      // Focus the textarea when enabled
      await nextTick()
      reasonForVoteTextarea.value?.focus?.()
    } else {
      // Clean reason when disabled
      emit('update-reason-for-vote', '', props.proposal.proposalId)
    }
  })

  const isProposalWithError = computed(() => {
    return errorProposals?.some((id) => id === props.proposal.proposalId)
  })

  const isVoteYesActive = computed(() => {
    // vote has been casted to Yes
    if (voteEvent && voteEvent.value?.support === true) return 'active'

    return selectedVote.value === true ? 'active' : 'default'
  })

  const isVoteNoActive = computed(() => {
    if (voteEvent && voteEvent.value?.support === false) return 'active'

    return selectedVote.value === false ? 'active' : 'default'
  })

  const voteEndTimestamp = ref()

  const { onlyDescription, title } = useParsedDescriptionTitle(
    props.proposal.description,
  )

  function onExecuteProposal() {
    emit('on-execute', props.proposal)
  }

  function onCast(vote: boolean) {
    if (['Standard', 'Emergency'].includes(props.proposal?.votingType!)) {
      return onBatchCastSelected(vote)
    } else {
      return onSingleCastSelected(vote)
    }
  }

  function onBatchCastSelected(vote: boolean) {
    // no vote has been select then click on any button
    if (selectedVote.value === null) {
      emit('on-cast', Number(vote), props.proposal.proposalId)
    }
    // vote has been select on the same button
    else if (selectedVote.value === vote) {
      emit('on-uncast', props.proposal.proposalId)
    }
    // vote has been select on the other button
    else if (selectedVote.value !== vote) {
      emit('on-uncast', props.proposal.proposalId)
      emit('on-cast', Number(vote), props.proposal.proposalId)
    }
  }

  function onSingleCastSelected(vote: boolean) {
    emit('on-cast', Number(vote), props.proposal.proposalId)
  }

  const proposalId = computed(() => props.proposal.proposalId)
  const governor = computed(() => useGovernor({ proposalId: proposalId.value }))

  const { power: powerVotingPower } = useMVotingPower(userAccount)

  const canVote = computed(() => {
    if (['Standard'].includes(props.proposal.votingType!)) {
      return powerVotingPower?.data.value?.hasVotingPower
    }

    return true
  })

  voteEndTimestamp.value = apiStore.client.epoch.getTimestampOfEpochStart(
    props.proposal.voteEnd,
  )

  const votesStore = useVotesStore()
  const voteEvent = computed(() => {
    return votesStore
      .getBy('proposalId', proposalId.value)
      .value.find((v) => v.voter === userAccount.value)
  })

  const { data: blockNumber } = useBlockNumber({ watch: true })
  const { data: hasVoted, refetch } = useReadContract({
    address: governor?.value?.address as Hash,
    abi: governor?.value?.abi as Abi,
    functionName: 'hasVoted',
    args: [BigInt(proposalId.value), userAccount as Ref<Hash>],
    query: {
      enabled: isConnected,
    },
  })

  watch(blockNumber, () => {
    refetch()
  })

  const { data: protocolKeysAndValues } = await useAsyncData(
    'protocolKeysAndValues',
    () =>
      apiStore.client.registrar!.protocolConfigs.getAllProtocolKeysAndValues(),
  )

  const parsedIncomingValue = (value: string, type: string) => {
    const formatFee = (value: string) => useFormatCash(value)

    if (['setProposalFee', 'setStandardProposalFee'].includes(type)) {
      return formatFee(value)
    }

    if (
      [
        'setEmergencyProposalThresholdRatio',
        'setZeroProposalThresholdRatio',
      ].includes(type)
    ) {
      return `${basisPointsToPercentage(value)}%`
    }

    if (['setCashToken'].includes(type)) {
      if (typeof value === 'bigint') return formatFee(value)
      if (typeof value === 'string')
        return value.includes('0x') ? value : formatFee(value)
    }

    return value
  }

  const current = computed(() => {
    if (!protocolKeysAndValues.value || !incomingValues.value?.[0]) return null
    return protocolKeysAndValues.value.find((item: { key: string }) =>
      incomingValues.value?.[0].includes(item.key),
    )
  })

  const incomingValues = computed(() => props.proposal?.proposalParams)

  const incomingValuesParsed = computed(() =>
    props.proposal?.proposalParams.map((param) =>
      parsedIncomingValue(param, props.proposal?.proposalType),
    ),
  )

  const expanded = ref(false)
</script>

<style>
  .cast-vote-button {
    @apply grow lg:grow-0 min-w-[50px] flex justify-center items-center;
  }
</style>
