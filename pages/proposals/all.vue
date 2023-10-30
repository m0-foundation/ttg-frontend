<template>
  <div>
    <PageTitle title="All Epochs"></PageTitle>

    <LayoutPage>
      <div v-if="!proposals || !proposals.length">No proposals to show.</div>
      <MTable v-else :config="tableConfig" />
    </LayoutPage>
  </div>
</template>

<script setup lang="ts">
import { html } from "gridjs";
import ProposalStatus from "@/components/proposal/Status.vue";

const store = useProposalsStore();
const proposals = computed(() => store.data);

const tableConfig = {
  columns: [
    {
      id: "proposalId",
      hidden: true,
    },
    {
      id: "epoch",
      name: "Epoch",
      sort: true,
    },
    {
      id: "proposal",
      name: "Proposal",
      sort: true,
      width: "50%",
      formatter: (cell: string, row: any) => {
        const { title } = useParsedDescriptionTitle(cell);
        return html(
          `<a href="/proposal/${row.cells[0].data}/" class="underline">${title}</a>`
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
    {
      id: "status",
      name: "Status",
      sort: true,
      formatter: (cell: string) =>
        html(useComponentToHtml(ProposalStatus, { version: cell }).html),
    },
  ],
  data: proposals.value.map((p) => ({
    proposalId: p.proposalId,
    epoch: p.epoch,
    proposal: p.description,
    action: p.proposalLabel,
    status: p.state,
    created: p.timestamp,
  })),
  search: true,
};
</script>
