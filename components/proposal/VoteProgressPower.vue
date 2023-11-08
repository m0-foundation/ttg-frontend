<template>
  <div class="flex justify-between gap-2 items-center">
    <div class="flex items-end w-[9rem]">
      <MIconPower class="h-4 w-4 mr-1" />
      <span class="flex uppercase text-xxs text-grey-400"> power tokens </span>
    </div>

    <span id="vote-yes-percentage" class="text-green-900 text-xs">
      {{ props.votes?.yes?.percentage }}%
    </span>

    <MProgressBarQuorum
      v-if="props.quorum"
      :yes="props.votes?.yes?.percentage"
      :no="props.votes?.no?.percentage"
      :quorum="props.quorum"
    />

    <MProgressBar
      v-else
      :width="props.votes?.yes?.percentage"
      :has-votes="hasVotes"
    />

    <span
      id="vote-no-percentage"
      class="text-red-500 text-xs flex items-baseline"
    >
      {{ props.votes?.no?.percentage }}%
    </span>
  </div>

  <VoteProgressInfoNumbers
    :for="props.votes?.yes?.formatted"
    :againts="props.votes?.no?.formatted"
  />
</template>

<script setup lang="ts">
interface Props {
  quorum: number;
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

const hasVotes = computed(
  () => props.votes?.yes?.count > 0 || props.votes?.no?.count > 0
);
</script>
