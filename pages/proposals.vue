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
        >
          <span class="capitalize">{{
            epoch?.current?.type.toLowerCase()
          }}</span>
        </UTooltip>
        <span>
          epoch
          <span class="text-primary text-2xl">#{{ phasesEpoch }}</span></span
        >
      </template>
      <template #subtitle>
        <div class="flex items-center gap-3 text-grey-500 text-xxs lg:text-xs">
          <span> {{ currentEpochAsDate }} - {{ nextEpochAsDate }}</span>
          <span>·</span>
          <span v-if="nextEpochAsTimeLeft">
            Ends {{ nextEpochAsTimeLeft }}
          </span>
        </div>
      </template>
      <template #bottom-left>
        <UHorizontalNavigation
          :links="proposalsLinks"
          class="border-b border-gray-200 dark:border-gray-800"
        />
      </template>
    </PageTitle>

    <UContainer class="py-8">
      <NuxtPage />
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

const store = useProposalsStore();
const ttg = useTtgStore();

const proposalsLinks = [
  {
    label: "Standard",
    to: "/proposals/",
    exact: true,
  },
  {
    label: "Priority",
    to: "/proposals/priority/",
  },
  {
    label: "Zero",
    to: "/proposals/zero/",
  },
  {
    label: "Pending Execution",
    to: "/proposals/succeeded/",
  },
  {
    label: "Scheduled",
    to: "/proposals/pending/",
  },
];

const standardProposals = computed(
  () =>
    store
      .getProposalsByState("Active")
      .filter((p) => !p.isEmergency && p.votingType !== "Zero").length,
);

const pendingExecution = computed(
  () => store.getProposalsByState("Succeeded").length,
);

const emergency = computed(
  () => store.getProposalsByState("Active").filter((p) => p.isEmergency).length,
);

const zero = computed(
  () =>
    store.getProposalsByState("Active").filter((p) => p.votingType === "Zero")
      .length,
);

const pending = computed(() => store.getProposalsByState("Pending").length);

const { epoch } = storeToRefs(ttg);

const currentEpochAsDate = computed(() => {
  const { toFormat } = useDate(Number(epoch.value.current?.asTimestamp));
  return toFormat("D MMM, hh:mm A");
});

const nextEpochAsDate = computed(() => {
  const { toFormat } = useDate(Number(epoch.value.next?.asTimestamp));
  return toFormat("D MMM, hh:mm A");
});

const getTimeLeft = () => {
  const { timeAgo } = useDate(Number(epoch.value.next?.asTimestamp));
  return timeAgo;
};
const nextEpochAsTimeLeft = ref(getTimeLeft());

onMounted(() => {
  setInterval(() => {
    nextEpochAsTimeLeft.value = getTimeLeft();
  }, 1000);
});

const phasesEpoch = computed(() => {
  return Math.ceil(epoch.value.current!.asNumber / 2);
});
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
