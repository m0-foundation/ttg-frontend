<template>
  <MSimpleTable
    :search="true"
    :items="proposalsTableData"
    :fields="proposalsTableHeaders"
  >
    <template #cell(proposal)="{ item }">
      <NuxtLink class="underline" :to="`/proposal/${item?.proposalId}`">{{
        useParsedDescriptionTitle(item.proposal).title
      }}</NuxtLink>
    </template>
    <template #cell(action)="{ value }">
      <span class="text-grey-400">{{ value }}</span>
    </template>
    <template #cell(created)="{ value }">
      <span class="text-grey-400"> {{ useDate(value).toFormat("LLL") }}</span>
    </template>
    <template #cell(status)="{ value }">
      <ProposalStatus :version="value" />
    </template>
  </MSimpleTable>
</template>

<script setup lang="ts">
import { MProposal } from "@/lib/api/types";
import ProposalStatus from "@/components/proposal/Status.vue";

interface Props {
  proposals: MProposal[];
}

const props = defineProps<Props>();

const proposalsTableHeaders = [
  { key: "proposal", label: "Proposal", sortable: true },
  { key: "action", label: "Action", sortable: true },
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
