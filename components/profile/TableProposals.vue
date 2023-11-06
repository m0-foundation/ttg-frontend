<template>
  <div>
    <div
      v-if="!proposals || !proposals.length"
      class="flex flex-col items-center justify-center h-24 text-grey-400"
    >
      <span class="text-lg mb-2 opacity-50">No proposals created by you.</span>
    </div>
    <MTable v-else :config="proposalsTableConfig" />
  </div>
</template>

<script setup lang="ts">
import { html } from "gridjs";
import { MProposal } from "@/lib/api";
import ProposalStatus from "@/components/proposal/Status.vue";

interface Props {
  proposals: MProposal[];
}

const props = defineProps<Props>();

const proposalsTableConfig = computed(() => {
  return {
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
            `<a href="/proposal/${row.cells[0].data}/" class="underline">${title}</a>`
          );
        },
      },

      {
        id: "action",
        name: "Action",
        sort: true,
        formatter: (cell: string) =>
          html(`<span class="text-xs text-grey-400">${cell}</span>`),
      },
      {
        id: "created",
        name: "Created",
        sort: true,
        formatter: (cell: string) => {
          const { toFormat } = useDate(Number(cell));
          const formatedDate = toFormat("LLL");
          return html(
            `<span class="text-xs text-grey-400">${formatedDate}</span>`
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
    data: props.proposals.map((p) => ({
      proposalId: p.proposalId,
      proposal: p.description,
      action: p.proposalLabel,
      status: p.state,
      created: p.timestamp,
    })),
    search: true,
  };
});
</script>
