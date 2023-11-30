<template>
  <div class="flex justify-between gap-2 items-center">
    <div class="flex items-start mr-2 w-12">
      <MIconPower class="h-4 w-4 mr-1" />
      <span class="flex uppercase text-xxs text-grey-400">power</span>
    </div>

    <div class="bg-green-800 h-2 w-2"></div>

    <span id="vote-yes-percentage" class="text-green-800 text-xs">
      {{ props.votes?.yes?.percentage }}%
    </span>

    <span id="vote-yes-percentage" class="text-grey-400 text-xs">
      ({{ props.votes?.yes?.formatted }})
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

    <div class="bg-red-500 h-2 w-2"></div>

    <span
      id="vote-no-percentage"
      class="text-red-500 text-xs flex items-baseline"
    >
      {{ props.votes?.no?.percentage }}%
    </span>

    <span id="vote-yes-percentage" class="text-grey-400 text-xs">
      ({{ props.votes?.no?.formatted }})
    </span>

    <span
      v-show="quorumFormatted"
      class="text-grey-400 text-xs uppercase whitespace-nowrap ml-2"
    >
      Threshold: {{ props.quorum * 100 }}% ({{ props.quorumFormatted }})
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  quorum: number;
  quorumFormatted?: string;
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
