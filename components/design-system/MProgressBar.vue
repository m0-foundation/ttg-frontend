<template>
  <div
    :class="[
      'w-full',
      'h-2',
      {
        'bg-red-500': width > 0,
        'bg-gray-200': width === 0,
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
}

const props = withDefaults(defineProps<MProgressBarProps>(), {
  width: 0,
});
</script>
