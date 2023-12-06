<template>
  <div>
    <PageTitle>All Proposals</PageTitle>

    <LayoutPage>
      <div v-if="!proposals || !proposals.length">No proposals to show.</div>
      <MTable v-else :config="tableConfig" />
    </LayoutPage>
  </div>
</template>

<script setup lang="ts">
import { html } from "gridjs";
import ProposalStatus from "@/components/proposal/Status.vue";
import MIconPower from "@/components/design-system/MIconPower.vue";
import MIconZero from "@/components/design-system/MIconZero.vue";

const store = useProposalsStore();
const proposals = computed(() => store.data);

useHead({
  titleTemplate: "%s - All proposals",
});

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
        html(
          `<span class="text-xs text-grey-400 whitespace-nowrap">${cell}</span>`
        ),
    },

    {
      id: "votingType",
      name: "Tokens",
      sort: true,
      width: "10%",
      formatter: (cell: string, row: any) => {
        const PowerIcon = useComponentToHtml(MIconPower, {
          class: "h-5 w-5 ml-1",
        }).html;
        const ZeroIcon = useComponentToHtml(MIconZero, {
          class: "h-5 w-5 ml-1",
        }).html;

        if (["Power", "Emergency"].includes(cell)) {
          return html(PowerIcon);
        }

        if (["Zero"].includes(cell)) {
          return html(ZeroIcon);
        }

        if (["Double"].includes(cell)) {
          return html(`
            <div class="flex">
             ${PowerIcon}
             ${ZeroIcon}
            </div>
          `);
        }
      },
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
  data: proposals.value.map((p) => ({
    proposalId: p.proposalId,
    epoch: p.epoch,
    proposal: p.description,
    action: p.proposalLabel,
    votingType: p.votingType,
    status: p.state,
    created: p.timestamp,
  })),
  search: true,
};
</script>
