<template>
  <NuxtLayout name="proposals">
    <div
      v-if="!hasFinishedVoting && isConnected && hasProposals"
      class="p-8 py-6 bg-grey-200 font-inter flex flex-col gap-3 text-grey-600 mb-6"
    >
      <div class="flex flex-col lg:flex-row gap-3 items-start">
        <div>
          <h5 class="text-grey-800 lg:text-xl tracking-tightest">
            <span class="text-accent-blue">Preserve your voting power</span> and
            receive
            <span class="text-accent-blue">
              {{ useNumberFormatterPrice(powerInflation) }} POWER
            </span>
            in the next epoch, along with an immediate
            <span class="text-accent-blue">
              {{ useNumberFormatterPrice(zeroInflation) }} ZERO
            </span>
            tokens of inflation, by voting on all standard proposals in this
            epoch.
          </h5>
          <div class="grow flex items-center gap-2 my-2 lg:mb-0">
            <span class="text-xxs lg:text-x text-nowrap uppercase flex gap-3">
              Votes submitted:
              <span>
                {{ selectedCastProposals.length }} /
                {{ mandatoryToVoteProposals.length }}
              </span>
            </span>
            <div class="w-full lg:h-1/3 bg-white rounded-sm h-1.5">
              <div
                class="bg-accent-blue h-1.5 rounded-sm"
                :style="`width: ${hasFinishedVoting ? 100 : progressBarWidth}%`"
              ></div>
            </div>
          </div>
          <a
            class="text-xs underline hover:no-underline"
            href="https://docs.m0.org/portal/overview/whitepaper/iii.-governance"
            target="_blank"
          >
            Learn more
          </a>
        </div>
        <img class="w-8 hidden lg:block" src="/img/icon-inflation.svg" alt="" />
      </div>
    </div>
    <div>
      <ProposalList
        :proposals="standardProposals"
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
import { Hash } from "viem";
import { useAccount, useReadContract } from "use-wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { standardGovernorAbi, writeStandardGovernor } from "@/lib/sdk";
import {
  useMBalances,
  useMInflationPowerToken,
  useMInflationZeroToken,
} from "@/lib/hooks";

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
const wagmiConfig = useWagmiConfig();
const alerts = useAlertsStore();

const powerInflation = useMInflationPowerToken();
const zeroInflation = useMInflationZeroToken();
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

    const hash = await writeStandardGovernor(wagmiConfig, {
      address: spog.contracts.standardGovernor as Hash,
      functionName: "castVotes",
      args: [proposalIds, votes], // uint256 proposalId, uint8 support
      account: userAccount.value,
    });

    const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
      confirmations: 1,
      hash,
    });
    if (txReceipt.status !== "success") {
      throw new Error("Transaction was rejected");
    }

    alerts.infoAlert(
      `Your Balance will receive the reward of ${useNumberFormatterPrice(
        toValue(powerInflation)
      )} POWER tokens in the next epoch.`
    );

    alerts.successAlert(
      `Your Balance has received the reward of ${useNumberFormatterPrice(
        toValue(zeroInflation)
      )} ZERO tokens.`
    );

    alerts.successAlert("Vote casted successfully!");

    await spog.fetchTokens();
    balances.refetch();
  } catch (error) {
    console.error("Error casting vote", error);
    alerts.errorAlert("Error when casting vote!");
  }

  isLoading.value = false;
}

const { data: hasFinishedVoting } = useReadContract({
  address: spog.contracts.standardGovernor as Hash,
  abi: standardGovernorAbi,
  functionName: "hasVotedOnAllProposals",
  args: [userAccount as Ref<Hash>, BigInt(spog.epoch?.current?.asNumber || 0)],
  // watch: true,
  query: {
    enabled: isConnected,
  },
});
</script>
