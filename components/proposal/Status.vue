<template>
  <div :class="version?.toLowerCase()">
    {{ version?.toLowerCase() }}
  </div>
</template>

<script lang="ts" setup>
export interface ProposalStatusProps {
  version:
    | "Pending"
    | "Active"
    | "Defeated"
    | "Succeeded"
    | "Expired"
    | "Executed";
}

const props = withDefaults(defineProps<ProposalStatusProps>(), {
  version: "Pending",
});
</script>
<style scoped>
div {
  @apply uppercase w-fit font-medium text-sm px-4 py-2 text-center;
}

.pending {
  @apply border border-grey-400 text-grey-400;
}
.active {
  @apply border border-primary text-green-800;
}
.defeated {
  @apply bg-red text-white;
}

.succeeded {
  @apply bg-primary text-primary-darker;
}

.expired {
  @apply bg-[#EEEEEE] text-[#929492];
}

.executed {
  @apply bg-[#003B2C] text-[#E9FFFA];
}
</style>
