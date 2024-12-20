<template>
  <NuxtLayout class="px-6 lg:p-0" name="actors">
    <MSimpleTable
      :search="true"
      :items="earnersClaimants"
      :fields="earnersClaimantsHeaders"
      :loading="isLoading"
    >
      <template #header-left>
        <PageTitle>Earners Claimants</PageTitle>
      </template>

      <template #cell(earner)="{ value }">
        <MAddressCopy :short-address="false" show-copy :address="value" />
      </template>

      <template #cell(claimant)="{ value }">
        <MAddressCopy :short-address="false" show-copy :address="value" />
      </template>
    </MSimpleTable>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Hash, trim, getAddress } from "viem";
import { generateKeyEarnerClaimant } from "@/lib/api/utils";

const apiStore = useApiClientStore();
const listsStore = useListsStore();

useHead({
  titleTemplate: "%s - Actors | $M (wrapped)",
});

const earnersClaimantsHeaders = [
  {
    key: "earner",
    label: "Earner",
    sortable: true,
  },
  { key: "claimant", label: "Claimant", sortable: true },
];

const fetchEarnerClaimants = async () => {
  try {
    if (!listsStore.earners) return undefined;

    const keys = listsStore.earners?.map((earner) =>
      generateKeyEarnerClaimant(earner.account as Hash),
    );

    const claimants =
      await apiStore.client.registrar!.protocolConfigs.getValuesByRawKeys(keys);

    return listsStore.earners
      .map((earner) => {
        const key = generateKeyEarnerClaimant(earner.account as Hash);
        const claimant = claimants.find((c: any) => c.key === key)?.value;
        if (claimant) {
          return {
            earner: earner.account as Hash,
            claimant: getAddress(trim(claimant as Hash)),
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
  null,
);
</script>
