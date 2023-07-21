<template>
  <div>
    <nav class="text-white text-xl px-8">
      <MNavButton>Proposals<span class="text-primary">_</span></MNavButton>
    </nav>

    <div class="text-white text-xs bg-black p-8 flex justify-between">
      <div>
        <NuxtLink to="/proposals/active">
          <MNavButton>
            Active <MBadge>{{ active }}</MBadge>
          </MNavButton>
        </NuxtLink>
        <NuxtLink to="/proposals/succeeded">
          <MNavButton>
            Pending Execution <MBadge>{{ pendingExecution }}</MBadge>
          </MNavButton>
        </NuxtLink>
        <NuxtLink to="/proposals/scheduled">
          <MNavButton>
            Scheduled <MBadge>{{ scheduled }}</MBadge>
          </MNavButton>
        </NuxtLink>
        <NuxtLink to="/proposals/emergency">
          <MNavButton>
            Emergency <MBadge version="error">{{ emergency }}</MBadge>
          </MNavButton>
        </NuxtLink>
      </div>
      <div>
        <NuxtLink to="/proposals/history">
          <MNavButton class="underline">History</MNavButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useProposalsStore();

const active = computed(() => store.getProposalsByState("Active").length);
const scheduled = computed(() => store.getProposalsByState("Pending").length);
const pendingExecution = computed(
  () => store.getProposalsByState("Succeeded").length
);
const emergency = computed(() => store.getProposalsTypeEmergency.length);
</script>

<style scoped>
.router-link-active button {
  @apply text-white;
}
</style>
