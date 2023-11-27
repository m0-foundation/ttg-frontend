<template>
  <NuxtLayout name="proposals">
    <h2 class="uppercase text-sm px-6 py-4 text-grey-400">
      mandatory proposals
    </h2>
    <ProposalList
      :proposals="mandatoryToVoteProposals"
      class="px-3 pb-2"
      @on-cast="onCast"
      @on-uncast="onUncast"
    >
      <template #emptyState>
        <ProposalListEmptyState> No Active proposals </ProposalListEmptyState>
      </template>
    </ProposalList>

    <div v-show="hasProposals && isConnected" class="p-6 bg-grey-600">
      <div class="lg:flex justify-between items-center gap-2">
        <div class="grow flex items-center gap-2 mb-2 lg:mb-0">
          <div class="w-1/4 lg:w-1/3 bg-grey-800 rounded-full h-1.5">
            <div
              class="bg-green-700 h-1.5 rounded-ful"
              :style="`width: ${hasFinishedVoting ? 100 : progressBarWidth}%`"
            ></div>
          </div>
          <p v-if="hasFinishedVoting" class="text-grey-400">
            Your votes has been submitted
          </p>
          <span v-else class="text-xxs lg:text-xs">
            {{ mandatoryToVoteProposals.length - selectedCastProposals.length }}
            of {{ mandatoryToVoteProposals.length }} proposals are left to vote
            on
          </span>
        </div>
        <MButton
          id="button-cast-submit"
          class="w-full lg:w-auto flex justify-center my-3"
          :disabled="
            !isSelectedCastProposalsFull || hasFinishedVoting || isLoading
          "
          :is-loading="isLoading"
          @click="onCastBatchVotes"
        >
          submit votes
        </MButton>
      </div>

      <p
        v-show="!hasFinishedVoting"
        class="text-xxs text-grey-400 flex lg:justify-end mt-2"
      >
        Your voting power will decrease over time if you do not vote
      </p>
    </div>

    <h2 class="uppercase text-sm px-6 py-4 text-grey-400">
      optional proposals
    </h2>

    <ProposalList
      :proposals="optionalToVoteProposals"
      class="px-3 pb-2"
      @on-cast="onCastOptional"
    >
      <template #emptyState>
        <ProposalListEmptyState> No Active proposals </ProposalListEmptyState>
      </template>
    </ProposalList>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Hash } from "viem";
import { useAccount, useContractRead } from "use-wagmi";
import { waitForTransaction } from "@wagmi/core";
import { writeDualGovernor, powerTokenABI } from "@/lib/sdk";

interface CastedProposal {
  vote: number;
  proposalId: string;
}

const selectedCastProposals = ref<Array<CastedProposal>>([]);
const isLoading = ref(false);

const proposalsStore = useProposalsStore();
const spog = useSpogStore();

const { epoch } = storeToRefs(spog);

const activeProposals = computed(() =>
  proposalsStore.getProposalsByState("Active")
);

const mandatoryToVoteProposals = computed(() =>
  activeProposals.value.filter((p) => p.votingType === "Standard")
);

const optionalToVoteProposals = computed(() =>
  activeProposals.value.filter(
    (p) => p.votingType === "Zero" || p.votingType === "Emergency"
  )
);

const hasProposals = computed(
  () => mandatoryToVoteProposals && mandatoryToVoteProposals.value.length > 0
);

const isSelectedCastProposalsFull = computed(() => {
  return (
    selectedCastProposals.value.length === mandatoryToVoteProposals.value.length
  );
});

const progressBarWidth = computed(() => {
  return (
    (selectedCastProposals.value.length /
      mandatoryToVoteProposals.value.length) *
    100
  );
});

const { address: userAccount, isConnected } = useAccount();
const { forceSwitchChain } = useCorrectChain();

useHead({
  titleTemplate: "%s - Proposals",
});

function onCast(vote: number, proposalId: string) {
  selectedCastProposals.value.push({ vote, proposalId });
}

function onUncast(proposalId: string) {
  selectedCastProposals.value = selectedCastProposals.value.filter(
    (p) => p.proposalId !== proposalId
  );
}

async function onCastBatchVotes() {
  await forceSwitchChain();

  isLoading.value = true;

  const proposalIds = selectedCastProposals.value.map((p) =>
    BigInt(p.proposalId)
  );
  const votes = selectedCastProposals.value.map((p) => p.vote);

  const { hash } = await writeDualGovernor({
    address: spog.contracts.governor as Hash,
    functionName: "castVotes",
    args: [proposalIds, votes], // uint256 proposalId, uint8 support
    account: userAccount.value,
  });

  const txReceipt = await waitForTransaction({ confirmations: 1, hash });
  if (txReceipt.status !== "success") {
    throw new Error("Transaction was rejected");
  }

  isLoading.value = false;
}

const { data: hasFinishedVoting } = useContractRead({
  address: spog.contracts.powerToken as Hash,
  abi: powerTokenABI,
  functionName: "hasParticipatedAt",
  args: [userAccount as Ref<Hash>, BigInt(epoch.value.current?.asNumber)],
  watch: true,
});

async function onCastOptional(vote: number, proposalId: string) {
  await forceSwitchChain();
  console.log("cast", { vote, proposalId });
  return writeDualGovernor({
    address: spog.contracts.governor as Hash,
    functionName: "castVote",
    args: [BigInt(proposalId), vote],
    account: userAccount.value,
  });
}
</script>
