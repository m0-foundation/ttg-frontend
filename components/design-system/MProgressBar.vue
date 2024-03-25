<template>
  <div
    :class="[
      'w-full',
      'h-2',
      {
        'bg-red-500': hasVotes,
        'bg-gray-200': !hasVotes,
      },
    ]"
  >
    <div>
      <div class="bg-green-700 h-2" :style="`width: ${width}%`" />
    </div>
  </div>
</template>

<script lang="ts" setup>
export interface MProgressBarProps {
  width: number;
  hasVotes: boolean;
}

withDefaults(defineProps<MProgressBarProps>(), {
  width: 0,
});
</script>
