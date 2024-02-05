<template>
  <div class="mb-4 bg-transparent">
    <article
      :data-test="hasVoted ? 'voted' : 'not-voted'"
      class="text-white bg-grey-800 p-8"
    >
      <div v-if="proposal?.isEmergency" class="flex mb-3">
        <p class="text-xxs bg-red-700 uppercase leading-3 p-1.5">
          Emergency Proposal
        </p>
      </div>
      <div class="mb-4">
        <h2 class="text-2xl break-all">
          {{ title }}
        </h2>
      </div>

      <div class="text-grey-600 font-inter mb-4">
        {{ truncatedDescriptionText }}
      </div>

      <button
        id="show-details"
        type="button"
        class="uppercase text-xs flex justify-between hover:underline border border-grey-600 w-full p-3 my-4"
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
        class="lg:flex justify-between items-center"
      >
        <div>
          <div
            class="inline-flex gap-1 items-center w-full mb-4 lg:mb-0"
            role="group"
          >
            <ProposalButtonCastVote
              id="button-cast-yes"
              :batch="proposal?.votingType === 'Standard'"
              data-test="button-cast-yes"
              :disabled="
                isCastVoteYesDisabled || hasVoted || isDisconnected || !canVote
              "
              :version="
                voteEvent && voteEvent.support === true ? 'active' : 'default'
              "
              class="cast-vote-button"
              @click="onCastSelected(1)"
            >
              YES
            </ProposalButtonCastVote>
            <ProposalButtonCastVote
              id="button-cast-no"
              :batch="proposal?.votingType === 'Standard'"
              class="cast-vote-button"
              data-test="button-cast-no"
              :disabled="
                isCastVoteNoDisabled || hasVoted || isDisconnected || !canVote
              "
              :version="
                voteEvent && voteEvent.support === false ? 'active' : 'default'
              "
              @click="onCastSelected(0)"
            >
              NO
            </ProposalButtonCastVote>
          </div>

          <div class="text-xxs text-grey-400 uppercase">
            <p v-show="!canVote" class="mt-3">Not enought voting power</p>
            <p v-show="hasVoted" class="mt-3">Your vote has been submitted</p>
          </div>
        </div>

        <div class="uppercase text-xs text-grey-400 whitespace-nowrap">
          <div
            v-if="
              proposal?.votingType === 'Standard' ||
              proposal?.votingType === 'Emergency'
            "
            class="flex gap-2"
          >
            <MIconPower class="h-4 w-4 ml-1" />
            vote with power tokens
          </div>

          <div v-if="proposal?.votingType === 'Zero'" class="flex gap-2">
            <MIconZero class="h-4 w-4 ml-1" />
            vote with zero tokens
          </div>
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
            :disabled="isDisconnected || isLoading"
            :is-loading="isLoading"
            @click="onExecuteProposal()"
          >
            Execute
          </MButton>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import truncate from "lodash/truncate";
import { useAccount, useContractRead } from "use-wagmi";
import { Hash, Abi } from "viem";
import { useMVotingPower } from "@/lib/hooks";
import { MProposal } from "@/lib/api/types";

export interface ProposalCardProps {
  proposal: MProposal;
}

const props = defineProps<ProposalCardProps>();
const emit = defineEmits<{
  (e: "on-cast", vote: number, proposaId: string): void;
  (e: "on-uncast", proposaId: string): void;
  (e: "on-view", proposaId: string): void;
  (e: "on-execute", proposal: MProposal): void;
}>();

const apiStore = useApiClientStore();

const { address: userAccount, isConnected, isDisconnected } = useAccount();
const { title } = useParsedDescriptionTitle(props.proposal.description);

const isVoteSelected = ref(false);
const selectedVote = ref<null | number>(null);
const isCastVoteYesDisabled = computed(() => selectedVote.value === 0);
const isCastVoteNoDisabled = computed(() => selectedVote.value === 1);
const isLoading = ref(false);
const voteEndTimestamp = ref();

const { text: truncatedDescriptionText } = useParsedDescription(
  truncate(props.proposal.description, {
    length: 450,
  })
);

function onViewProposal() {
  emit("on-view", props.proposal.proposalId);
}

function onExecuteProposal() {
  isLoading.value = true;
  emit("on-execute", props.proposal);
}

function onCastSelected(vote: number) {
  if (isVoteSelected.value) {
    emit("on-uncast", props.proposal.proposalId);
    isVoteSelected.value = false;
    selectedVote.value = null;
  } else {
    emit("on-cast", vote, props.proposal.proposalId);
    isVoteSelected.value = true;
    selectedVote.value = vote;
  }
}

const proposalId = computed(() => props.proposal.proposalId);
const governor = computed(() => useGovernor({ proposalId: proposalId.value }));
console.log({ governor });

const { data: hasVoted } = useContractRead({
  address: governor?.value?.address as Hash,
  abi: governor?.value?.abi as Abi,
  functionName: "hasVoted",
  args: [BigInt(proposalId.value), userAccount as Ref<Hash>],
  watch: true,
  enabled: isConnected,
});

const { hasPowerTokensVotingPower, hasZeroTokenVotingPower } =
  useMVotingPower();

const canVote = computed(() => {
  if (["Standard", "Emergency"].includes(props.proposal.votingType!)) {
    return hasPowerTokensVotingPower.value;
  } else if (props.proposal?.votingType === "Zero") {
    return hasZeroTokenVotingPower.value;
  }
});

voteEndTimestamp.value = await apiStore.client.epoch.getTimestampOfEpochStart(
  props.proposal.voteEnd
);

const { timeAgo: voteEnds } = useDate(voteEndTimestamp.value);

const votesStore = useVotesStore();
const voteEvent = computed(() => {
  return votesStore
    .getBy("proposalId", proposalId.value)
    .value.find((v) => v.voter === userAccount.value);
});
</script>

<style>
.cast-vote-button {
  @apply grow lg:grow-0 min-w-[62px] flex justify-center items-center;
}
</style>
