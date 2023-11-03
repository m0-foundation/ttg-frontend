<template>
  <div class="flex justify-between">
    <div
      class="inline-flex uppercase text-black text-xs gap-1 lg:gap-2 items-center"
    >
      <div class="text-grey-primary hidden lg:block">status:</div>

      <p
        :id="version === 'Pending' ? 'proposal-state' : undefined"
        :class="[{ active: 'Pending' === version }, 'item']"
      >
        pending
      </p>

      <p
        :id="version === 'Active' ? 'proposal-state' : undefined"
        :class="[{ active: 'Active' === version }, 'item']"
      >
        active
      </p>

      <p
        v-if="version === 'Defeated'"
        :id="version === 'Defeated' ? 'proposal-state' : undefined"
        :class="['defeated', 'item', 'active']"
      >
        defeated
      </p>

      <p
        v-else
        :id="version === 'Succeeded' ? 'proposal-state' : undefined"
        :class="[{ active: 'Succeeded' === version }, 'item']"
      >
        succeeded
      </p>

      <p
        v-if="version === 'Expired'"
        :id="version === 'Expired' ? 'proposal-state' : undefined"
        :class="['expired', 'item', 'active']"
      >
        expired
      </p>
      <p
        v-else
        :id="version === 'Executed' ? 'proposal-state' : undefined"
        :class="[{ active: 'Executed' === version }, 'item']"
      >
        executed
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Props {
  version: string;
}

const props = defineProps<Props>();
</script>

<style scoped>
.item {
  @apply flex items-center py-1 px-2 lg:px-3;
}

.active {
  @apply bg-[#00664E] text-[#5CC99E];
}
.active ~ p {
  @apply text-grey-primary;
}

.defeated {
  @apply bg-red text-white;
}

.expired {
  @apply bg-[#EEEEEE] text-[#929492];
}
</style>
