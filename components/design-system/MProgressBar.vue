<template>
  <div
    :class="[
      'w-full',
      'h-2',
      { 'bg-red': version === 'majority', 'bg-gray-200': version === 'quorum' },
    ]"
  >
    <div>
      <div class="bg-primary h-2" :style="`width: ${width}%`"></div>
      <div v-if="version === 'quorum'" class="quorum" :style="style" />
    </div>
  </div>
</template>

<script lang="ts" setup>
export interface MProgressBarProps {
  width: number;
  version: "majority" | "quorum";
  quorum?: number;
}

const props = withDefaults(defineProps<MProgressBarProps>(), {
  width: 0,
  version: "majority",
  quorum: 0.5,
});

const style = computed(() => {
  return {
    left: `${props.quorum * 100}%`,
  };
});
</script>

<style scoped>
.quorum {
  @apply relative z-10 border-r-2 border-gray-400 w-2 h-6 top-[-1rem];
}
</style>
