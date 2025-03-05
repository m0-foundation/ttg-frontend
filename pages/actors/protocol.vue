<template>
  <section class="flex lg:flex-row flex-col-reverse">
    <div class="max-w-4xl">
      <h1 class="text-2xl lg:text-[36px] lg:leading-tight">Minters</h1>
      <p class="font-inter text-grey-500 mb-4">
        Minters are primarily incentivized to join the protocol because they
        want to earn the spread between the yield (net of expenses) on their
        Eligible Collateral and the protocol’s Minter Rate. In addition, the
        Mint Ratio will determine the attractiveness of Minting relative to the
        yield spread.
      </p>
      <ActorCard
        v-for="minter in combinedMintersList"
        :key="minter.title"
        v-bind="minter"
        :title="minter.title"
        :description="minter.cardDescription"
        :account="minter.account"
        :timestamp="minter.timestamp"
        :website="minter.website"
        :isMinter="minter.isMinter"
        :proposalId="minter.executedEvent?.args?.proposalId"
        :cardImage="minter.image"
      />

      <h1 class="text-2xl lg:text-[36px] lg:leading-tight mt-12">Validators</h1>
      <p class="font-inter text-grey-500 mb-4">
        Economically, all Validators must be incentivized off-chain or use
        periphery smart contracts. There is no Validator compensation in the
        core protocol. This decision was made because the Validator landscape is
        complex and the chance of accurately encapsulating these complex
        economic arrangements on-chain was nil.
      </p>

      <div class="block lg:grid grid-cols-2 gap-4">
        <ActorCard
          v-for="validator in combinedValidatorsList"
          :key="validator.title"
          v-bind="validator"
          :title="validator.title"
          :description="validator.cardDescription"
          :account="validator.account"
          :timestamp="validator.timestamp"
          :website="validator.website"
          :isMinter="validator.isMinter"
          :proposalId="validator.executedEvent.args.proposalId"
          :cardImage="validator.image"
        />
      </div>
    </div>
    <!-- temporary hidden until we have proper texts #smallvictory
    <div class="lg:pl-8 lg:pt-4 pb-8">
      <h2 class="text-xl font-ppformula font-bold mb-4">About actors</h2>
      <p class="font-inter text-grey-500 mb-4">
        Text what is standard proposals $M combines the benefits and convenience
        of digital dollars while approximating the risk profile of physical cash
      </p>
      <NuxtLink to="/" class="font-inter text-grey-500 underline"
        >Learn more</NuxtLink
      >
    </div>
    -->
  </section>

  <section>
    <h1 class="text-2xl lg:text-[36px] lg:leading-tight mt-12">Earners</h1>
    <p class="font-inter text-grey-500 mb-4">
      A holders or distributor of $M whose address is approved by governance to
      earn the Earner Rate.
    </p>

    <div class="flex border-b border-[#E0ECF4] mb-4">
      <span
        class="relative items-center gap-1.5 px-6 py-3.5 rounded-md font-medium text-sm before:absolute before:inset-x-0 before:inset-y-2 before:inset-px before:rounded-md after:absolute after:bottom-0 after:inset-x-2.5 after:block after:h-[2px] after:mt-2 text-gray-900 after:rounded-full cursor-pointer"
        :class="selectedCoin === 'M' ? 'after:bg-primary-500' : ''"
        @click="selectedCoin = 'M'"
        >$M</span
      >
      <span
        class="relative items-center gap-1.5 px-2.5 py-3.5 rounded-md font-medium text-sm before:absolute before:inset-x-0 before:inset-y-2 before:inset-px before:rounded-md after:absolute after:bottom-0 after:inset-x-2.5 after:block after:h-[2px] after:mt-2 text-gray-900 after:rounded-full cursor-pointer"
        :class="selectedCoin === 'WrappedM' ? 'after:bg-primary-500' : ''"
        @click="selectedCoin = 'WrappedM'"
        >$M (Wrapped)</span
      >
    </div>

    <UTable
      :rows="filteredEarnerLists"
      :columns="listTableHeaders"
      v-if="selectedCoin === 'M'"
    >
      <template #account-data="{ row }">
        <MAddressAvatar
          :short-address="false"
          show-copy
          :address="row.account"
        />
      </template>

      <template #timestamp-data="{ row }">
        <span class="text-grey-600">{{
          useDate(row.timestamp).toFormat("DD.MM.YYYY")
        }}</span>
      </template>
      <template #proposal-data="{ row }">
        <UPopover>
          <UButton color="white" icon="i-heroicons-ellipsis-horizontal" />
          <template #panel>
            <div class="text-xxs p-4">
              <UVerticalNavigation
                :links="[
                  {
                    label: 'Executed Earner Proposal',
                    to: `/proposal/${row.proposalId}`,
                  },
                ]"
              />
            </div>
          </template>
        </UPopover>
      </template>
    </UTable>

    <UTable
      v-else
      :loading="isLoading"
      :rows="earnersClaimants || []"
      :columns="earnersClaimantsHeaders"
    >
      <template #earner-data="{ row }">
        <MAddressAvatar
          :short-address="false"
          show-copy
          :address="row.earner"
        />
      </template>
      <template #claimant-data="{ row }">
        <MAddressAvatar
          :short-address="true"
          show-copy
          :address="row.claimant"
        />
      </template>
      <template #timestamp-data="{ row }">
        <span class="text-grey-600">{{
          useDate(row.timestamp).toFormat("DD.MM.YYYY")
        }}</span>
      </template>
      <template #proposal-data="{ row }">
        <UPopover>
          <UButton color="white" icon="i-heroicons-ellipsis-horizontal" />
          <template #panel>
            <div class="text-xxs p-4">
              <UVerticalNavigation
                :links="[
                  {
                    label: 'Executed Earner Proposal',
                    to: `/proposal/${row.proposalId}`,
                  },
                ]"
              />
              <UVerticalNavigation
                :links="[
                  {
                    label: 'Executed Claimant Proposal',
                    to: `/proposal/${row.proposalId}`,
                  },
                ]"
              />
            </div>
          </template>
        </UPopover>
      </template>
    </UTable>
  </section>
