<template>
  <section>
    <PageTitle>
      <template #pretitle>
        <MAddressAvatar
          class="normal-case"
          :short-address="!largerThanSm"
          :address="address"
          :show-avatar="false"
        />
      </template>
      <template #title> My Profile </template>
      <template #top-right>
        <NuxtLink to="/delegate/">
          <MButton
            class="w-full justify-center mt-4 lg:mt-0"
            data-test="profile-button-redelegate"
          >
            delegate
          </MButton>
        </NuxtLink>
      </template>
    </PageTitle>

    <UContainer v-if="address" class="py-4">
      <ProfileBalances :address="address" />

      <!-- tables -->
      <ProfileTables :address="address" />
    </UContainer>
    <div
      v-else
      class="flex flex-col items-center justify-center h-80 text-grey-600"
    >
      User not connected
    </div>
  </section>
</template>

<script setup lang="ts">
import { useAccount } from "use-wagmi";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const largerThanSm = useBreakpoints(breakpointsTailwind).greater("sm");
const { address } = useAccount();

useHead({
  titleTemplate: "%s - My profile",
});
</script>
