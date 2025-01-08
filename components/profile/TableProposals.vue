<template>
  <UTable :rows="proposalsTableData" :columns="proposalsTableHeaders">
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
    <template #created-data="{ row }">
      <span class="text-grey-600">{{
        useDate(row.created).toFormat("LLL")
      }}</span>
    </template>
    <template #status-data="{ row }">
      <ProposalStatus :version="row.status" />
    </template>
  </UTable>
</template>

<script setup lang="ts">
import { MProposal } from "@/lib/api/types";
import ProposalStatus from "@/components/proposal/Status.vue";

interface Props {
  proposals: MProposal[];
}

const props = defineProps<Props>();

const proposalsTableHeaders = [
  { key: "proposal", label: "Proposal" },
  { key: "action", label: "Action" },
  { key: "created", label: "Created", sortable: true },
  { key: "status", label: "Status", sortable: true },
];

const proposalsTableData = computed(() => {
  return props.proposals.map((p) => ({
    proposalId: p.proposalId,
    proposal: p.description,
    action: p.proposalLabel,
    created: p.timestamp,
    status: p.state,
  }));
});
</script>
