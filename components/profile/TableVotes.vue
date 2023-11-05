<template>
  <div>
    <div
      v-if="!votes || !votes.length"
      class="flex flex-col items-center justify-center h-24 text-grey-400"
    >
      <span class="text-lg mb-2 opacity-50">No voting history to show.</span>
      <span class="text-xs font-light opacity-50"
        >Check later for updates.</span
      >
    </div>
    <MTable v-else :config="votesTableConfig" />
  </div>
</template>

<script setup lang="ts">
import { html } from "gridjs";
import { MProposal, MVote } from "@/lib/api/types";

interface Props {
  votes: MVote[];
}

const props = defineProps<Props>();
const proposals = useProposalsStore();

const votesTableConfig = computed(() => {
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
        formatter: (proposal: MProposal) => {
          const { title } = useParsedDescriptionTitle(proposal.description);
          return html(
            `<a href="/proposal/${proposal.proposalId}/" class="underline">${title}</a>`
          );
        },
      },

      {
        id: "vote",
        name: "vote",
        sort: true,
        formatter: (vote: boolean) => {
          return html(
            vote
              ? "<span class='bg-primary text-body-black px-2 py-1'>YES</span>"
              : "<span class='bg-red-500 text-white px-2 py-1'>NO</span>"
          );
        },
      },

      {
        id: "castedAt",
        name: "Casted at",
        sort: true,
        formatter: (cell: string) => {
          const { toFormat } = useDate(Number(cell));
          const formatedDate = toFormat("LLL");
          return html(
            `<span class="text-xs text-grey-400">${formatedDate}</span>`
          );
        },
      },
    ],
    data: props.votes.map((v: MVote) => ({
      proposalId: v.proposalId,
      proposal: proposals.getProposalById(v.proposalId),
      vote: v.support,
      weight: v.weight,
      transactionHash: v.transactionHash,
      castedAt: v.timestamp,
    })),
    search: true,
  };
});
</script>
