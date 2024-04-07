<template>
  <MSimpleTable :items="votes" :fields="votesTableHeaders">
    <template #cell(voter)="{ value }">
      <MAddressAvatar show-copy :address="value" />
    </template>

    <template #cell(vote)="{ value, item }">
      <a
        class="flex items-center cursor-pointer"
        :href="useBlockExplorer('tx', item.transactionHash)"
      >
        <div
          class="w-2.5 h-2.5"
          :class="value ? 'bg-green-800' : 'bg-red-600'"
        ></div>
        <span class="text-xs px-2 py-1 uppercase">{{
          value ? "Yes" : "No"
        }}</span>
      </a>
    </template>
  </MSimpleTable>
</template>

<script setup lang="ts">
import orderBy from "lodash/orderBy";
import { MVote } from "@/lib/api/types";
import { useNumberFormatterCompact } from "@/utils/numberFormatter";

interface Props {
  votes: MVote[];
}

const props = defineProps<Props>();

const votesTableHeaders = ref([
  { key: "voter", label: "Address" },
  { key: "votes", label: "Votes", sortable: true },
  { key: "vote", label: "Voted" },
]);

const votes = computed(() => {
  const votesOrdered = orderBy(props.votes, "weight", "desc");

  return votesOrdered.map((v: MVote) => ({
    voter: v.voter,
    vote: v.support,
    castedAt: v.timestamp,
    votes: useNumberFormatterCompact(String(v.weight)),
    transactionHash: v.transactionHash,
  }));
});
</script>
