<template>
  <div class="flex gap-2">
    <img :src="`/img/status/${version.toLowerCase()}.svg`" alt="" />
    <span class="text-nowrap">
      {{ replaceVersionWord(version)?.toLowerCase() }}</span
    >
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

function replaceVersionWord(version: string): string {
  switch (version) {
    case "Succeeded":
      return "Pending execution";
    case "Pending":
      return "Scheduled";
    default:
      return version;
  }
}
</script>
<style scoped>
div {
  @apply capitalize w-fit font-medium text-sm text-center;
}

.pending {
  @apply border border-grey-400 text-grey-400;
}
.active {
  @apply border  text-green-800;
}
.defeated {
  @apply bg-red-500 text-white;
}

.succeeded {
  @apply bg-green-700 text-green-900;
}

.expired {
  @apply bg-[#EEEEEE] text-[#929492];
}

.executed {
  @apply bg-[#003B2C] text-[#E9FFFA];
}
</style>
