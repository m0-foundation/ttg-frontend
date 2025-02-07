<template>
  <UTable
    :loading="isLoading"
    :rows="earnersClaimants || []"
    :columns="earnersClaimantsHeaders"
  >
    <template #earner-data="{ row }">
      <MAddressCopy :short-address="false" show-copy :address="row.earner" />
    </template>
    <template #claimant-data="{ row }">
      <MAddressCopy :short-address="false" show-copy :address="row.claimant" />
    </template>
  </UTable>
</template>

<script setup lang="ts">
import { Hash, trim, getAddress } from "viem";
import { generateKeyEarnerClaimant } from "@/lib/api/utils";

const apiStore = useApiClientStore();
const listsStore = useListsStore();

useHead({
  titleTemplate: "%s - Actors - $M (wrapped)",
});

const earnersClaimantsHeaders = [
  {
    key: "earner",
    label: "Earner",
  },
  { key: "claimant", label: "Claimant" },
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
