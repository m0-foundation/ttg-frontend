<template>
  <div>
    <div class="p-8 pt-2 lg:pt-6 uppercase">
      <div class="lg:flex justify-between">
        <p class="text-lg text-white">
          {{ epoch?.current?.type }} epoch:
          <span class="text-green-700">#{{ epoch?.current?.asNumber }}_</span>
          <span class="text-grey-400 text-xxs lg:text-xs ml-2">
            {{ currentEpochAsDate }} - {{ nextEpochAsDate }}
          </span>
        </p>
        <div class="hidden lg:block">
          <NuxtLink to="/proposals/all/">
            <MNavButton class="text-xs"> all proposals </MNavButton>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="text-white p-8 py-4 pt-0">
      <h5 class="text-xxs uppercase text-grey-400 mb-2">Proposals:</h5>

      <div
        class="flex justify-between items-center lg:justify-start gap-6 whitespace-nowrap overflow-x-auto text-sm"
      >
        <NuxtLink to="/proposals/">
          <MNavButton class="proposals-nav-button">
            <span class="capitalize">Standard</span>
          </MNavButton>
        </NuxtLink>

        <hr v-if="emergency || zero" class="border-l border-grey-600 h-4" />

        <NuxtLink v-if="emergency" to="/proposals/emergency/">
          <MNavButton class="proposals-nav-button">
            Emergency <MBadge version="error">{{ emergency }}</MBadge>
          </MNavButton>
        </NuxtLink>

        <NuxtLink v-if="zero" to="/proposals/zero/">
          <MNavButton class="proposals-nav-button">
            Zero <MBadge version="error">{{ zero }}</MBadge>
          </MNavButton>
        </NuxtLink>

        <hr
          v-if="pendingExecution || pending"
          class="border-l border-grey-600 h-4"
        />

        <NuxtLink v-if="pendingExecution" to="/proposals/succeeded/">
          <MNavButton class="proposals-nav-button">
            Pending Execution <MBadge>{{ pendingExecution }}</MBadge>
          </MNavButton>
        </NuxtLink>

        <NuxtLink v-if="pending" to="/proposals/pending/">
          <MNavButton class="proposals-nav-button">
            Scheduled <MBadge>{{ pending }}</MBadge>
          </MNavButton>
        </NuxtLink>
      </div>
    </div>
    <div class="bg-[#1c1c1c] p-8">
      <slot />
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

const zero = computed(
  () =>
    store.getProposalsByState("Active").filter((p) => p.proposalType === "Zero")
      .length
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
.proposals-nav-button {
  @apply text-grey-400 flex items-center gap-1 capitalize font-inter;
}
</style>
