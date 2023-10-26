<template>
  <NuxtLayout name="proposals">
    <ProposalList
      :proposals="activeProposals"
      class="px-3 pb-2"
      @on-cast="onCast"
      @on-uncast="onUncast"
    >
      <template #emptyState>
        <ProposalListEmptyState> No Active proposals </ProposalListEmptyState>
      </template>
    </ProposalList>

    <div
      v-show="hasProposals && isConnected"
      class="p-6 bg-grey-600 mb-28 lg:mb-0"
    >
      <div class="lg:flex justify-between items-center gap-2">
        <div class="grow flex items-center gap-2 mb-2 lg:mb-0">
          <div class="w-1/4 lg:w-1/3 bg-grey-800 rounded-full h-1.5">
            <div
              class="bg-primary h-1.5 rounded-ful"
              :style="`width: ${hasFinishedVoting ? 100 : progressBarWidth}%`"
            ></div>
          </div>
          <p v-if="hasFinishedVoting" class="text-grey-primary">
            Your votes has been submitted
          </p>
          <span v-else class="text-xs">
            {{ selectedCastProposals.length }} out
            {{ activeProposals.length }} proposals are left to vote on
          </span>
        </div>
        <MButton
          id="button-cast-submit"
          :disabled="!isSelectedCastProposalsFull || hasFinishedVoting"
          class="w-full lg:w-auto"
          @click="onCastBatchVotes"
        >
          submit votes
        </MButton>
      </div>

      <p
        v-show="!hasFinishedVoting"
        class="text-xs text-grey-primary flex lg:justify-end mt-2"
      >
        Your voting power will decrease over time if you do not vote
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Hash } from "viem";
import { useAccount, useContractRead } from "use-wagmi";
import { writeDualGovernor, powerTokenABI } from "@/lib/sdk";

interface CastedProposal {
  vote: number;
  proposalId: string;
}

const selectedCastProposals = ref<Array<CastedProposal>>([]);

const proposalsStore = useProposalsStore();
const spog = useSpogStore();

const { epoch } = storeToRefs(spog);
const activeProposals = computed(() =>
  proposalsStore.getProposalsByState("Active").filter((p) => !p.isEmergency)
);

const hasProposals = computed(
  () => activeProposals && activeProposals.value.length > 0
);

const isSelectedCastProposalsFull = computed(() => {
  return selectedCastProposals.value.length === activeProposals.value.length;
});

const progressBarWidth = computed(() => {
  return (
    (selectedCastProposals.value.length / activeProposals.value.length) * 100
  );
});

const { address: userAccount, isConnected } = useAccount();

function onCast(vote: number, proposalId: string) {
  console.log("casted", { vote, proposalId });
  selectedCastProposals.value.push({ vote, proposalId });
}

function onUncast(proposalId: string) {
  console.log("uncasted", { proposalId });
  selectedCastProposals.value = selectedCastProposals.value.filter(
    (p) => p.proposalId !== proposalId
  );
}

function onCastBatchVotes() {
  const proposalIds = selectedCastProposals.value.map((p) =>
    BigInt(p.proposalId)
  );
  const votes = selectedCastProposals.value.map((p) => p.vote);
  return writeDualGovernor({
    address: spog.contracts.governor as Hash,
    functionName: "castVotes",
    args: [proposalIds, votes], // uint256 proposalId, uint8 support
    account: userAccount.value,
  });
}

const { data: hasFinishedVoting } = useContractRead({
  address: spog.contracts.powerToken as Hash,
  abi: powerTokenABI,
  functionName: "hasParticipatedAt",
  args: [userAccount as Ref<Hash>, BigInt(epoch.value.current?.asNumber)],
  watch: true,
});
</script>
