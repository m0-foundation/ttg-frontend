<template>
  <article
    class="mb-4 bg-transparent"
    :class="{ 'border border-red-500': isProposalWithError }"
  >
    <UCard
      :data-test="hasVoted ? 'voted' : 'not-voted'"
      class="dark:text-white dark:bg-grey-800"
    >
      <div
        v-if="isProposalWithError"
        class="flex items-center gap-2 mb-2 bg-red-500 p-2 leading-tight"
      >
        <span class="-mb-1">CAUTION: Suspicious or wrong proposal</span>
        <VTooltip placement="right">
          <img src="/img/icon-info.svg" class="w-6 h-6" alt="" />
          <template #popper>
            <div class="max-w-80 text-sm">
              This proposal has been labeled as suspicious or wrong by the M^0
              Foundation. We recommend to vote <b>NO</b>.
            </div>
          </template>
        </VTooltip>
      </div>
      <ProposalTypeBadge
        v-if="proposal.votingType !== 'Standard' || proposal.state !== 'Active'"
        :type="proposal.votingType"
        class="mb-4"
      />

      <div class="mb-4 text-xl lg:text-2xl break-words">
        <NuxtLink tag="h3" :to="`/proposal/${proposal.proposalId}`">
          {{ title }}
        </NuxtLink>
      </div>

      <div class="text-grey-500 max-lg:text-sm font-inter mb-4 break-words">
        {{ truncate(onlyDescription, { length: 450 }) }}
      </div>

      <button
        id="show-details"
        type="button"
        class="uppercase text-xs flex justify-between hover:underline border border-gray-200 w-full p-3 my-4"
        data-test="proposal-button-show-details"
        @click="onViewProposal"
      >
        <span>show details </span>
        <svg
          class="h-4 mr-2"
          width="18"
          height="15"
          viewBox="0 0 18 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0.5" y="0.5" width="17" height="14" stroke="currentColor" />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M 14.767 3.938 L 14.767 3.108 L 13.936 3.108 L 8.767 3.108 L 8.767 4.108 L 12.935 4.108 L 8.767 8.274 L 9.602 9.108 L 13.767 4.939 L 13.767 9.108 L 14.767 9.108 L 14.767 3.938 Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <div
        v-if="proposal?.state === 'Active'"
        class="flex max-sm:flex-col justify-between lg:items-center gap-3"
      >
        <div class="w-full">
          <div
            class="inline-flex gap-1 items-center w-full lg:mb-0"
            role="group"
          >
            <ProposalButtonCastVote
              id="button-cast-yes"
              :batch="proposal?.votingType !== 'Zero'"
              data-test="button-cast-yes"
              :disabled="hasVoted || isDisconnected || !canVote || loading"
              :version="isVoteYesActive"
              :is-loading="loading && selectedVote"
              class="cast-vote-button"
              @click="onCast(true)"
            >
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
              @click="onCast(false)"
            >
              NO
            </ProposalButtonCastVote>
          </div>
        </div>

        <div class="font-inter text-xs dark:text-grey-200 whitespace-nowrap">
          <div
            v-if="
              proposal?.votingType === 'Standard' ||
              proposal?.votingType === 'Emergency'
            "
            class="flex gap-2"
          >
            <MIconPower class="h-4 w-4 ml-1" />
            Vote with POWER tokens
          </div>

          <div v-if="proposal?.votingType === 'Zero'" class="flex gap-2">
            <MIconZero class="h-4 w-4 ml-1" />
            Vote with ZERO tokens
          </div>
        </div>
      </div>

      <div
        v-if="proposal?.state === 'Active'"
        class="text-xs text-grey-600 font-inter mt-3"
      >
        <p v-show="!canVote">Not enough voting power</p>
        <p v-show="hasVoted">Your vote has been submitted</p>
      </div>

      <div v-if="!hasVoted && selectedVote !== null">
        <div class="mt-4 mb-3 text-grey-500 font-inter">
          <label
            class="flex items-center gap-2 text-xs leading-3 mb-0 rounded-none"
          >
            <input
              v-model="reasonForVoteCheckbox"
              type="checkbox"
              class="w-3 h-3 accent-alert-success"
              data-test="reason-vote-checkbox"
            />
            Share with others why you made this choice. This can cost a little
            more gas fees.
          </label>
        </div>

        <div>
          <UTextarea
            v-if="reasonForVoteCheckbox"
            ref="reasonForVoteTextarea"
            :value="localStoredVote?.reason || ''"
            class="reason-textarea"
            data-test="reason-vote-textarea"
            @input="
              emit(
                'update-reason-for-vote',
                $event.target.value,
                props.proposal.proposalId,
              )
            "
          ></UTextarea>
        </div>
      </div>

      <div
        v-if="proposal?.state === 'Succeeded'"
        class="flex justify-between items-center"
      >
        <div class="inline-flex gap-1" role="group">
          <MButton
            id="button-proposal-execute"
            data-test="proposal-button-execute"
            :disabled="isDisconnected || loading"
            :is-loading="loading"
            @click="onExecuteProposal()"
          >
            Execute
          </MButton>
        </div>
      </div>
    </UCard>
  </article>
