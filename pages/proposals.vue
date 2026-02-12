<template>
  <div>
    <PageTitle>
      <template #title>
        <UTooltip
          :text="
            epoch?.current?.type === 'TRANSFER'
              ? 'The Transfer Epoch is a non-voting period where transfers and delegation are enabled.'
              : 'The Voting Epoch is where voting takes place on Standard Proposals and transfers and delegation are disabled.'
          "
          :ui="{ base: 'text-clip h-auto font-inter' }">
          <span class="capitalize">
            {{ epoch?.current?.type.toLowerCase() }}
          </span>
        </UTooltip>
        <span>
          epoch #{{ phasesEpoch }}
          <span class="text-accent-blue max-lg:block text-xl lg:text-2xl">
            <span class="lg:inline hidden px-2">·</span>
            <span v-if="nextEpochAsTimeLeft">
              Ends {{ nextEpochAsTimeLeft }}
            </span>
          </span>
        </span>
      </template>
      <template #subtitle>
        <div
          class="flex items-center gap-3 text-grey-500 text-sm lg:text-small">
          <span>
            Started at {{ currentEpochAsDate }}
            <span class="px-2">·</span>
            Ending at
            {{ nextEpochAsDate }}
          </span>
        </div>
      </template>
      <template #bottom-left>
        <UHorizontalNavigation
          :links="
            proposalsLinks.filter((l) => l.badge > 0 || l.label === 'Standard')
          "
          :ui="{
            active: 'text-grey-900 after:bg-grey-900',
            base: 'hover:before:bg-transparent before:rounded-none',
            badge: {
              base: 'bg-accent-blue text-white ring-0 rounded-none',
            },
          }" />
      </template>
    </PageTitle>

    <UContainer class="py-4">
      <NuxtPage />
    </UContainer>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'

  const store = useProposalsStore()
  const ttg = useTtgStore()

  const proposalsLinks = computed(() => [
    {
      label: 'Standard',
      to: '/proposals/',
      badge: standardProposals.value || 0,
      exact: true,
    },
    {
      label: 'Priority',
      to: '/proposals/priority/',
      badge: emergency.value,
    },
    {
      label: 'Zero',
      to: '/proposals/zero/',
      badge: zero.value,
    },
    {
      label: 'Pending Execution',
      to: '/proposals/succeeded/',
      badge: pendingExecution.value,
    },
    {
      label: 'Scheduled',
      to: '/proposals/pending/',
      badge: pending.value,
    },
  ])

  const standardProposals = computed(
    () =>
      store
        .getProposalsByState('Active')
        .filter((p) => !p.isEmergency && p.votingType !== 'Zero').length,
  )

  const pendingExecution = computed(
    () => store.getProposalsByState('Succeeded').length,
  )

  const emergency = computed(
    () =>
      store.getProposalsByState('Active').filter((p) => p.isEmergency).length,
  )

  const zero = computed(
    () =>
      store.getProposalsByState('Active').filter((p) => p.votingType === 'Zero')
        .length,
  )

  const pending = computed(() => store.getProposalsByState('Pending').length)

  const { epoch } = storeToRefs(ttg)

  const currentEpochAsDate = computed(() => {
    const { toFormat } = useDate(Number(epoch.value.current?.asTimestamp))
    return toFormat('D MMMM, hh:mm A')
  })

  const nextEpochAsDate = computed(() => {
    const { toFormat } = useDate(Number(epoch.value.next?.asTimestamp))
    return toFormat('D MMMM, hh:mm A')
  })

  const getTimeLeft = () => {
    const { timeAgo } = useDate(Number(epoch.value.next?.asTimestamp))
    return timeAgo
  }
  const nextEpochAsTimeLeft = ref(getTimeLeft())

  onMounted(() => {
    setInterval(() => {
      nextEpochAsTimeLeft.value = getTimeLeft()
    }, 1000)
  })

  const phasesEpoch = computed(() => {
    return Math.ceil(epoch.value.current!.asNumber / 2)
  })
</script>

<style scoped>
  .router-link-active button {
    @apply text-grey-100;
  }
  .proposals-nav-button {
    @apply text-grey-500 text-base flex items-center gap-1 capitalize font-ppformula;
  }
  .proposals-nav-button span {
    @apply text-xs px-[5px] py-[1px] mb-1 ml-0.5;
  }
</style>
