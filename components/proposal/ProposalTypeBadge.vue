<template>
  <div class="proposal-type-badge" :class="type">
    <VTooltip>
      <span>
        <span class="capitalize">{{ type }}</span> proposal
      </span>

      <template #popper>
        <span class="text-sm">
          Voting for this proposal is
          <span v-if="type === 'Standard'">mandatory</span>
          <span v-else>optional</span>
        </span>
      </template>
    </VTooltip>
  </div>
</template>

<script lang="ts" setup>
export interface MBadgeProps {
  type: "Standard" | "Emergency" | "Zero";
}

withDefaults(defineProps<MBadgeProps>(), {
  type: "Standard",
});
</script>
<style scoped>
.proposal-type-badge {
  @apply inline-flex text-xs font-inter px-2 py-1 border-none;
}
.Standard {
  @apply bg-white text-grey-900;
}
.Zero {
  @apply bg-green-700 text-green-900;
}
.Emergency {
  @apply bg-red-700 text-white;
}
</style>
