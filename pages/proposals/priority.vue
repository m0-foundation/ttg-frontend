<template>
  <NuxtLayout name="proposals">
    <div>
      <ProposalList
        :proposals="emergencyProposals"
        :loading="isLoading"
        @on-cast="onCast"
        @on-uncast="onUncast"
        @update-reason-for-vote="updateReasonForVote"
      >
        <template #emptyState>
          <ProposalListEmptyState>
            No active emergency proposals
          </ProposalListEmptyState>
        </template>
      </ProposalList>

      <div
        v-show="hasProposals && isConnected"
        class="lg:flex justify-end items-center gap-4 mt-6 py-4 px-8"
        :class="{
          'bg-grey-700': isSelectedCastProposalsFull,
        }"
      >
        <span v-if="!isSelectedCastProposalsFull" class="text-xxs">
          Select YES or NO to submit your vote
        </span>
        <MButton
          id="button-cast-submit"
          class="w-full lg:w-40 flex justify-center"
          :disabled="
            !isSelectedCastProposalsFull || hasVotedOnAllProposals || isLoading
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
import { Hash } from "viem";
import { useAccount } from "use-wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { writeEmergencyGovernor } from "@/lib/sdk";

interface CastedProposal {
  vote: number;
  proposalId: string;
  reason?: string;
}

const selectedCastProposals = ref<Array<CastedProposal>>([]);
const isLoading = ref(false);

const proposalsStore = useProposalsStore();
const ttg = useTtgStore();

const activeProposals = computed(() =>
  proposalsStore.getProposalsByState("Active"),
);

const emergencyProposals = computed(() =>
  activeProposals.value.filter((p) => p.votingType === "Emergency"),
);
const hasProposals = computed(
  () => emergencyProposals && emergencyProposals.value.length > 0,
);

const isSelectedCastProposalsFull = computed(() => {
  return selectedCastProposals.value.length === emergencyProposals.value.length;
});

const { address: userAccount, isConnected } = useAccount();
const { forceSwitchChain } = useCorrectChain();
const wagmiConfig = useWagmiConfig();
const alerts = useAlertsStore();

useHead({
  titleTemplate: "%s - Priority proposals",
});

function onCast(vote: number, proposalId: string) {
  selectedCastProposals.value.push({ vote, proposalId });
}

function onUncast(proposalId: string) {
  selectedCastProposals.value = selectedCastProposals.value.filter(
    (p) => p.proposalId !== proposalId,
  );
}

function updateReasonForVote(value: string, proposalId: string) {
  selectedCastProposals.value = selectedCastProposals.value.map((p) => {
    if (p.proposalId === proposalId) {
      return { ...p, reason: value };
    }
    return p;
  });
}

const hasVotedOnAllProposals = ref(false);

async function onCastBatchVotes() {
  await forceSwitchChain();

  isLoading.value = true;

  try {
    let hash;
    const reasons = selectedCastProposals.value.map((p) => p.reason || "");
    const proposalIds = selectedCastProposals.value.map((p) =>
      BigInt(p.proposalId),
    );
    const votes = selectedCastProposals.value.map((p) => p.vote);

    const isOnlyOneVote = selectedCastProposals.value.length === 1;
    const anyProposalHasReason = selectedCastProposals.value.some(
      (p) => p.reason,
    );

    if (anyProposalHasReason && isOnlyOneVote) {
      hash = await castSingleVoteWithReason(
        proposalIds[0],
        votes[0],
        reasons[0],
      );
    } else if (anyProposalHasReason) {
      hash = await castVotesWithReason(proposalIds, votes, reasons);
    } else if (isOnlyOneVote) {
      hash = await castSingleVote(proposalIds[0], votes[0]);
    } else {
      hash = await castVotes(proposalIds, votes);
    }

    const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
      confirmations: 1,
      hash,
    });

    if (txReceipt.status !== "success") {
      throw txReceipt;
    }

    alerts.successAlert("Vote casted successfully!");
    hasVotedOnAllProposals.value = true;

    await ttg.fetchTokens();
  } catch (error: any) {
    if (error.transactionHash) {
      alerts.errorAlert(
        `Error when casting vote! <br/> See <a class="underline" target="_blank" href=${useBlockExplorer("tx", error.transactionHash)}>transaction</a>.`,
      );
    } else {
      alerts.errorAlert(`Transaction not sent! ${error.shortMessage}`);
    }
  } finally {
    isLoading.value = false;
  }
}

const castSingleVoteWithReason = (
  proposalId: bigint,
  vote: number,
  reason: string,
) => {
  return writeEmergencyGovernor(wagmiConfig, {
    address: ttg.contracts.emergencyGovernor as Hash,
    functionName: "castVoteWithReason",
    args: [proposalId, vote, reason], // uint256 proposalId, uint8 support, string reason
    account: userAccount.value,
  });
};

const castVotesWithReason = (
  proposalIds: bigint[],
  votes: number[],
  reasons: string[],
) => {
  return writeEmergencyGovernor(wagmiConfig, {
    address: ttg.contracts.emergencyGovernor as Hash,
    functionName: "castVotesWithReason",
    args: [proposalIds, votes, reasons], // uint256[] proposalId, uint8[] support, string[] reason
    account: userAccount.value,
  });
};

const castSingleVote = (proposalId: bigint, vote: number) => {
  return writeEmergencyGovernor(wagmiConfig, {
    address: ttg.contracts.emergencyGovernor as Hash,
    functionName: "castVote",
    args: [proposalId, vote], // uint256 proposalId, uint8 support, string reason
    account: userAccount.value,
  });
};

const castVotes = (proposalIds: bigint[], votes: number[]) => {
  return writeEmergencyGovernor(wagmiConfig, {
    address: ttg.contracts.emergencyGovernor as Hash,
    functionName: "castVotes",
    args: [proposalIds, votes], // uint256[] proposalId, uint8[] support
    account: userAccount.value,
  });
};
</script>
