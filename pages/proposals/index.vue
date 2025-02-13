<template>
  <div>
    <div
      v-if="
        !hasVotedOnAllProposals &&
        isConnected &&
        hasProposals &&
        hasPowerVotingPower
      "
      class="p-8 py-6 bg-blue-grey font-inter flex flex-col gap-3 text-[#00315B] mb-6"
    >
      <div class="flex flex-col justify-between lg:flex-row gap-3 items-start">
        <div>
          <div class="lg:text-xl tracking-tightest">
            <h3 class="text-2xl mb-1">Vote on all Standard proposals</h3>
            <ul class="list-disc mx-4 text-sm">
              <li>Preserve your voting power for the next epoch.</li>
              <li v-if="Number(powerInflation) != 0">
                Increase your balance by
                {{ useNumberFormatterPrice(powerInflation) }} POWER in the next
                epoch as inflation.
              </li>
              <li v-if="Number(zeroInflation) != 0">
                Receive

                {{ useNumberFormatterPrice(zeroInflation) }} ZERO as rewards
              </li>
            </ul>
          </div>

          <div class="grow flex items-center gap-2 my-2 lg:mb-0">
            <span class="text-xxs lg:text-x text-nowrap uppercase flex gap-3">
              Votes submitted:
              <span>
                {{ selectedVotes.length }} /
                {{ mandatoryToVoteProposals.length }}
              </span>
            </span>
            <div class="w-full lg:h-1/3 bg-white rounded-sm h-1.5">
              <div
                class="bg-accent-blue h-1.5 rounded-sm"
                :style="`width: ${hasVotedOnAllProposals ? 100 : progressBarWidth}%`"
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
        <div class="w-40 flex justify-center">
          <img class="h-32" src="/img/common/banner-m.svg" />
        </div>
      </div>
    </div>
    <div>
      <ProposalList
        :proposals="standardProposals"
        :loading="isLoading"
        @on-cast="onCast"
        @on-uncast="onUncast"
        @update-reason-for-vote="updateReasonForVote"
      >
        <template #emptyState>
          <ProposalListEmptyState>
            No active standard proposals
          </ProposalListEmptyState>
        </template>
      </ProposalList>

      <div
        v-show="hasProposals && isConnected && !hasVotedOnAllProposals"
        class="lg:flex justify-end items-center gap-4 mt-6 py-4 px-8"
        :class="{
          'bg-grey-200': isSelectedCastProposalsFull,
        }"
      >
        <span v-if="!isSelectedCastProposalsFull" class="text-xxs">
          Select YES or NO to submit your vote
        </span>
        <UButton
          id="button-cast-submit"
          class="w-full lg:w-40 flex justify-center"
          :disabled="
            !isSelectedCastProposalsFull || hasVotedOnAllProposals || isLoading
          "
          :is-loading="isLoading"
          data-test="proposal-button-submit-votes"
          color="primary"
          size="lg"
          @click="onCastBatchVotes"
        >
          Submit
        </UButton>
      </div>
    </div>
  </div>
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
  useMVotingPower,
} from "@/lib/hooks";

const isLoading = ref(false);

const proposalsStore = useProposalsStore();
const selectedVotes = useLocalSelectedVotes();
const ttg = useTtgStore();

const activeProposals = computed(() =>
  proposalsStore.getProposalsByState("Active"),
);

const standardProposals = computed(() =>
  activeProposals.value.filter((p) => p.votingType === "Standard"),
);

const mandatoryToVoteProposals = computed(() =>
  activeProposals.value.filter((p) => p.votingType === "Standard"),
);

const hasProposals = computed(
  () => mandatoryToVoteProposals && mandatoryToVoteProposals.value.length > 0,
);

const isSelectedCastProposalsFull = computed(() => {
  return selectedVotes.length >= mandatoryToVoteProposals.value.length;
});

const progressBarWidth = computed(() => {
  return (selectedVotes.length / mandatoryToVoteProposals.value.length) * 100;
});

const { address: userAccount, isConnected } = useAccount();
const { forceSwitchChain } = useCorrectChain();
const wagmiConfig = useWagmiConfig();
const alerts = useAlertsStore();

const powerInflation = useMInflationPowerToken();
const zeroInflation = useMInflationZeroToken();
const balances = useMBalances(userAccount);

