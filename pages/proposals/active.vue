<template>
  <div>
    <ProposalNavbar />
    <LayoutPage>
      <div class="flex justify-between uppercase text-xs mb-6">
        <div>
          <span class="text-white text-lg mr-2">
            EPOCH #{{ epoch.current.asNumber }}
          </span>
          <span class="text-grey-primary text-xs">
            {{ currentEpochAsDate }} - {{ nextEpochAsDate }}
          </span>
        </div>
        <div>ENDS {{ timeLeft }}</div>
      </div>

      <div v-if="!hasProposals">No Active proposals.</div>
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

      <div v-show="hasProposals" class="flex justify-between mt-8">
        <p v-if="!hasFinishedVoting">
          To submit your vote, please vote on the proposal.
        </p>
        <p v-else class="text-grey-primary">Your votes has been submitted</p>
        <MButton
          id="button-cast-submit"
          :disabled="
            !isSelectedCastProposalsFull || hasFinishedVoting || isDisconnected
          "
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
import { Hash } from "viem";
import { useAccount, useContractRead } from "use-wagmi";
import { writeIspogGovernor, ispogGovernorABI } from "@/lib/sdk";

interface CastedProposal {
  vote: number;
  proposalId: string;
}

const selectedCastProposals = ref<Array<CastedProposal>>([]);

const config = useRuntimeConfig();
const proposalsStore = useProposalsStore();
const spog = useSpogStore();

const { epoch } = storeToRefs(spog);
const proposals = computed(() => proposalsStore.getProposalsByState("Active"));

const hasProposals = computed(() => proposals && proposals.value.length > 0);

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

const isSelectedCastProposalsFull = computed(() => {
  return selectedCastProposals.value.length === proposals.value.length;
});

const { address: userAccount, isDisconnected } = useAccount();

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

const { data: hasFinishedVoting } = useContractRead({
  address: spog.contracts.governor as Hash,
  abi: ispogGovernorABI,
  functionName: "hasFinishedVoting",
  args: [
    BigInt(epoch.value.current?.asNumber),
    (userAccount.value || config.public.NULL_ADDRESS) as Hash,
  ],
  watch: true,
});
</script>
