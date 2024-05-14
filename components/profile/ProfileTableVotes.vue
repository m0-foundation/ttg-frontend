<template>
  <MSimpleTable :items="votesTableData" :fields="votesTableHeaders">
    <template #cell(proposal)="{ item }">
      <NuxtLink
        class="underline hover:no-underline"
        :to="`/proposal/${item?.proposalId}`"
        >{{ useParsedDescriptionTitle(item.proposal).title }}</NuxtLink
      >
    </template>
    <template #cell(vote)="{ value, item }">
      <span class="text-grey-600 flex items-center gap-2">
        <div
          class="w-2.5 h-2.5"
          :class="value ? 'bg-green-800' : 'bg-red-700'"
        ></div>
        <span class="text-xs uppercase hover:underline">
          <a
            :href="useBlockExplorer('tx', item.transactionHash)"
            target="_blank"
          >
            {{ value ? "Yes" : "No" }}
          </a>
        </span>
      </span>
    </template>
    <template #cell(weight)="{ value }">
      <MAddressAvatar show-copy :address="value" />
    </template>
  </MSimpleTable>
</template>

<script setup lang="ts">
import { MVote } from "@/lib/api/types";
import { formatUnits } from "viem";

interface Props {
  votes: MVote[];
}

const props = defineProps<Props>();
const proposals = useProposalsStore();

const votesTableHeaders = [
  { key: "proposal", label: "Proposal", sortable: true },
  { key: "votes", label: "Votes", sortable: true },
  { key: "vote", label: "Vote", sortable: true },
];

const votesTableData = computed(() => {
  return props.votes.map((v: MVote) => ({
    proposalId: v.proposalId,
    proposal: proposals.getProposalById(v.proposalId)?.description,
    vote: v.support,
    votes:
      v.token === "zero"
        ? useNumberFormatterCompact(formatUnits(v.weight as bigint, 6))
        : useNumberFormatterCompact(String(v.weight)),
    transactionHash: v.transactionHash,
  }));
});
console.log({ votesTableData });
</script>
