<template>
  <section>
    <PageTitle :title="title">
      <template #pretitle>
        <button
          @click="goBack"
          class="flex flex-inline items-center text-grey-600">
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </template>
      <template #subtitle>
        <div class="text-grey-600 font-inter text-sm">
          <ProposalTypeBadge :type="proposal?.votingType" />
          <span class="px-2">·</span>
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

  function goBack() {
    window.history.length > 1
      ? window.history.back()
      : (window.location.href = '/') // fallback
  }
</script>
