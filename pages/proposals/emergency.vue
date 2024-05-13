<template>
  <NuxtLayout name="proposals">
    <div class="modal-backdrop">
      <div class="bg-grey-200 font-inter text-grey-600">
        <header
          class="text-xl bg-accent-blue text-white p-4 flex gap-2 items-center"
        >
          <MIconWarning />
          Your voting power
        </header>

        <section class="text-grey-800 lg:text-xl tracking-tightest p-4">
          <div>
            <p class="text-sm">
              This is your POWER <u>voting power</u> which will be utilized to
              vote base on the previous epoch.
            </p>

            <div class="flex justify-start items-center gap-6 my-2">
              <p>
                <MIconPower class="w-6 inline-block mr-2" version="dark" />
                {{
                  useNumberFormatterPrice(
                    pastVotingPower.power.data.value.formatted,
                  )
                }}
              </p>
              <p class="uppercase text-xxs text-grey-600">voting power</p>
            </div>
          </div>
        </section>
      </div>
    </div>

    <div>
      <ProposalList
        :proposals="emergencyProposals"
        :loading="isLoading"
        @on-cast="onCast"
        @on-uncast="onUncast"
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
import { useMPastVotingPower } from "@/lib/hooks";

interface CastedProposal {
  vote: number;
  proposalId: string;
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

const pastEpoch = computed(() =>
  BigInt(emergencyProposals.value[0].voteStart - 1),
);

const pastVotingPower = useMPastVotingPower({ epoch: pastEpoch, userAccount });

useHead({
  titleTemplate: "%s - Proposals",
});

function onCast(vote: number, proposalId: string) {
  selectedCastProposals.value.push({ vote, proposalId });
}

function onUncast(proposalId: string) {
  console.log("uncast", proposalId, selectedCastProposals.value);
  selectedCastProposals.value = selectedCastProposals.value.filter(
    (p) => p.proposalId !== proposalId,
  );
}

const hasVotedOnAllProposals = ref(false);

// const { data: hasVotedOnAllProposals, ...votedOnAllProposals } =
//   useReadContract({
//     address: ttg.contracts.standardGovernor as Hash,
//     abi: standardGovernorAbi,
//     functionName: "hasVotedOnAllProposals",
//     args: [
//       userAccount as Ref<Hash>,
//       BigInt(ttg.epoch?.current?.asNumber || 0),
//     ],
//     query: {
//       enabled: isConnected,
//     },
//   });
// batch is only for standard proposals
async function onCastBatchVotes() {
  await forceSwitchChain();

  isLoading.value = true;

  try {
    const proposalIds = selectedCastProposals.value.map((p) =>
      BigInt(p.proposalId),
    );
    const votes = selectedCastProposals.value.map((p) => p.vote);

    const hash = await writeEmergencyGovernor(wagmiConfig, {
      address: ttg.contracts.emergencyGovernor as Hash,
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

    alerts.successAlert("Vote casted successfully!");
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
</script>