</template>

<script setup lang="ts">
import truncate from "lodash/truncate";
import { useAccount, useReadContract, useBlockNumber } from "use-wagmi";
import { Hash, Abi } from "viem";
import { useMVotingPower } from "@/lib/hooks";
import { MProposal } from "@/lib/api/types";
import errorProposals from "@/assets/data/error-proposals.json";

export interface ProposalCardProps {
  proposal: MProposal;
  loading: boolean;
}

const props = defineProps<ProposalCardProps>();
const emit = defineEmits<{
  (e: "on-cast", vote: number, proposaId: string): void;
  (e: "on-uncast", proposaId: string): void;
  (e: "on-view", proposaId: string): void;
  (e: "on-execute", proposal: MProposal): void;
  (e: "update-reason-for-vote", value: string, proposalId: string): void;
}>();

const apiStore = useApiClientStore();
const localSelectedVotes = useLocalSelectedVotes();
const { address: userAccount, isConnected, isDisconnected } = useAccount();

const localStoredVote = computed(() =>
  localSelectedVotes.get(props.proposal.proposalId),
);

const selectedVote = computed(() =>
  localStoredVote.value != null
    ? localStoredVote.value.vote === 0
      ? false
      : true
    : null,
);

const reasonForVoteCheckbox = ref<boolean | undefined>(
  Boolean(localStoredVote.value?.reason),
);
const reasonForVoteTextarea = ref();

watch(reasonForVoteCheckbox, async (value) => {
  if (value) {
    // Focus the textarea when enabled
    await nextTick();
    reasonForVoteTextarea.value?.focus();
  } else {
    // Clean reason when disabled
    emit("update-reason-for-vote", "", props.proposal.proposalId);
  }
});

const isProposalWithError = computed(() => {
  return errorProposals?.some((id) => id === props.proposal.proposalId);
});

const isVoteYesActive = computed(() => {
  // vote has been casted to Yes
  if (voteEvent && voteEvent.value?.support === true) return "active";

  return selectedVote.value === true ? "active" : "default";
});

const isVoteNoActive = computed(() => {
  if (voteEvent && voteEvent.value?.support === false) return "active";

  return selectedVote.value === false ? "active" : "default";
});

const voteEndTimestamp = ref();

const { onlyDescription, title } = useParsedDescriptionTitle(
  props.proposal.description,
);

async function onViewProposal() {
  await navigateTo(`/proposal/${props.proposal.proposalId}`);
}

function onExecuteProposal() {
  emit("on-execute", props.proposal);
}

function onCast(vote: boolean) {
  if (["Standard", "Emergency"].includes(props.proposal?.votingType!)) {
    return onBatchCastSelected(vote);
  } else {
    return onSingleCastSelected(vote);
  }
}

function onBatchCastSelected(vote: boolean) {
  // no vote has been select then click on any button
  if (selectedVote.value === null) {
    emit("on-cast", Number(vote), props.proposal.proposalId);
  }
  // vote has been select on the same button
  else if (selectedVote.value === vote) {
    emit("on-uncast", props.proposal.proposalId);
  }
  // vote has been select on the other button
  else if (selectedVote.value !== vote) {
    emit("on-uncast", props.proposal.proposalId);
    emit("on-cast", Number(vote), props.proposal.proposalId);
  }
}

function onSingleCastSelected(vote: boolean) {
  emit("on-cast", Number(vote), props.proposal.proposalId);
}

const proposalId = computed(() => props.proposal.proposalId);
const governor = computed(() => useGovernor({ proposalId: proposalId.value }));

const { power: powerVotingPower } = useMVotingPower(userAccount);

const canVote = computed(() => {
  if (["Standard"].includes(props.proposal.votingType!)) {
    return powerVotingPower?.data.value?.hasVotingPower;
  }

  return true;
});

voteEndTimestamp.value = apiStore.client.epoch.getTimestampOfEpochStart(
  props.proposal.voteEnd,
);

const votesStore = useVotesStore();
const voteEvent = computed(() => {
  return votesStore
    .getBy("proposalId", proposalId.value)
    .value.find((v) => v.voter === userAccount.value);
});

const { data: blockNumber } = useBlockNumber({ watch: true });
const { data: hasVoted, refetch } = useReadContract({
  address: governor?.value?.address as Hash,
  abi: governor?.value?.abi as Abi,
  functionName: "hasVoted",
  args: [BigInt(proposalId.value), userAccount as Ref<Hash>],
  query: {
    enabled: isConnected,
  },
});

watch(blockNumber, () => {
  refetch();
});
</script>

<style>
.cast-vote-button {
  @apply grow lg:grow-0 min-w-[62px] flex justify-center items-center;
}
</style>
