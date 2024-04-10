<template>
  <MSimpleTable :items="votesTableData" :fields="votesTableHeaders">
    <template #cell(proposal)="{ item }">
      <NuxtLink class="underline" :to="`/proposal/${item?.proposalId}`">{{
        useParsedDescriptionTitle(item.proposal?.description).title
      }}</NuxtLink>
    </template>
    <template #cell(vote)="{ value }">
      <span>
        <span v-if="value" class="bg-green-700 px-2 py-1 text-grey-600">
          YES
        </span>
        <span v-else class="bg-red-700 px-2 py-1 text-white">NO</span>
      </span>
    </template>
    <template #cell(castedAt)="{ value }">
      <span class="text-grey-600"> {{ useDate(value).toFormat("LLL") }}</span>
    </template>
  </MSimpleTable>
</template>

<script setup lang="ts">
import { MVote } from "@/lib/api/types";

interface Props {
  votes: MVote[];
}

const props = defineProps<Props>();
const proposals = useProposalsStore();

const votesTableHeaders = [
  { key: "proposal", label: "Proposal", sortable: true },
  { key: "vote", label: "Vote", sortable: true },
  { key: "castedAt", label: "Casted at", sortable: true },
];

const votesTableData = computed(() => {
  return props.votes.map((v: MVote) => ({
    proposalId: v.proposalId,
    proposal: proposals.getProposalById(v.proposalId),
    vote: v.support,
    weight: v.weight,
    transactionHash: v.transactionHash,
    castedAt: v.timestamp,
  }));
});
</script>
