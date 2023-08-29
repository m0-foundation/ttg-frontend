<template>
  <div>
    <div class="px-8 py-4 uppercase">
      <p class="text-lg text-grey-primary">Proposals</p>

      <div class="flex justify-between">
        <p class="text-xl text-white">
          Current epoch:
          <span class="text-primary">#{{ epoch.current.asNumber }}</span>
        </p>
        <div>
          <NuxtLink to="/proposals/all">
            <MNavButton class="underline text-xs text-white">
              all epochs
            </MNavButton>
          </NuxtLink>
        </div>
      </div>

      <p class="text-grey-primary text-xs">
        {{ currentEpochAsDate }} - {{ nextEpochAsDate }} *
        <span>ENDS {{ timeLeft }}</span>
      </p>
    </div>

    <div class="bg-[#1c1c1c]">
      <div class="text-white text-xs p-8 flex justify-start">
        <NuxtLink to="/proposals/active">
          <MNavButton>
            Current Proposals <MBadge>{{ active }}</MBadge>
          </MNavButton>
        </NuxtLink>

        <NuxtLink to="/proposals/active/emergency">
          <MNavButton>
            Emergency <MBadge version="error">{{ emergency }}</MBadge>
          </MNavButton>
        </NuxtLink>

        <NuxtLink to="/proposals/active/succeeded">
          <MNavButton>
            Pending Execution <MBadge>{{ pendingExecution }}</MBadge>
          </MNavButton>
        </NuxtLink>
      </div>

      <div class="px-4 py-2">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

const store = useProposalsStore();
const spog = useSpogStore();

const active = computed(() => store.getProposalsByState("Active").length);
const scheduled = computed(() => store.getProposalsByState("Pending").length);
const pendingExecution = computed(
  () => store.getProposalsByState("Succeeded").length
);
const emergency = computed(() => store.getProposalsTypeEmergency.length);

const { epoch } = storeToRefs(spog);

const currentEpochAsDate = computed(() => {
  const { toFormat } = useDate(Number(epoch.value.current?.asTimestamp));
  return toFormat("LL");
});

const nextEpochAsDate = computed(() => {
  const { toFormat } = useDate(Number(epoch.value.next?.asTimestamp));
  return toFormat("LL");
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
