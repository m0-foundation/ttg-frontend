<template>
  <div :class="['w-full', 'h-2', 'bg-gray-200']">
    <div class="overflow-hidden h-2 mb-4 flex justify-between bg-gray-200">
      <div
        :style="`width: ${yes}%`"
        class="shadow-none flex flex-col text-center whitespace-nowrap justify-center bg-accent-success" />
      <div
        :style="`width: ${no}%`"
        class="shadow-none flex flex-col text-center whitespace-nowrap justify-center bg-red-500" />
    </div>
    <div class="threshold" :style="style" />
  </div>
</template>

<script lang="ts" setup>
  export interface Props {
    yes: number
    no: number
    threshold: number
  }

  const props = withDefaults(defineProps<Props>(), {
    yes: 0,
    no: 0,
    threshold: 0.5,
  })

  const style = computed(() => {
    return {
      left: `${props.threshold * 100}%`,
    }
  })
</script>

<style scoped>
  .threshold {
    @apply relative z-10 border-r-2 border-gray-400 w-[2px] h-6 top-[-2rem];
  }
</style>
