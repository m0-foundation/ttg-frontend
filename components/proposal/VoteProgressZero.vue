<template>
  <div class="flex justify-between gap-2 items-center">
    <span id="vote-yes-percentage" class="text-grey-500 text-xs">
      {{ props.votes?.yes?.percentage }}%
    </span>

    <span id="vote-yes-percentage" class="text-grey-500 text-xs">
      ({{ props.votes?.yes?.formatted }})
    </span>

    <MProgressBarThreshold
      :yes="props.votes?.yes?.percentage"
      :no="props.votes?.no?.percentage"
      :threshold="thresholdRatioPercentage" />

    <span
      id="vote-no-percentage"
      class="text-grey-500 text-xs flex items-baseline">
      {{ props.votes?.no?.percentage }}%
    </span>

    <span id="vote-yes-percentage" class="text-grey-500 text-xs">
      ({{ props.votes?.no?.formatted }})
    </span>

    <span class="text-grey-500 text-xs uppercase whitespace-nowrap ml-2">
      Threshold: {{ thresholdRatio }}% ({{ props.thresholdFormatted }})
    </span>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    thresholdRatio: number
    thresholdFormatted: string
    votes: {
      total: bigint
      yes: {
        count: bigint
        formatted: string
        percentage: number
      }
      no: {
        count: bigint
        formatted: string
        percentage: number
      }
    }
  }
  const props = defineProps<Props>()

  const thresholdRatioPercentage = props.thresholdRatio / 100
</script>
