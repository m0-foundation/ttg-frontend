<template>
  <div class="w-full bg-red h-3">
    <div class="bg-primary h-3" :style="`width: ${width}`"></div>
  </div>
</template>

<script lang="ts" setup>
export interface MProgressBarProps {
  width: string;
}

const props = withDefaults(defineProps<MProgressBarProps>(), {
  width: "0%",
});
</script>
