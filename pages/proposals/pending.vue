<template>
  <NuxtLayout name="proposals">
    <ProposalList :proposals="proposals">
      <template #emptyState>
        <ProposalListEmptyState> No pending proposals </ProposalListEmptyState>
      </template>
    </ProposalList>
  </NuxtLayout>
</template>

<script setup lang="ts">
const proposalsStore = useProposalsStore();

useHead({
  titleTemplate: "%s - Pending proposals",
});

const proposals = computed(() => proposalsStore.getProposalsByState("Pending"));
</script>
