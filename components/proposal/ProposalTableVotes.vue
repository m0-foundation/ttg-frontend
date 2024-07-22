<template>
  <MSimpleTable :items="votes" :fields="votesTableHeaders">
    <template #cell(voter)="{ value }">
      <MAddressAvatar show-copy :address="value" />
    </template>

    <template #cell(vote)="{ value, item }">
      <a
        class="flex items-center gap-2 cursor-pointer hover:underline"
        :href="useBlockExplorer('tx', item.transactionHash)"
      >
        <div
          class="w-2.5 h-2.5"
          :class="value ? 'bg-green-800' : 'bg-red-700'"
        ></div>
        <span class="text-xs uppercase">
          {{ value ? "Yes" : "No" }}
        </span>
      </a>
    </template>
    <template #cell(votes)="{ value }">
      <span>{{ useNumberFormatterCompact(value) }}</span>
    </template>
    <template #cell(reason)="{ value }">
      <div class="flex items-center">
        <VTooltip v-if="value">
          <div
            class="flex justify-center items-center gap-1 text-grey-80 text-xs cursor-pointer"
          >
            <MIconEye class="w-5 h-5" /> Read
          </div>
          <template #popper>
            <div class="max-w-80">
              {{ value }}
            </div>
          </template>
        </VTooltip>
      </div>
    </template>
  </MSimpleTable>
</template>

<script setup lang="ts">
import orderBy from "lodash/orderBy";
import { MVote } from "@/lib/api/types";
import { useNumberFormatterCompact } from "@/utils/numberFormatter";
import { formatUnits } from "viem";

interface Props {
  votes: MVote[];
}

const props = defineProps<Props>();

const votesTableHeaders = ref([
  { key: "voter", label: "Address" },
  { key: "votes", label: "Votes", sortable: true },
  { key: "reason", label: "Reason", sortable: true },
  { key: "vote", label: "Voted", sortable: true },
]);

const votes = computed(() => {
  const votesOrdered = orderBy(props.votes, "weight", "desc");

  return votesOrdered.map((v: MVote) => ({
    voter: v.voter,
    vote: v.support,
    votes: parseInt(
      v.token === "zero"
        ? formatUnits(v.weight as bigint, 6)
        : String(v.weight),
    ),
    transactionHash: v.transactionHash,
    reason: v.reason,
  }));
});
</script>
