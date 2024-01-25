<template>
  <NuxtLayout name="proposals">
    <div class="p-8">
      <ProposalList :proposals="proposals">
        <template #emptyState>
          <ProposalListEmptyState>
            No pending proposals
          </ProposalListEmptyState>
        </template>
      </ProposalList>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const proposalsStore = useProposalsStore();

useHead({
  titleTemplate: "%s - Pending proposals",
});

const proposals = computed(() => proposalsStore.getProposalsByState("Pending"));
</script>
