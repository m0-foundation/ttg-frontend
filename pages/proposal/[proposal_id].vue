<template>
  <LayoutPage>
    <ProposalDetails :proposal-id="proposalId" />
  </LayoutPage>
</template>

<script setup lang="ts">
const route = useRoute();
const proposalId = route.params.proposal_id as string;
</script>
