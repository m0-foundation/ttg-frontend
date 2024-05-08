<template>
  <NuxtLayout name="proposals">
    <div>
      <ProposalList
        :proposals="emergencyProposals"
        :loading="isLoading"
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
        v-show="isConnected"
        class="lg:flex justify-end items-center gap-4 mt-6 py-4 px-8"
      >
        <span class="text-xxs"> Select YES or NO to submit your vote </span>
        <MButton
          id="button-cast-submit"
          class="w-full lg:w-40 flex justify-center"
          :disabled="isLoading || selectedCastProposals.length === 0"
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
import { useMBalances } from "@/lib/hooks";

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

const emergencyProposals = computed(() =>
  activeProposals.value.filter((p) => p.votingType === "Emergency")
);

const { address: userAccount, isConnected } = useAccount();
const { forceSwitchChain } = useCorrectChain();
const wagmiConfig = useWagmiConfig();
const alerts = useAlertsStore();

const balances = useMBalances(userAccount);

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

  try {
    const proposalIds = selectedCastProposals.value.map((p) =>
      BigInt(p.proposalId)
    );
    const votes = selectedCastProposals.value.map((p) => p.vote);

    const hash = await writeEmergencyGovernor(wagmiConfig, {
      address: spog.contracts.emergencyGovernor as Hash,
      functionName: "castVotes",
      args: [proposalIds, votes], // uint256 proposalId, uint8 support
      account: userAccount.value,
    });

    const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
      confirmations: 1,
      hash,
    });

    if (txReceipt.status !== "success") {
      throw txReceipt;
    }

    await spog.fetchTokens();
    balances.refetch();
  } catch (error: any) {
    console.log("Error casting vote", { error });
    if (error.transactionHash) {
      alerts.errorAlert(
        `Error when casting vote! <br/> See <a class="underline" target="_blank" href=${useBlockExplorer("tx", error.transactionHash)}>transaction</a>.`
      );
    } else {
      alerts.errorAlert(`Transaction not sent! ${error.shortMessage}`);
    }
  }

  isLoading.value = false;
}
</script>