</template>

<script setup lang="ts">
import uniqBy from "lodash/uniqBy";
import { Hash, trim, getAddress } from "viem";
import { generateKeyEarnerClaimant } from "@/lib/api/utils";
import { minters, validators } from "@/components/actors/ActorsData";

const apiStore = useApiClientStore();
const proposalsStore = useProposalsStore();
const selectedCoin = ref("M");
const listsStore = useListsStore();

useHead({
  titleTemplate: "%s - Actors - Protocol",
});

const proposals = computed(() => proposalsStore.getProposals);
const lists = computed(() => listsStore.getFlattenLists());
const mintersList = computed(() => listsStore.minters);
const validatorsList = computed(() => listsStore.validators);

const combinedMintersList = computed(() => {
  const combinedArray = mintersList.value.map((e) => {
    const match = minters.find((f) => f.account === e.account);
    const proposal = proposals.value.find(
      (proposal) =>
        proposal.executedEvent?.transactionHash === e.transactionHash
    );

    return match ? { ...e, ...match, ...proposal } : e;
  });
  return combinedArray as any;
});

const combinedValidatorsList = computed(() => {
  const combinedArray = validatorsList.value.map((e) => {
    const match = validators.find((f) => f.account === e.account);
    const proposal = proposals.value.find(
      (proposal) =>
        proposal.executedEvent?.transactionHash === e.transactionHash
    );
    return match ? { ...e, ...match, ...proposal } : e;
  });
  return combinedArray as any;
});

const filteredEarnerLists = computed(() => {
  const listsWithoutDuplicates = uniqBy(
    lists.value,
    (item) => item.account + item.list
  )
    .filter((item) => item.list === "earners")
    .map((item) => {
      const proposal = proposals.value.find(
        (proposal) =>
          proposal.executedEvent?.transactionHash === item.transactionHash
      );
      return { ...item, ...proposal };
    });

  return listsWithoutDuplicates;
});

const fetchEarnerClaimants = async () => {
  try {
    if (!listsStore.earners) return undefined;

    const keys = listsStore.earners?.map((earner) =>
      generateKeyEarnerClaimant(earner.account as Hash)
    );

    const claimants =
      await apiStore.client.registrar!.protocolConfigs.getValuesByRawKeys(keys);

    return listsStore.earners
      .map((earner) => {
        const key = generateKeyEarnerClaimant(earner.account as Hash);
        const claimant = claimants.find((c: any) => c.key === key)?.value;
        const proposal = proposals.value.find(
          (proposal) =>
            proposal.executedEvent?.transactionHash === earner.transactionHash
        );

        if (claimant) {
          return {
            earner: earner.account as Hash,
            claimant: getAddress(trim(claimant as Hash)),
            timestamp: earner.timestamp,
            proposalId: proposal?.proposalId,
            key,
          };
        }
      })
      .filter((item) => item);
  } catch (error) {
    console.error({ error });
    return error;
  }
};

const { isLoading, state: earnersClaimants } = useAsyncState(
  fetchEarnerClaimants(),
  null
);

const listTableHeaders = [
  {
    key: "account",
    label: "Address",
  },
  { key: "timestamp", label: "Updated", sortable: true },
  { key: "proposal", label: "Proposal" },
];

const earnersClaimantsHeaders = [
  {
    key: "earner",
    label: "Address",
  },
  { key: "claimant", label: "Claimant" },
  { key: "timestamp", label: "Erner added" },
  { key: "proposal", label: "Proposal" },
];
</script>
