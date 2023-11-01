<template>
  <div class="flex justify-between gap-2 items-center my-4">
    <div class="flex items-center gap-2">
      <div class="bg-primary-dark h-4 w-4 rounded"></div>
      <div class="uppercase text-xs text-primary-dark">For</div>
      <div class="uppercase text-xs">
        {{ props.for }}
      </div>
    </div>

    <div class="flex items-center gap-2">
      <div class="bg-red h-4 w-4 rounded"></div>
      <div class="uppercase text-xs text-red">Againts</div>
      <div class="uppercase text-xs">
        {{ props.againts }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
export interface Props {
  againts: string;
  for: string;
}

const props = defineProps<Props>();
</script>
