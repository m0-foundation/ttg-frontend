<template>
  <div class="flex justify-between">
    <div class="inline-flex uppercase text-black">
      <div class="text-grey-primary item">status:</div>

      <p :class="[{ active: 'Pending' === version }, 'item']">Pending</p>

      <p :class="[{ active: 'Active' === version }, 'item']">Active</p>

      <p
        v-if="version === 'Defeated'"
        id="proposal-state"
        :class="['defeated', 'item', 'active']"
      >
        Defeated
      </p>

      <p
        v-else
        id="proposal-state"
        :class="[{ active: 'Succeeded' === version }, 'item']"
      >
        Succeeded
      </p>

      <p
        v-if="version === 'Expired'"
        id="proposal-state"
        :class="['expired', 'item', , 'active']"
      >
        Expired
      </p>
      <p
        v-else
        id="proposal-state"
        :class="[{ active: 'Executed' === version }, 'item']"
      >
        Executed
      </p>

      <div class="text-grey-primary item">[?]</div>
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
  @apply flex items-center px-2 py-1 mx-1;
}

/* .text-black > p::before {
  content: "✓";
}

.active ~ p::before {
  content: "";
}

.item + .active::before {
  content: "";
} */

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
