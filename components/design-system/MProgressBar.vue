<template>
  <div
    :class="[
      'w-full',
      'h-3',
      {
        'bg-red-500': hasVotes,
        'bg-gray-200': !hasVotes,
      },
    ]">
    <div>
      <div class="bg-accent-success h-3" :style="`width: ${width}%`" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  export interface MProgressBarProps {
    width: number
    hasVotes: boolean
  }

  withDefaults(defineProps<MProgressBarProps>(), {
    width: 0,
  })
</script>
