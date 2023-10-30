<template>
  <div>
    <MTextLoop
      v-show="proposal?.isEmergency"
      class="text-white bg-[#CC0000] text-xs"
      text="EMERGENCY_VOTING"
    />
    <article
      :data-test="hasVoted ? 'voted' : 'not-voted'"
      class="text-white bg-grey-800 p-6 mb-4"
    >
      <h2 class="text-2xl mb-4 break-all">
        {{ title }}
      </h2>
      <div
        class="text-xs xl:text-sm mb-6 text-gray-400 hidden lg:flexjustify-between"
      >
        <div class="">
          Proposed by
          <NuxtLink :to="`/profile/${proposal.proposer}/`">
            <u>{{ proposal.proposer }}</u>
          </NuxtLink>
        </div>
        <div>{{ timeAgo }} | {{ formatedDate }}</div>
      </div>

      <div class="text-grey-primary text-sm">
        {{ truncatedDescriptionText }}
      </div>

      <button
        id="show-details"
        type="button"
        class="uppercase text-xs flex justify-between hover:underline border border-grey-600 w-full py-2 px-4 my-4"
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
        <div class="flex gap-1">
          <MButtonRadio
            v-model="selectedVote"
            :disabled="isCastVoteYesDisabled || hasVoted"
            :name="props.proposal.proposalId"
            text="Yes"
            :value="1"
            @click="onCastSelected(1)"
          />
          <MButtonRadio
            v-model="selectedVote"
            :disabled="isCastVoteNoDisabled || hasVoted"
            :name="props.proposal.proposalId"
            text="No"
            :value="0"
            @click="onCastSelected(0)"
          />
        </div>

        <div class="uppercase text-xs text-grey-primary mt-4 lg:mt-0">
          tokens needed to vote
        </div>
      </div>

      <div
        v-if="proposal?.state === 'Succeeded'"
        class="flex justify-between items-center"
      >
        <div class="inline-flex gap-1" role="group">
          <MButton
            id="button-proposal-execute"
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
import { Hash } from "viem";
import { dualGovernorABI } from "@/lib/sdk";
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

const spog = useSpogStore();
const { address: userAccount, isDisconnected } = useAccount();
const { toFormat, timeAgo } = useDate(props.proposal.timestamp);
const { title } = useParsedDescriptionTitle(props.proposal.description);

const isVoteSelected = ref(false);
const selectedVote = ref<null | number>(null);
const formatedDate = computed(() => toFormat("LL"));
const isCastVoteYesDisabled = computed(() => selectedVote.value === 0);
const isCastVoteNoDisabled = computed(() => selectedVote.value === 1);
const isLoading = ref(false);

const { text: truncatedDescriptionText } = useParsedDescription(
  truncate(props.proposal.description, {
    length: 300,
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
  if (selectedVote.value === vote) {
    emit("on-uncast", props.proposal.proposalId);
    isVoteSelected.value = false;
    selectedVote.value = null;
  } else {
    emit("on-cast", vote, props.proposal.proposalId);
    isVoteSelected.value = true;
    selectedVote.value = vote;
  }
}

const { data: hasVoted } = useContractRead({
  address: spog.contracts.governor as Hash,
  abi: dualGovernorABI,
  functionName: "hasVoted",
  args: [BigInt(props.proposal.proposalId), userAccount as Ref<Hash>],
  watch: true,
});

const { hasPowerTokensVotingPower, hasZeroTokenVotingPower } =
  useMVotingPower(userAccount);

const canVote = computed(() => {
  if (props.proposal?.votingType === "Power") {
    return hasPowerTokensVotingPower.value;
  } else if (props.proposal?.votingType === "Zero") {
    return hasZeroTokenVotingPower.value;
  } else if (props.proposal?.votingType === "Double") {
    return hasPowerTokensVotingPower.value && hasZeroTokenVotingPower.value;
  } else if (props.proposal?.votingType === "Emergency") {
    return hasPowerTokensVotingPower.value;
  }
});
</script>
