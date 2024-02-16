<template>
  <div>
    <div class="p-6 pt-2 lg:pt-6">
      <div class="lg:flex justify-between">
        <h1>
          <span class="capitalize">{{
            epoch?.current?.type.toLowerCase()
          }}</span>
          Epoch:
          <span class="text-green-700">#{{ epoch?.current?.asNumber }}_</span>
          <span class="text-grey-600 text-xxs lg:text-xs ml-2">
            {{ currentEpochAsDate }} - {{ nextEpochAsDate }}
          </span>
        </h1>
        <div class="hidden lg:block">
          <NuxtLink to="/proposals/all/">
            <MNavButton
              class="text-sm font-ppformula underline normal-case text-grey-600"
            >
              All proposals
            </MNavButton>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="text-grey-600 p-6 pt-0">
      <h5 class="text-xxs mb-1">Proposals:</h5>

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
            Zero <MBadge>{{ zero }}</MBadge>
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

    <div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

const store = useProposalsStore();
const spog = useSpogStore();

const pendingExecution = computed(
  () => store.getProposalsByState("Succeeded").length
);

const emergency = computed(
  () => store.getProposalsByState("Active").filter((p) => p.isEmergency).length
);

const zero = computed(
  () =>
    store.getProposalsByState("Active").filter((p) => p.votingType === "Zero")
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
</script>

<style scoped>
.router-link-active button {
  @apply text-grey-100;
}
.proposals-nav-button {
  @apply text-grey-500 text-base flex items-center gap-1 capitalize font-ppformula;
}
</style>
