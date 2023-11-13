<template>
  <div>
    <div
      v-if="!votes || !votes.length"
      class="flex flex-col items-center justify-center h-80 text-grey-primary"
    >
      No voting history to show.
    </div>
    <MTable v-else :config="config" />
  </div>
</template>

<script setup lang="ts">
import { html } from "gridjs";
import orderBy from "lodash/orderBy";
import { MVote } from "@/lib/api/types";

interface Props {
  votes: MVote[];
}

const props = defineProps<Props>();

const config = computed(() => {
  const votesOrdered = orderBy(props.votes, "weight", "desc");

  return {
    columns: [
      {
        id: "voter",
        name: "Address",
        sort: false,
        width: 350,
        formatter: (voter: string) => {
          return html(
            `<a href="/profile/${voter}/" class="underline text-xs">${voter}</a>`
          );
        },
      },

      {
        id: "votes",
        name: "Votes",
        sort: true,
      },

      {
        id: "vote",
        name: "support",
        sort: true,
        formatter: (cell: boolean, row: any) => {
          const vote = cell
            ? "<span class='bg-green-700 text-white px-2 py-1'>YES</span>"
            : "<span class='bg-red-500 text-white px-2 py-1'>NO</span>";

          const transactionHash = row.cells[3].data;

          return html(
            `<a href="${useBlockExplorer(
              "tx",
              transactionHash
            )}" target="_blank" class="underline text-xs" >${vote}</a>`
          );
        },
      },

      {
        id: "transactionHash",
        hidden: true,
      },
    ],
    data: votesOrdered.map((v: MVote) => ({
      voter: v.voter,
      vote: v.support,
      castedAt: v.timestamp,
      // hidden
      votes: useNumberFormatter(String(v.weight)),
      transactionHash: v.transactionHash,
    })),
  };
});
</script>
