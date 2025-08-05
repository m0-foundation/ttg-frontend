<template>
  <div class="my-2">
    <UHorizontalNavigation
      :links="tabsLinks"
      class="border-none mt-4"
      :ui="{
        active: 'text-grey-900 after:bg-grey-900 ',
        base: 'px-4 hover:before:bg-transparent before:rounded-none',
      }" />
    <UDivider />
    <CommonCard>
      <div v-if="selectedTab === 0">
        <ProfileTableVotes :votes="votes" />
      </div>

      <div v-if="selectedTab === 1">
        <ProfileTableProposals :proposals="proposalsCreated" />
      </div>
    </CommonCard>
  </div>
</template>

<script setup lang="ts">
  import { Hash } from 'viem'
  import { MVote } from '@/lib/api/types'

  const props = defineProps<{
    address: Ref<Hash>
  }>()

  const address = toRef(props, 'address')
  const selectedTab = ref(0)

  let votes = ref<MVote[]>([])
  const proposals = useProposalsStore()
  const votesStore = useVotesStore()

  const tabsLinks = computed(() => [
    {
      label: 'Voting History',
      click: () => (selectedTab.value = 0),
      active: selectedTab.value === 0,
    },
    {
      label: 'Submitted Proposals',
      click: () => (selectedTab.value = 1),
      active: selectedTab.value === 1,
    },
  ])

  watch(
    address,
    () => {
      votes = votesStore.getByAddress(address.value)
    },
    { immediate: true },
  )

  const proposalsCreated = computed(() =>
    proposals.getProposalsByProposer(address.value as string),
  )
</script>

<style>
  .table-nav button {
    @apply font-ppformula;
  }
</style>
