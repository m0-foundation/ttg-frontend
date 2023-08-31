<template>
  <div
    :class="[
      'w-full',
      'h-3',
      { 'bg-red': width > 0, 'bg-gray-200': width === 0 },
    ]"
  >
    <div class="bg-primary h-3" :style="`width: ${width}%`"></div>
  </div>
</template>

<script lang="ts" setup>
export interface MProgressBarProps {
  width: number;
}

const props = withDefaults(defineProps<MProgressBarProps>(), {
  width: 0,
});
</script>
