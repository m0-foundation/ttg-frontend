<template>
  <section>
    <PageTitle>
      <template #title> My Profile </template>
      <template #top-right>
        <NuxtLink to="/delegate/">
          <UButton
            class="w-full justify-center"
            data-test="profile-button-redelegate"
            color="primary"
          >
            Delegate
          </UButton>
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

const { address } = useAccount();

useHead({
  titleTemplate: "%s - My profile",
});
</script>
