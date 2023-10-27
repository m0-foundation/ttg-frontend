<template>
  <NuxtLayout name="proposals">
    <div class="mb-10">
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

const proposals = computed(() => proposalsStore.getProposalsByState("Pending"));
</script>
