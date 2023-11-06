<template>
  <div>
    <div class="p-6 pt-2 lg:pt-6 uppercase">
      <p class="text-xs text-grey-400">Proposals</p>
      <div class="lg:flex justify-between">
        <p class="text-lg text-white">
          {{ epoch?.current?.type }} epoch:
          <span class="text-green-700">#{{ epoch?.current?.asNumber }}_</span>
        </p>
        <div class="hidden lg:block">
          <NuxtLink to="/proposals/all/">
            <MNavButton class="underline text-xs text-white">
              all epochs
            </MNavButton>
          </NuxtLink>
        </div>
      </div>

      <p class="text-grey-400 text-xxs lg:text-xs mt-1">
        {{ currentEpochAsDate }} - {{ nextEpochAsDate }} *
        <span>
          ENDS {{ timeLeft }} at block #{{ epoch?.next?.asBlockNumber }}
        </span>
      </p>
    </div>

    <div class="bg-[#1c1c1c]">
      <div
        class="text-white text-xs p-6 pb-4 flex justify-between lg:justify-start gap-4 whitespace-nowrap overflow-x-auto"
      >
        <NuxtLink to="/proposals/">
          <MNavButton class="flex items-center gap-1">
            <span class="lg:hidden">Active</span>
            <span class="hidden lg:inline-block">Current Proposals</span>
            <MBadge>{{ active }}</MBadge>
          </MNavButton>
        </NuxtLink>

        <NuxtLink to="/proposals/emergency/">
          <MNavButton class="flex items-center gap-1">
            Emergency <MBadge version="error">{{ emergency }}</MBadge>
          </MNavButton>
        </NuxtLink>

        <NuxtLink to="/proposals/succeeded/">
          <MNavButton class="flex items-center gap-1">
            Pending Execution <MBadge>{{ pendingExecution }}</MBadge>
          </MNavButton>
        </NuxtLink>

        <NuxtLink to="/proposals/pending/">
          <MNavButton class="flex items-center gap-1">
            Scheduled <MBadge>{{ pending }}</MBadge>
          </MNavButton>
        </NuxtLink>
      </div>

      <div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

const store = useProposalsStore();
const spog = useSpogStore();

const active = computed(
  () => store.getProposalsByState("Active").filter((p) => !p.isEmergency).length
);

const pendingExecution = computed(
  () => store.getProposalsByState("Succeeded").length
);

const emergency = computed(
  () => store.getProposalsByState("Active").filter((p) => p.isEmergency).length
);

const pending = computed(() => store.getProposalsByState("Pending").length);

const { epoch } = storeToRefs(spog);

const currentEpochAsDate = computed(() => {
  const { toFormat } = useDate(Number(epoch.value.current?.asTimestamp));
  return toFormat("D MMM");
});

const nextEpochAsDate = computed(() => {
  const { toFormat } = useDate(Number(epoch.value.next?.asTimestamp));
  return toFormat("D MMM");
});

const timeLeft = computed(() => {
  const { timeAgo } = useDate(Number(epoch.value.next?.asTimestamp));
  return timeAgo;
});
</script>

<style scoped>
.router-link-active button {
  @apply text-white;
}
</style>
