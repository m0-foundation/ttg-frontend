<template>
  <div class="mb-4 bg-transparent">
    <article
      :data-test="hasVoted ? 'voted' : 'not-voted'"
      class="text-white bg-grey-800 p-8"
    >
      <div v-if="proposal?.isEmergency" class="flex mb-4">
        <MBadge version="error">Emergency Proposal</MBadge>
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
        class="uppercase text-xs flex justify-between hover:underline border border-grey-700 w-full p-3 my-4"
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
              :disabled="hasVoted || isDisconnected || !canVote || isLoading"
              :version="isVoteYesActive"
              class="cast-vote-button"
              @click="onCastSelected(true)"
            >
              YES
            </ProposalButtonCastVote>
            <ProposalButtonCastVote
              id="button-cast-no"
              :batch="proposal?.votingType === 'Standard'"
              class="cast-vote-button"
              data-test="button-cast-no"
              :disabled="hasVoted || isDisconnected || !canVote || isLoading"
              :version="isVoteNoActive"
              @click="onCastSelected(false)"
            >
              NO
            </ProposalButtonCastVote>

            <div class="text-xxs text-grey-600 uppercase mx-2">
              <p v-show="!canVote">Not enought voting power</p>
              <p v-show="hasVoted">Your vote has been submitted</p>
            </div>
          </div>
        </div>

        <div
          class="uppercase font-inter text-xs text-grey-600 whitespace-nowrap"
        >
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
import { useAccount, useReadContract, useBlockNumber } from "use-wagmi";
import { Hash, Abi } from "viem";
import { useMVotingPower } from "@/lib/hooks";
import { MProposal } from "@/lib/api/types";

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
}>();

const apiStore = useApiClientStore();

const { address: userAccount, isConnected, isDisconnected } = useAccount();
const { title } = useParsedDescriptionTitle(props.proposal.description);

const selectedVote = ref<null | boolean>(null);

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
const isLoading = computed(() => props.loading);

const { text: truncatedDescriptionText } = useParsedDescription(
  truncate(props.proposal.description, {
    length: 450,
  })
);

function onViewProposal() {
  emit("on-view", props.proposal.proposalId);
}

function onExecuteProposal() {
  emit("on-execute", props.proposal);
}

function onCastSelected(vote: boolean) {
  // no vote has been select then click on any button
  if (selectedVote.value === null) {
    emit("on-cast", Number(vote), props.proposal.proposalId);
    selectedVote.value = vote;
  }
  // vote has been select on the same button
  else if (selectedVote.value === vote) {
    emit("on-uncast", props.proposal.proposalId);
    selectedVote.value = null;
  }
  // vote has been select on the other button
  else if (selectedVote.value !== vote) {
    emit("on-uncast", props.proposal.proposalId);
    emit("on-cast", Number(vote), props.proposal.proposalId);
    selectedVote.value = vote;
  }
}

const proposalId = computed(() => props.proposal.proposalId);
const governor = computed(() => useGovernor({ proposalId: proposalId.value }));

const { power: powerVotingPower, zero: zeroVotingPower } =
  useMVotingPower(userAccount);

const canVote = computed(() => {
  if (["Standard", "Emergency"].includes(props.proposal.votingType!)) {
    return powerVotingPower?.data.value?.hasVotingPower;
  } else if (props.proposal?.votingType === "Zero") {
    return zeroVotingPower?.data.value?.hasVotingPower;
  }
});

voteEndTimestamp.value = apiStore.client.epoch.getTimestampOfEpochStart(
  props.proposal.voteEnd
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
