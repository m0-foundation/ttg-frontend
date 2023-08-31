<template>
  <div>
    <div class="my-4">
      <div class="flex justify-between gap-2 items-center">
        <span id="vote-yes-percentage" class="text-primary-darker text-xs">
          {{ votes?.yes?.percentage }}%
        </span>

        <MProgressBar :width="votes?.yes?.percentage" />

        <span
          id="vote-no-percentage"
          class="text-red text-xs flex items-baseline"
        >
          {{ votes?.no?.percentage }}%
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProposalVotesState } from "~/lib/api";

interface Props {
  votes: ProposalVotesState;
}
const props = defineProps<Props>();
</script>
