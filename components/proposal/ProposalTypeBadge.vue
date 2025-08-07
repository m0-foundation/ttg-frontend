<template>
  <div class="proposal-type-badge" :class="type">
    <VTooltip>
      <span>
        <span class="capitalize">
          {{ type === 'Emergency' ? 'Priority' : type }}
        </span>
        <span v-if="proposalWord">&nbsp;proposal</span>
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
    type: 'Standard' | 'Emergency' | 'Zero'
    proposalWord: boolean
  }

  withDefaults(defineProps<MBadgeProps>(), {
    type: 'Standard',
    proposalWord: true,
  })
</script>

<style scoped>
  .proposal-type-badge {
    @apply inline-flex text-sm font-inter px-2 py-1 border-none;
  }
  .Standard {
    @apply bg-slate-200 text-grey-600;
  }
  .Zero {
    @apply bg-green-700 text-green-900;
  }
  .Emergency {
    @apply bg-blue-700 text-white;
  }
</style>
