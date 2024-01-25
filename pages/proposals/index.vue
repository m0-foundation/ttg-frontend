<template>
  <NuxtLayout name="proposals">
    <div
      v-if="!hasFinishedVoting"
      class="p-8 py-6 bg-green-1000 font-inter flex flex-col gap-3"
    >
      <div class="flex flex-col lg:flex-row gap-3">
        <img class="w-8" src="/img/icon-inflation.svg" alt="" />
        <div>
          <h5>
            Vote on all standard proposals to save your voting power and get
            <span class="text-green-700">+Z100 of inflation</span>
          </h5>
          <div class="grow flex items-center gap-2 my-2 lg:mb-0">
            <span
              class="text-xxs lg:text-xs text-green-700 text-nowrap uppercase flex gap-3"
            >
              Votes submitted:
              <span>
                {{ selectedCastProposals.length }} /
                {{ mandatoryToVoteProposals.length }}</span
              >
            </span>
            <div class="w-full max-w-48 lg:h-1/3 bg-grey-800 rounded-sm h-1.5">
              <div
                class="bg-green-700 h-1.5 rounded-sm"
                :style="`width: ${hasFinishedVoting ? 100 : progressBarWidth}%`"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <p class="text-green-800 text-xs">
        Standard Proposals are voteable only by POWER holders and require a
        simple majority to pass. In each epoch the supply of POWER is inflated
        and this inflation is claimed pro rata among participating POWER
        holders.
        <!-- TODO learn more -->
        <!-- <a class="underline" href="#" target="_blank" rel="noopener noreferrer">
          Learn more.
        </a> -->
      </p>
    </div>
    <div class="p-8">
      <ProposalList
        :proposals="standardProposals"
        @on-cast="onCast"
        @on-uncast="onUncast"
      >
        <template #emptyState>
          <ProposalListEmptyState>
            No active standard proposals
          </ProposalListEmptyState>
        </template>
      </ProposalList>

      <div
        v-show="hasProposals && isConnected"
        class="lg:flex justify-end items-center uppercase gap-4 mt-6"
      >
        <span v-if="!isSelectedCastProposalsFull" class="text-grey-400 text-xxs"
          >Select YES or NO to submit your vote</span
        >
        <MButton
          id="button-cast-submit"
          class="w-full lg:w-40 flex justify-center"
          :disabled="
            !isSelectedCastProposalsFull || hasFinishedVoting || isLoading
          "
          :is-loading="isLoading"
          data-test="proposal-button-submit-votes"
          @click="onCastBatchVotes"
        >
          submit
        </MButton>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Abi, Hash } from "viem";
import { useAccount, useContractRead } from "use-wagmi";
import { waitForTransaction, writeContract } from "@wagmi/core";
import { standardGovernorABI, writeStandardGovernor } from "@/lib/sdk";

interface CastedProposal {
  vote: number;
  proposalId: string;
}

const selectedCastProposals = ref<Array<CastedProposal>>([]);
const isLoading = ref(false);

const proposalsStore = useProposalsStore();
const spog = useSpogStore();

const activeProposals = computed(() =>
  proposalsStore.getProposalsByState("Active")
);

const standardProposals = computed(() =>
  activeProposals.value.filter((p) => p.votingType === "Standard")
);

const mandatoryToVoteProposals = computed(() =>
  activeProposals.value.filter((p) => p.votingType === "Standard")
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

// batch is only for standard proposals
async function onCastBatchVotes() {
  await forceSwitchChain();

  isLoading.value = true;

  const proposalIds = selectedCastProposals.value.map((p) =>
    BigInt(p.proposalId)
  );
  const votes = selectedCastProposals.value.map((p) => p.vote);

  const { hash } = await writeStandardGovernor({
    address: spog.contracts.standardGovernor as Hash,
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
  address: spog.contracts.standardGovernor as Hash,
  abi: standardGovernorABI,
  functionName: "hasVotedOnAllProposals",
  args: [userAccount as Ref<Hash>, BigInt(spog.epoch?.current?.asNumber || 0)],
  watch: true,
  enabled: isConnected,
});

async function onCastOptional(vote: number, proposalId: string) {
  await forceSwitchChain();

  const governor = useGovernor({ proposalId });
  console.log("cast", { vote, proposalId, governor });

  return writeContract({
    address: governor!.address as Hash,
    abi: governor!.abi as Abi,
    functionName: "castVote",
    args: [BigInt(proposalId), vote],
    account: userAccount.value,
  });
}
</script>
