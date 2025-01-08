<template>
  <UTable :rows="votesTableData" :columns="votesTableHeaders">
    <template #proposal-data="{ row }">
      <NuxtLink
        class="underline hover:no-underline"
        :to="`/proposal/${row?.proposalId}`"
        >{{ useParsedDescriptionTitle(row.proposal).title }}</NuxtLink
      >
    </template>
    <template #vote-data="{ row }">
      <span class="text-grey-600 flex items-center gap-2">
        <div
          class="w-2.5 h-2.5"
          :class="row.vote ? 'bg-green-800' : 'bg-red-700'"
        ></div>
        <span class="text-xs uppercase hover:underline">
          <a
            :href="useBlockExplorer('tx', row.transactionHash)"
            target="_blank"
          >
            {{ row.vote ? "Yes" : "No" }}
          </a>
        </span>
      </span>
    </template>
  </UTable>
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
  { key: "proposal", label: "Proposal" },
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
