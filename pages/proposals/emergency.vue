<template>
  <NuxtLayout name="proposals">
    <MDialog ref="dialog">
      <template #header> Confirm your voting power </template>

      <template #body>
        <div>
          <div class="flex justify-start items-center gap-6 mb-4">
            <p class="">
              <MIconPower class="w-6 inline-block mr-2" />
              {{ useNumberFormatterPrice((votingPower as any)?.formatted) }}
            </p>
            <p class="uppercase text-xxs text-grey-600">voting power</p>
          </div>

          <p class="text-sm">
            This is your POWER <u>voting power</u> which will be utilized to
            vote on this proposal base on the previous epoch.
          </p>
        </div>
      </template>
    </MDialog>

    <ProposalList
      :proposals="proposals"
      :loading="isLoading"
      :selected-proposal="selectedProposal"
      @on-cast="confirmCastVote"
    >
      <template #emptyState>
        <ProposalListEmptyState>
          No emergency proposals
        </ProposalListEmptyState>
      </template>
    </ProposalList>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Abi, Hash } from "viem";
import { useAccount } from "use-wagmi";
import { writeContract, waitForTransactionReceipt } from "@wagmi/core";

const proposalsStore = useProposalsStore();

useHead({
  titleTemplate: "%s - Emergency proposals",
});

const { address: userAccount } = useAccount();
const { forceSwitchChain } = useCorrectChain();

const isLoading = ref(false);
const selectedProposal = ref();

const dialog = ref();
const votingPower = ref();

const proposals = computed(() =>
  proposalsStore.getProposalsTypeEmergency.filter((p) => p.state === "Active")
);

const wagmiConfig = useWagmiConfig();
const proposalStore = useProposalsStore();
const alerts = useAlertsStore();

async function confirmCastVote(vote: number, proposalId: string) {
  await fetchVotingPower(proposalId);
  if (await dialog.value.open()) {
    return castVote(vote, proposalId);
  }
}

async function fetchVotingPower(proposalId: string) {
  const proposal = proposalStore.getProposalById(proposalId);
  const pastEpoch = proposal!.voteStart - 1;

  votingPower.value = await usePastVotes({
    address: userAccount.value!,
    epoch: pastEpoch,
    token: "power",
  });
}

async function castVote(vote: number, proposalId: string) {
  await forceSwitchChain();

  selectedProposal.value = proposalId;
  isLoading.value = true;

  const governor = useGovernor({ proposalId });
  console.log("cast", { vote, proposalId, governor });

  try {
    const hash = await writeContract(wagmiConfig, {
      address: governor!.address as Hash,
      abi: governor!.abi as Abi,
      functionName: "castVote",
      args: [BigInt(proposalId), vote],
      account: userAccount.value,
    });

    const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
      confirmations: 1,
      hash,
    });

    if (txReceipt.status !== "success") {
      throw txReceipt;
    }

    proposalStore.updateProposalById(proposalId);

    alerts.successAlert("Vote casted successfully!");
  } catch (error: any) {
    console.log("Error casting vote", { error });
    if (error.transactionHash) {
      alerts.errorAlert(
        `Error when casting vote! <br/> See <a class="underline" target="_blank" href=${useBlockExplorer("tx", error.transactionHash)}>transaction</a>.`
      );
    } else {
      alerts.errorAlert(`Transaction not sent! ${error.shortMessage}`);
    }
  } finally {
    isLoading.value = false;
    selectedProposal.value = undefined;
  }
}
</script>
