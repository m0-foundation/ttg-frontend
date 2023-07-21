<template>
  <div>
    <ProposalNavbar />
    <LayoutPage>
      <div class="flex justify-between uppercase text-xs mb-6">
        <div class="text-grey-primary">Voting cycle: {{ nextEpochAsDate }}</div>
        <div>STARTS {{ timeLeft }}</div>
      </div>

      <div v-if="!proposals || !proposals.length">No Scheduled proposals.</div>
      <MTable v-else :config="tableConfig" />
    </LayoutPage>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import { html } from "gridjs";

const proposalsStore = useProposalsStore();
const spogStateStore = useSpogStore();

const { epoch } = storeToRefs(spogStateStore);

const proposals = computed(() => proposalsStore.getProposalsByState("Pending"));
console.log({ epoch });
const nextEpochAsDate = computed(() => {
  const { toFormat } = useDate(Number(epoch.value.next?.asTimestamp));
  return toFormat("LLL");
});

const timeLeft = computed(() => {
  const { timeAgo } = useDate(Number(epoch.value.next?.asTimestamp));
  return timeAgo;
});

const tableConfig = {
  columns: [
    {
      id: "proposalId",
      hidden: true,
    },
    {
      id: "proposal",
      name: "Proposal",
      sort: true,
      formatter: (cell: string, row: any) => {
        const { title } = useParsedDescriptionTitle(cell);
        return html(
          `<a href="/proposals/${row.cells[0].data}" class="underline">${title}</a>`
        );
      },
    },

    {
      id: "action",
      name: "Action",
      sort: true,
      formatter: (cell: string) =>
        html(`<span class="text-xs text-grey-primary">${cell}</span>`),
    },
    {
      id: "created",
      name: "Created",
      sort: true,
      formatter: (cell: string) => {
        const { toFormat } = useDate(Number(cell));
        const formatedDate = toFormat("LLL");
        return html(
          `<span class="text-xs text-grey-primary">${formatedDate}</span>`
        );
      },
    },
  ],
  data: proposals.value.map((p) => ({
    proposalId: p.proposalId,
    proposal: p.description,
    action: p.proposalLabel,
    created: p.timestamp,
  })),
};
</script>
