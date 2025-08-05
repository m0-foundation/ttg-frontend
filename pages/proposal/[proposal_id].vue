<template>
  <section>
    <PageTitle :title="title">
      <template #pretitle>
        <ProposalTypeBadge :type="proposal?.votingType" />
      </template>
      <template #subtitle>
        <div class="text-grey-600 font-inter text-sm">
          Proposed by
          <MAddressAvatar :address="proposal?.proposer" />
          <span class="px-2">·</span>
          Epoch #{{ proposal?.epoch }} ({{ formatedProposedDate('LLL') }})
        </div>
      </template>
    </PageTitle>
    <UContainer>
      <ProposalDetails :proposal-id="proposalId" />
    </UContainer>
  </section>
</template>

<script setup lang="ts">
  const proposalStore = useProposalsStore()

  const route = useRoute()
  const proposalId = route.params.proposal_id as string

  const proposal = computed(() => proposalStore.getProposalById(proposalId))

  const { title } = useParsedDescriptionTitle(proposal?.value?.description!)
  const { toFormat: formatedProposedDate } = useDate(proposal.value!.timestamp!)

  useHead({
    titleTemplate: `%s - Proposal #${proposalId}`,
  })
</script>
