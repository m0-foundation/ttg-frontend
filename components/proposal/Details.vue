<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <article class="bg-white text-black px-4 py-4">
      <div class="flex justify-between mb-2">
        <ProposalStatusTimeline
          :proposal="proposal"
          :version="proposal?.state"
        />
        <div>
          <ProposalMenu :proposal="proposal" />
        </div>
      </div>

      <MBadge v-if="proposal?.isEmergency" version="error">
        Emergency proposal
      </MBadge>

      <MBadge v-if="proposal?.votingType === 'Zero'"> Zero proposal </MBadge>

      <h1 class="text-[28px] my-3 text-grey-1000 font-light leading-10">
        {{ title }}
      </h1>

      <div
        class="text-grey-400 my-3 font-inter text-xs truncate w-52 lg:w-full"
      >
        Proposed by
        <u><MAddressAvatar :address="proposal?.proposer" /></u>
        at Epoch #{{ proposal?.epoch }} - {{ proposalCreatedFormatedDate }}
      </div>

      <div v-if="isLoading" class="h-4">Loading...</div>
      <div v-else>
        <ProposalVoteProgress
          v-if="proposal?.state !== 'Pending'"
          :yes-votes="proposal?.yesVotes"
          :no-votes="proposal?.noVotes"
          :version="proposal?.votingType"
          :power-threshold="powerThreshold"
          :power-total-supply="totalSupplyAt[0]"
          :zero-threshold="zeroThreshold"
          :zero-total-supply="totalSupplyAt[1]"
          class="font-inter"
        />
      </div>

      <div class="markdown-body mb-8" v-html="onlyDescriptionHtml"></div>

      <ProposalTechnical
        :proposal="proposal"
        :current-proposal-values="currentProposalValuesFormatted"
      />

      <div class="mt-8">
        <div class="text-grey-900 border-t border-grey-200 border-dashed py-4">
          <h3 class="text-xl">Voters</h3>
        </div>

        <ProposalTableVotes :votes="votes?.value" />
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Hash } from "viem";
import { readPowerToken, readZeroToken } from "@/lib/sdk";
import { watchVoteCast } from "@/lib/watchers";

export interface ProposalDetailsProps {
  proposalId: string;
}

const props = defineProps<ProposalDetailsProps>();

const proposalStore = useProposalsStore();

const proposal = computed(() =>
  proposalStore.getProposalById(props.proposalId),
);
const proposalId = computed(() => props.proposalId);

const { onlyDescriptionHtml, title } = useParsedDescriptionTitle(
  proposal?.value?.description!,
);

const ttg = useTtgStore();
const wagmiConfig = useWagmiConfig();

const { getValuesFormatted: currentProposalValuesFormatted } = storeToRefs(ttg);

useHead({
  titleTemplate: `%s - Proposal #${proposalId.value}`,
});

const { toFormat } = useDate(proposal.value!.timestamp!);
const proposalCreatedFormatedDate = computed(() => toFormat("LLL"));

const zeroThreshold = computed(() =>
  basisPointsToDecimal(ttg.getValues.zeroProposalThresholdRatio!),
);
const powerThreshold = computed(() =>
  basisPointsToDecimal(ttg.getValues.emergencyProposalThresholdRatio!),
);

const votesStore = useVotesStore();
const votes = computed(() => {
  if (proposalId.value) {
    return votesStore.getBy("proposalId", proposalId.value);
  }
});

const { state: totalSupplyAt, isLoading } = useAsyncState(
  Promise.all([
    readPowerToken(wagmiConfig, {
      address: ttg!.contracts!.powerToken! as Hash,
      functionName: "pastTotalSupply",
      args: [BigInt(proposal.value!.epoch!) - 1n],
    }),
    readZeroToken(wagmiConfig, {
      address: ttg!.contracts!.zeroToken! as Hash,
      functionName: "totalSupply",
    }),
  ]),
  [0n, 0n],
);

/*
votesStore.fetchAllVotes request takes a lot of requests since for each vote event it needs to find the Block timestamp then is a RPC request for each vote
Improve this would need to find only events for that proposalI but the event signature does have proposalId as indexed.
Thus need to find all events. What could be done is to fetch only votes of proposal voting type: Standard, Emergency or Zero;
*/
votesStore.fetchVotes(proposal.value!.votingType!);

// update tally on mount
proposalStore.updateProposalById(props.proposalId);

const { unwatchAll } = watchVoteCast(proposal.value!.votingType!);

onUnmounted(() => {
  console.log("unwatching all votes");
  unwatchAll();
});
</script>
