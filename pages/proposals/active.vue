<template>
  <div>
    <ProposalNavbar />
    <LayoutPage>
      <div class="flex justify-between uppercase text-xs mb-6">
        <div class="text-grey-primary">
          Voting cycle: {{ currentEpochAsDate }} - {{ nextEpochAsDate }}
        </div>
        <div>ENDS {{ timeLeft }}</div>
      </div>

      <div v-if="!proposals || !proposals.length">No Active proposals.</div>
      <div
        v-for="proposal in nonEmergencyProposals"
        v-else
        :key="proposal.proposalId"
      >
        <ProposalCard
          :proposal="proposal"
          @on-cast="onCast"
          @on-uncast="onUncast"
        />
      </div>

      <div class="flex justify-between mt-8">
        <p>To submit your vote, please vote on the proposal.</p>
        <MButton
          :disabled="isSelectedCastProposalsEmpty"
          @click="onCastBatchVotes"
        >
          submit votes
        </MButton>
      </div>
    </LayoutPage>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAccount } from "use-wagmi";
import { Hash } from "viem";
import { writeIspogGovernor } from "@/lib/sdk";

interface CastedProposal {
  vote: number;
  proposalId: string;
}

const selectedCastProposals = ref<Array<CastedProposal>>([]);

const isSelectedCastProposalsEmpty = computed(() => {
  return selectedCastProposals.value.length === 0;
});

const proposalsStore = useProposalsStore();
const spog = useSpogStore();

const { epoch } = storeToRefs(spog);
const proposals = computed(() => proposalsStore.getProposalsByState("Active"));

const nonEmergencyProposals = computed(() => {
  return proposals.value.filter((p) => !p.isEmergency);
});

const currentEpochAsDate = computed(() => {
  const { toFormat } = useDate(Number(epoch.value.current?.asTimestamp));
  return toFormat("LLL");
});

const nextEpochAsDate = computed(() => {
  const { toFormat } = useDate(Number(epoch.value.next?.asTimestamp));
  return toFormat("LLL");
});

const timeLeft = computed(() => {
  const { timeAgo } = useDate(Number(epoch.value.next?.asTimestamp));
  return timeAgo;
});

const { address: userAccount } = useAccount();

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
  return writeIspogGovernor({
    address: spog.contracts.governor as Hash,
    functionName: "castVotes",
    args: [proposalIds, votes], // uint256 proposalId, uint8 support
    account: userAccount.value,
  });
}
</script>
