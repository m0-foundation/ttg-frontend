<template>
  <div>
    <MTextLoop
      v-show="proposal?.isEmergency"
      class="text-white bg-[#CC0000] text-xs"
      text="EMERGENCY_VOTING"
    />
    <article :class="hasVoted ? 'voted' : 'not-voted'">
      <h2 class="text-4xl mb-4 break-all">
        {{ title }}
      </h2>
      <div class="text-sm mb-6 flex justify-between">
        <div id="proposer" class="truncate w-52">
          Proposed by <u>{{ proposal.proposer }}</u>
        </div>
        <div id="time">{{ timeAgo }} | {{ formatedDate }}</div>
      </div>
      <div class="flex justify-between uppercase">
        <NuxtLink
          id="show-details"
          class="uppercase flex text-xs items-center hover:underline"
          :to="`/proposals/${proposal.proposalId}`"
        >
          <svg
            class="h-4 mr-2"
            width="18"
            height="15"
            viewBox="0 0 18 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.5"
              width="17"
              height="14"
              stroke="currentColor"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M 14.767 3.938 L 14.767 3.108 L 13.936 3.108 L 8.767 3.108 L 8.767 4.108 L 12.935 4.108 L 8.767 8.274 L 9.602 9.108 L 13.767 4.939 L 13.767 9.108 L 14.767 9.108 L 14.767 3.938 Z"
              fill="currentColor"
            />
          </svg>
          show details
        </NuxtLink>

        <div class="flex justify-between items-center">
          <ProposalStatus :version="proposal?.state" />

          <div class="inline-flex gap-1 ml-4" role="group">
            <ProposalButtonCastVote
              id="button-cast-yes"
              :disabled="isCastVoteYesDisabled || hasVoted"
              @click="onCastSelected(1)"
            >
              YES
            </ProposalButtonCastVote>
            <ProposalButtonCastVote
              id="button-cast-no"
              :disabled="isCastVoteNoDisabled || hasVoted"
              @click="onCastSelected(0)"
            >
              NO
            </ProposalButtonCastVote>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { useAccount, useContractRead } from "use-wagmi";
import { Hash } from "viem";
import { ispogGovernorABI } from "@/lib/sdk";
import { MProposal } from "@/lib/api";

export interface ProposalCardProps {
  proposal: MProposal;
}

const props = defineProps<ProposalCardProps>();
const emit = defineEmits<{
  (e: "on-cast", vote: number, proposaId: string): void;
  (e: "on-uncast", proposaId: string): void;
}>();

const spog = useSpogStore();
const { address: userAccount } = useAccount();
const { toFormat, timeAgo } = useDate(props.proposal.timestamp);
const { title } = useParsedDescriptionTitle(props.proposal.description);
const config = useRuntimeConfig();

const isVoteSelected = ref(false);
const selectedVote = ref<null | number>(null);
const formatedDate = computed(() => toFormat("LL"));
const isCastVoteYesDisabled = computed(() => selectedVote.value === 0);
const isCastVoteNoDisabled = computed(() => selectedVote.value === 1);

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

const {
  data: hasVoted,
  isError,
  isLoading,
} = useContractRead({
  address: spog.contracts.governor as Hash,
  abi: ispogGovernorABI,
  functionName: "hasVoted",
  args: [
    BigInt(props.proposal.proposalId),
    (userAccount.value || config.public.ZERO_ADDRESS) as Hash,
  ],
  watch: true,
});
</script>

<style scoped>
article {
  @apply p-8 mb-2;
}

.not-voted {
  @apply bg-white text-black;

  #proposer,
  #time {
    @apply text-primary-darker;
  }

  #show-details {
    @apply text-black;
  }
}

.voted {
  @apply text-white bg-[#363835];

  #proposer,
  #time {
    @apply text-grey-primary;
  }

  #show-details {
    @apply text-white;
  }
}
</style>
