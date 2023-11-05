<template>
  <div class="flex justify-between gap-2 items-center">
    <div class="flex items-end w-[9rem]">
      <MIconZero class="h-4 w-4 mr-1" version="dark" />
      <span class="flex uppercase text-xxs text-grey-400"> zero tokens </span>
    </div>

    <span id="vote-yes-percentage" class="text-green-900 text-xs">
      {{ props.votes?.yes?.percentage.toFixed(1) }}%
    </span>

    <MProgressBar
      version="quorum"
      :quorum="props.zeroQuorum"
      :width="props.votes?.yes?.percentage"
    />

    <span id="vote-no-percentage" class="text-red text-xs flex items-baseline">
      {{ props.votes?.no?.percentage.toFixed(1) }}%
    </span>
  </div>

  <VoteProgressInfoNumbers
    :for="props.votes?.yes?.formatted"
    :againts="props.votes?.no?.formatted"
  />
</template>

<script setup lang="ts">
interface Props {
  zeroQuorum: number;
  votes: {
    total: number;
    yes: {
      count: number;
      formatted: string;
      ratio: number;
      percentage: number;
    };
    no: {
      count: number;
      formatted: string;
      ratio: number;
      percentage: number;
    };
  };
}
const props = defineProps<Props>();
</script>