const { power: powerVotingPower } = useMVotingPower(userAccount);
const hasPowerVotingPower = computed(
  () => powerVotingPower.data.value?.hasVotingPower,
);
const isDelegatee = computed(
  () =>
    powerVotingPower.data?.value?.value! >
    balances.powerToken.data?.value?.value!,
);

useHead({
  titleTemplate: "%s - Proposals",
});

function onCast(vote: number, proposalId: string) {
  selectedVotes.cast({ proposalId, vote });
}

function updateReasonForVote(value: string, proposalId: string) {
  selectedVotes.update({ proposalId, reason: value });
}

function onUncast(proposalId: string) {
  selectedVotes.remove(proposalId);
}

const { data: hasVotedOnAllProposals, ...votedOnAllProposals } =
  useReadContract({
    address: ttg.contracts.standardGovernor as Hash,
    abi: standardGovernorAbi,
    functionName: "hasVotedOnAllProposals",
    args: [userAccount as Ref<Hash>, BigInt(ttg.epoch?.current?.asNumber || 0)],
    query: {
      enabled: isConnected,
    },
  });
// batch is only for standard proposals
async function onCastBatchVotes() {
  await forceSwitchChain();

  isLoading.value = true;
  // slight chance after confirmation the voting power is updated before the check is done,
  // thus making a copy of value before the transaction
  const isDelegateeStored = isDelegatee.value;

  try {
    let hash;
    const { reasons, proposalIds, votes } = selectedVotes.selected.reduce(
      (result, vote) => {
        result.reasons.push(vote.reason || "");
        result.proposalIds.push(BigInt(vote.proposalId));
        result.votes.push(vote.vote);
        return result;
      },
      {
        reasons: [] as string[],
        proposalIds: [] as bigint[],
        votes: [] as number[],
      },
    );

    const isOnlyOneVote = selectedVotes.length === 1;
    const anyProposalHasReason = selectedVotes.selected.some((p) => p.reason);

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

    alerts.successAlert(
      `Your Balance has received the reward of ${useNumberFormatterPrice(
        toValue(zeroInflation),
      )} ZERO tokens.`,
    );

    if (isDelegateeStored) {
      alerts.successAlert(
        "Vote casted successfully! Your POWER voting power has increased.",
      );
    } else {
      alerts.successAlert(
        `Vote casted successfully! Your will receive ${useNumberFormatterPrice(
          toValue(powerInflation),
        )} POWER tokens in the next epoch.`,
      );
    }

    selectedVotes.clean();
    await ttg.fetchTokens();
    balances.refetch();
    votedOnAllProposals.refetch();
  } catch (error: any) {
    console.log("Error casting vote", { error });
    if (error.transactionHash) {
      alerts.errorAlert(
        `Error when casting vote! <br/> See <a class="underline" target="_blank" href=${useBlockExplorer("tx", error.transactionHash)}>transaction</a>.`,
      );
    } else {
      alerts.errorAlert(`Transaction not sent! ${error.shortMessage}`);
    }
  }

  isLoading.value = false;
}

const castSingleVoteWithReason = (
  proposalId: bigint,
  vote: number,
  reason: string,
) => {
  return writeStandardGovernor(wagmiConfig, {
    address: ttg.contracts.standardGovernor as Hash,
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
  return writeStandardGovernor(wagmiConfig, {
    address: ttg.contracts.standardGovernor as Hash,
    functionName: "castVotesWithReason",
    args: [proposalIds, votes, reasons], // uint256[] proposalId, uint8[] support, string[] reason
    account: userAccount.value,
  });
};

const castSingleVote = (proposalId: bigint, vote: number) => {
  return writeStandardGovernor(wagmiConfig, {
    address: ttg.contracts.standardGovernor as Hash,
    functionName: "castVote",
    args: [proposalId, vote], // uint256 proposalId, uint8 support, string reason
    account: userAccount.value,
  });
};

const castVotes = (proposalIds: bigint[], votes: number[]) => {
  return writeStandardGovernor(wagmiConfig, {
    address: ttg.contracts.standardGovernor as Hash,
    functionName: "castVotes",
    args: [proposalIds, votes], // uint256[] proposalId, uint8[] support
    account: userAccount.value,
  });
};
</script>
